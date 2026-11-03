export function render(root) {
  root.innerHTML = `<h2>Controle de luminosidade</h2><p>Mova o controle para ajustar a intensidade da lâmpada.</p><input id="brightness" type="range" min="0" max="100" value="50"><div id="bulb" class="lightbulb"></div><p id="brightness-label" class="hint">50%</p>`
  root.querySelector('#brightness').addEventListener('input',e=>{const v=Number(e.target.value);root.querySelector('#bulb').style.background=`rgb(255, ${190+Math.round(v*.65)}, ${90+Math.round(v*1.6)})`;root.querySelector('#bulb').style.boxShadow=`0 0 ${v/2}px ${v/5}px rgba(255,220,120,${v/100})`;root.querySelector('#brightness-label').textContent=v+'%'})
}
