export function render(root) {
  root.innerHTML = `<h2>Plataforma de cursos</h2><p>Clique na miniatura para carregar um vídeo de demonstração.</p><button id="load-video" class="btn secondary">▶ Carregar aula demonstrativa</button><div id="video-area" class="notice info">O vídeo aparecerá aqui.</div>`
  root.querySelector('#load-video').addEventListener('click',()=>{root.querySelector('#video-area').innerHTML='<video controls width="100%" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"></video><p class="hint">Vídeo demonstrativo hospedado publicamente.</p>'})
}
