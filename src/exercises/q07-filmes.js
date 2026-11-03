export function render(root) {
  root.innerHTML = `<h2>Pesquisa de filmes</h2><div class="field"><label>Buscar filme</label><input id="search" placeholder="Digite um título..."></div><div id="movies" class="list"></div>`
  const titles=['Interestelar','O Poderoso Chefão','Matrix','A Origem','Clube da Luta','Cidade de Deus','Parasita','Duna'];const draw=q=>{const found=titles.filter(t=>t.toLowerCase().includes(q.toLowerCase()));root.querySelector('#movies').innerHTML=found.map(t=>`<div class="list-item">${t}</div>`).join('')||'<p class="muted">Nenhum filme encontrado.</p>'};root.querySelector('#search').addEventListener('input',e=>draw(e.target.value));draw('')
}
