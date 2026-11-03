import { requireSupabase } from '../lib/supabase.js'

export async function render(root) {
  const supabase = requireSupabase()
  root.innerHTML = `
    <h2>Comentários</h2><p>Escreva um comentário com até 200 caracteres. A lista é sincronizada em tempo real.</p>
    <form id="comment-form">
      <div class="field"><label for="comment">Seu comentário</label><textarea id="comment" maxlength="200" placeholder="Digite aqui..." required></textarea><small id="counter" class="hint">200 caracteres restantes</small></div>
      <button class="btn" type="submit">Publicar comentário</button>
    </form>
    <div id="comment-message" aria-live="polite"></div><h3>Comentários publicados</h3><div id="comments" class="list"></div>
  `
  const textarea = root.querySelector('#comment')
  const counter = root.querySelector('#counter')
  const list = root.querySelector('#comments')
  const message = root.querySelector('#comment-message')
  let disposed = false
  textarea.addEventListener('input', () => { counter.textContent = `${200 - textarea.value.length} caracteres restantes` })
  const load = async () => {
    const { data, error } = await supabase.from('comentarios').select('id,texto,created_at').order('created_at', { ascending: false })
    if (disposed) return
    if (error) { list.innerHTML = `<div class="notice error">${error.message}</div>`; return }
    list.innerHTML = data.length ? data.map(item => `
      <article class="list-item"><div><div>${escapeHtml(item.texto)}</div><small class="hint">${item.created_at ? new Date(item.created_at).toLocaleString('pt-BR') : ''}</small></div></article>
    `).join('') : '<p class="muted">Ainda não há comentários.</p>'
  }
  root.querySelector('#comment-form').addEventListener('submit', async event => {
    event.preventDefault()
    const texto = textarea.value.trim()
    if (!texto) { message.innerHTML = '<div class="notice error">Digite um comentário.</div>'; return }
    const { error } = await supabase.from('comentarios').insert({ texto })
    if (error) { message.innerHTML = `<div class="notice error">${error.message}</div>`; return }
    textarea.value = ''
    counter.textContent = '200 caracteres restantes'
    message.innerHTML = '<div class="notice success">Comentário publicado!</div>'
    await load()
  })
  const channel = supabase.channel('comentarios-em-tempo-real')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'comentarios' }, load)
    .subscribe()
  await load()
  return () => { disposed = true; supabase.removeChannel(channel) }
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
}
