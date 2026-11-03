export function render(root) {
  root.innerHTML = `<h2>Validação de senha</h2><p>Confira a força da senha conforme digita.</p><div class="field"><label>Senha</label><input id="password" type="password"></div><div id="strength" class="notice info">Digite uma senha.</div>`
  root.querySelector('#password').addEventListener('input',e=>{const n=e.target.value.length,box=root.querySelector('#strength');box.className='notice '+(n<6?'error':n<=8?'info':'success');box.textContent=n<6?'Senha fraca':n<=8?'Senha média':'Senha forte'})
}
