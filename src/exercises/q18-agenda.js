import { requireSupabase } from '../lib/supabase.js'

export async function render(root) {
  const supabase = requireSupabase()
  root.innerHTML = `<h2>Agenda de horários</h2><p>Selecione um horário disponível para reservá-lo.</p><div id="schedule" class="list">Carregando horários...</div><div id="schedule-message" aria-live="polite"></div>`
  const list = root.querySelector('#schedule')
  const message = root.querySelector('#schedule-message')
  let disposed = false
  const load = async () => {
    const { data, error } = await supabase.from('horarios').select('id,horario,reservado,reservado_por').order('horario')
    if (disposed) return
    if (error) { list.innerHTML = `<div class="notice error">${error.message}</div>`; return }
    list.innerHTML = data.length ? data.map(item => `
      <article class="list-item"><div><strong>${escapeHtml(item.horario)}</strong><div class="hint">${item.reservado ? 'Indisponível' : 'Disponível'}</div></div>
      <button class="btn ${item.reservado ? 'secondary' : ''}" data-reserve="${item.id}" type="button" ${item.reservado ? 'disabled' : ''}>${item.reservado ? 'Reservado' : 'Reservar'}</button></article>
    `).join('') : '<p class="muted">Nenhum horário cadastrado.</p>'
  }
  list.addEventListener('click', async event => {
    const button = event.target.closest('[data-reserve]')
    if (!button) return
    button.disabled = true
    const { data: { user } } = await supabase.auth.getUser()
    const update = { reservado: true }
    if (user?.id) update.reservado_por = user.id
    // O filtro reservado=false impede que uma reserva já realizada seja sobrescrita.
    const { data, error } = await supabase.from('horarios')
      .update(update).eq('id', button.dataset.reserve).eq('reservado', false)
      .select('id').maybeSingle()
    if (error) {
      message.innerHTML = `<div class="notice error">${error.message}</div>`
    } else if (!data) {
      message.innerHTML = '<div class="notice error">Este horário acabou de ser reservado por outra pessoa. Escolha outro.</div>'
    } else {
      message.innerHTML = '<div class="notice success">Horário reservado com sucesso!</div>'
    }
    await load()
  })
  const channel = supabase.channel('agenda-atualizada')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'horarios' }, load)
    .subscribe()
  await load()
  return () => { disposed = true; supabase.removeChannel(channel) }
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
}
