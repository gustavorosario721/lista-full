import { requireSupabase } from '../lib/supabase.js'

export async function render(root) {
  const supabase = requireSupabase()
  root.innerHTML = `
    <h2>Login e cadastro acadêmico</h2>
    <p>Entre com seu e-mail e senha ou crie uma conta no Supabase Auth.</p>
    <form id="auth-form">
      <div class="field"><label for="email">E-mail</label><input id="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="password">Senha</label><input id="password" type="password" autocomplete="current-password" minlength="6" required></div>
      <div class="actions"><button class="btn" type="submit">Entrar</button><button class="btn secondary" id="signup" type="button">Criar conta</button><button class="btn secondary" id="logout" type="button">Sair</button></div>
    </form><div id="auth-message" aria-live="polite"></div><div id="session-info" class="hint"></div>
  `
  const form = root.querySelector('#auth-form')
  const message = root.querySelector('#auth-message')
  const sessionInfo = root.querySelector('#session-info')
  const show = (text, type='info') => { message.innerHTML = `<div class="notice ${type}">${text}</div>` }
  const refreshSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    sessionInfo.textContent = session ? `Conectado como ${session.user.email}` : 'Nenhum usuário conectado.'
  }
  form.addEventListener('submit', async event => {
    event.preventDefault()
    const email = root.querySelector('#email').value.trim()
    const password = root.querySelector('#password').value
    if (!email || !password) return show('Preencha e-mail e senha.', 'error')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return show(error.message, 'error')
    show('Login realizado com sucesso!', 'success')
    await refreshSession()
  })
  root.querySelector('#signup').addEventListener('click', async () => {
    const email = root.querySelector('#email').value.trim()
    const password = root.querySelector('#password').value
    if (!email || password.length < 6) return show('Informe um e-mail válido e uma senha com pelo menos 6 caracteres.', 'error')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return show(error.message, 'error')
    show(data.session ? 'Cadastro realizado e usuário conectado.' : 'Cadastro enviado. Verifique seu e-mail para confirmar a conta, se a confirmação estiver habilitada.', 'success')
    await refreshSession()
  })
  root.querySelector('#logout').addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut()
    if (error) return show(error.message, 'error')
    show('Sessão encerrada.', 'success')
    await refreshSession()
  })
  await refreshSession()
  return () => {}
}
