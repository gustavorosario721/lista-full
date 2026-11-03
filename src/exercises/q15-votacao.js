import { requireSupabase } from '../lib/supabase.js'

export async function render(root) {
  const supabase = requireSupabase()
  root.innerHTML = `<h2>Votação de representante</h2><p>Escolha um candidato e confirme seu voto. A contagem é atualizada pelo banco.</p><div id="candidates" class="list">Carregando candidatos...</div><div id="vote-message" aria-live="polite"></div>`
  const list = root.querySelector('#candidates')
  const message = root.querySelector('#vote-message')
  let disposed = false
  const load = async () => {
    const { data, error } = await supabase.from('candidatos').select('id,nome,votos').order('nome')
    if (disposed) return
    if (error) { list.innerHTML = `<div class="notice error">${error.message}</div>`; return }
    list.innerHTML = data.length ? data.map(candidate => `
      <article class="list-item"><div><strong>${escapeHtml(candidate.nome)}</strong><div class="hint">${Number(candidate.votos) || 0} voto(s)</div></div>
      <button class="btn" data-vote="${candidate.id}" type="button">Votar</button></article>
    `).join('') : '<p class="muted">Nenhum candidato cadastrado.</p>'
  }
  list.addEventListener('click', async event => {
    const button = event.target.closest('[data-vote]')
    if (!button) return
    button.disabled = true
    // A RPC executa votos = votos + 1 no banco, de forma atômica.
    const { error } = await supabase.rpc('increment_candidate_vote', { candidate_id: button.dataset.vote })
    if (error) {
      message.innerHTML = `<div class="notice error">${error.message}. Confira se a função SQL increment_candidate_vote foi criada.</div>`
    } else {
      message.innerHTML = '<div class="notice success">Voto contabilizado!</div>'
      await load()
    }
    button.disabled = false
  })
  const channel = supabase.channel('votacao-atualizada')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'candidatos' }, load)
    .subscribe()
  await load()
  return () => { disposed = true; supabase.removeChannel(channel) }
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
}
