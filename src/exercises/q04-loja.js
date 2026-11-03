export function render(root) {
  root.innerHTML = `<h2>Loja virtual</h2><p>Altere a quantidade para recalcular o valor total.</p><div class="field"><label>Produto</label><input value="Teclado mecânico" readonly></div><div class="grid"><div class="field"><label>Valor unitário (R$)</label><input id="unit" type="number" min="0" value="199.90" step="0.01"></div><div class="field"><label>Quantidade</label><input id="qty" type="number" min="0" value="1"></div></div><h3 id="total">Total: R$ 199,90</h3>`
  const calc=()=>{const total=Math.max(0,Number(root.querySelector('#unit').value))*Math.max(0,Number(root.querySelector('#qty').value));root.querySelector('#total').textContent='Total: '+total.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
  root.querySelector('#unit').addEventListener('input',calc);root.querySelector('#qty').addEventListener('input',calc)
}
