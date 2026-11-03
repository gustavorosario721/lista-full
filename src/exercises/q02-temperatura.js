export function render(root) {
  root.innerHTML = `<h2>Controle de temperatura</h2><p>Digite a temperatura para alterar a cor do painel: abaixo de 40 °C verde, de 40 a 70 °C amarelo e acima de 70 °C vermelho.</p><div class="field"><label>Temperatura (°C)</label><input id="temp" type="number" placeholder="Ex.: 55"></div><div id="temp-panel" class="notice info">Aguardando temperatura...</div>`
  const input=root.querySelector('#temp'), panel=root.querySelector('#temp-panel')
  input.addEventListener('input',()=>{const v=Number(input.value);if(input.value===''){panel.className='notice info';panel.textContent='Aguardando temperatura...'}else if(v<40){panel.className='notice success';panel.textContent='Temperatura segura: '+v+' °C'}else if(v<=70){panel.className='notice info';panel.textContent='Atenção: '+v+' °C'}else{panel.className='notice error';panel.textContent='ALERTA: temperatura elevada ('+v+' °C)'}})
}
