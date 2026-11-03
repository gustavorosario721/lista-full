export function render(root) {
  root.innerHTML = `<h2>Controle de estoque</h2><div class="field"><label>Quantidade em estoque</label><input id="stock" type="number" min="0" value="15"></div><div id="stock-msg" class="notice success">Estoque normal.</div>`
  root.querySelector('#stock').addEventListener('input',e=>{const n=Number(e.target.value),box=root.querySelector('#stock-msg');box.className='notice '+(e.target.value!==''&&n<10?'error':'success');box.textContent=e.target.value!==''&&n<10?'Atenção: estoque abaixo de 10 unidades!':'Estoque normal.'})
}
