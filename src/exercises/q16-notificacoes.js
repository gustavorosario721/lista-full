export function render(root) {
  root.innerHTML = `<h2>Sistema de notificações</h2><p>Passe o mouse sobre o ícone para visualizar as notificações.</p><button id="notification-icon" class="btn" aria-describedby="notification-box">✉ Mensagens</button><div id="notification-box" class="notice info" hidden>Você tem 3 mensagens não lidas.</div>`
  const icon=root.querySelector('#notification-icon'),box=root.querySelector('#notification-box');icon.addEventListener('mouseenter',()=>box.hidden=false);icon.addEventListener('mouseleave',()=>box.hidden=true);icon.addEventListener('focus',()=>box.hidden=false);icon.addEventListener('blur',()=>box.hidden=true)
}
