import './style.css'

const exercises = [
  {
    "id": "q01",
    "name": "Login Acadêmico",
    "slug": "q01-login"
  },
  {
    "id": "q02",
    "name": "Controle de Temperatura",
    "slug": "q02-temperatura"
  },
  {
    "id": "q03",
    "name": "Sistema de Comentários",
    "slug": "q03-comentarios"
  },
  {
    "id": "q04",
    "name": "Loja Virtual",
    "slug": "q04-loja"
  },
  {
    "id": "q05",
    "name": "Validação de Senha",
    "slug": "q05-senha"
  },
  {
    "id": "q06",
    "name": "Controle de Luminosidade",
    "slug": "q06-luminosidade"
  },
  {
    "id": "q07",
    "name": "Pesquisa de Filmes",
    "slug": "q07-filmes"
  },
  {
    "id": "q08",
    "name": "Sistema Bancário",
    "slug": "q08-banco"
  },
  {
    "id": "q09",
    "name": "Tema Escuro",
    "slug": "q09-tema"
  },
  {
    "id": "q10",
    "name": "Controle de Estoque",
    "slug": "q10-estoque"
  },
  {
    "id": "q11",
    "name": "Plataforma de Cursos",
    "slug": "q11-cursos"
  },
  {
    "id": "q12",
    "name": "Sistema de Avaliação",
    "slug": "q12-avaliacao"
  },
  {
    "id": "q13",
    "name": "Calculadora de IMC",
    "slug": "q13-imc"
  },
  {
    "id": "q14",
    "name": "Upload de Arquivos",
    "slug": "q14-upload"
  },
  {
    "id": "q15",
    "name": "Sistema de Votação",
    "slug": "q15-votacao"
  },
  {
    "id": "q16",
    "name": "Sistema de Notificações",
    "slug": "q16-notificacoes"
  },
  {
    "id": "q17",
    "name": "Simulador de Semáforo",
    "slug": "q17-semaforo"
  },
  {
    "id": "q18",
    "name": "Sistema de Agenda",
    "slug": "q18-agenda"
  },
  {
    "id": "q19",
    "name": "Conversão Monetária",
    "slug": "q19-moeda"
  },
  {
    "id": "q20",
    "name": "Player de Música",
    "slug": "q20-musica"
  }
];
const exerciseModules = import.meta.glob('./exercises/*.js')
const menu = document.querySelector('#exercise-menu')
const app = document.querySelector('#app')
let cleanupCurrent = null
let activeId = null

function buildMenu() {
  menu.innerHTML = exercises.map((exercise, index) => `
    <button class="menu-item" type="button" data-exercise="${exercise.id}">
      <span class="menu-number">${String(index + 1).padStart(2, '0')}</span>
      <span>${exercise.name}</span>
    </button>
  `).join('')

  menu.addEventListener('click', (event) => {
    const button = event.target.closest('[data-exercise]')
    if (button) loadExercise(button.dataset.exercise)
  })
}

async function loadExercise(id) {
  const exercise = exercises.find(item => item.id === id)
  if (!exercise) return

  if (typeof cleanupCurrent === 'function') cleanupCurrent()
  cleanupCurrent = null
  activeId = id

  menu.querySelectorAll('.menu-item').forEach(button => {
    const selected = button.dataset.exercise === id
    button.classList.toggle('active', selected)
    button.setAttribute('aria-current', selected ? 'page' : 'false')
  })

  app.innerHTML = `
    <header class="page-heading">
      <span class="eyebrow">ATIVIDADE PRÁTICA · ${id.toUpperCase()}</span>
      <h1>${exercise.name}</h1>
      <p>Questão ${id.slice(1)} de 20</p>
    </header>
    <section id="exercise-content" class="exercise-card" aria-live="polite">
      <p class="muted">Carregando exercício...</p>
    </section>
  `

  try {
    const loader = exerciseModules[`./exercises/${exercise.slug}.js`]
    if (!loader) throw new Error('Módulo do exercício não encontrado.')
    const module = await loader()
    if (activeId !== id) return
    const cleanup = await module.render(document.querySelector('#exercise-content'))
    cleanupCurrent = typeof cleanup === 'function' ? cleanup : null
  } catch (error) {
    console.error(error)
    document.querySelector('#exercise-content').innerHTML = `
      <div class="notice error">Não foi possível carregar este exercício: ${escapeHtml(error.message)}</div>
    `
  }
  app.focus({ preventScroll: true })
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  })[char])
}

buildMenu()
