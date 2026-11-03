export function render(root) {
  root.innerHTML = `<h2>Sistema de tema escuro</h2><p>Alterne o tema deste cartão.</p><button id="toggle-theme" class="btn">Alternar tema</button><div id="theme-demo" class="notice info">Este painel terá seu tema alterado.</div>`
  root.querySelector('#toggle-theme').addEventListener('click',()=>{const box=root.querySelector('#theme-demo'),dark=box.dataset.dark!=='true';box.dataset.dark=String(dark);box.style.background=dark?'#f1f5f9':'#182d4c';box.style.color=dark?'#172033':'#b6d3ff';box.textContent=dark?'Tema claro ativado.':'Tema escuro ativado.'})
}
