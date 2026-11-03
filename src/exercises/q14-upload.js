export function render(root) {
  root.innerHTML = `<h2>Upload de arquivos</h2><div class="field"><label>Selecione um arquivo</label><input id="file" type="file"></div><div id="file-name" class="notice info">Nenhum arquivo selecionado.</div>`
  root.querySelector('#file').addEventListener('change',e=>{const f=e.target.files[0];const box=root.querySelector('#file-name');box.textContent=f?`Arquivo selecionado: ${f.name} (${(f.size/1024).toFixed(1)} KB)`:'Nenhum arquivo selecionado.'})
}
