export function render(root) {
  root.innerHTML = `<h2>Conversão monetária</h2><p>Digite um valor em reais. Cotação ilustrativa fixa: US$ 1 = R$ 5,00.</p><div class="field"><label>Valor em reais (R$)</label><input id="brl" type="number" min="0" step="0.01"></div><h3 id="usd">US$ 0,00</h3>`
  root.querySelector('#brl').addEventListener('input',e=>{const value=Math.max(0,Number(e.target.value)||0)/5;root.querySelector('#usd').textContent=value.toLocaleString('en-US',{style:'currency',currency:'USD'})})
}
