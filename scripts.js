/**
 * =============================================================================
 * ÍNDICE DE FUNÇÕES (scripts.js)
 * =============================================================================
 * 1. Constantes & seletores
 * 2. initTheme()          — aplica o tema salvo (localStorage) ao carregar
 * 3. applyTheme(isLight)  — aplica classe .light no <html> e troca o avatar
 * 4. toggleMode()         — alterna tema (chamado pelo onclick do botão)
 * 5. initScrollReveal()   — anima seções ao entrarem na viewport
 * 6. Inicialização (DOMContentLoaded)
 * =============================================================================
 */

/* -----------------------------------------------------------------------
 * 1. Constantes & seletores
 * --------------------------------------------------------------------- */
const THEME_STORAGE_KEY = "dacunhadb:theme";
const AVATAR_DARK_SRC = "./assets/avatar.png";
const AVATAR_LIGHT_SRC = "./assets/avatarpsy.png";

/* -----------------------------------------------------------------------
 * 2. initTheme()
 * Lê o tema salvo em localStorage (ou a preferência do sistema, na
 * primeira visita) e aplica antes da interação do usuário, evitando o
 * "flash" do tema errado.
 * --------------------------------------------------------------------- */
function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    // localStorage pode estar indisponível (modo privado, permissões etc.)
    saved = null;
  }

  const prefersLight =
    saved === null &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;

  const isLight = saved === "light" || prefersLight;
  applyTheme(isLight);
}

/* -----------------------------------------------------------------------
 * 3. applyTheme(isLight)
 * Aplica (ou remove) a classe "light" no elemento raiz, troca a imagem do
 * avatar e mantém o botão de alternância com o estado correto para
 * leitores de tela (aria-pressed).
 * --------------------------------------------------------------------- */
function applyTheme(isLight) {
  const html = document.documentElement;
  html.classList.toggle("light", isLight);

  const avatarImg = document.querySelector(".avatar img");
  if (avatarImg) {
    avatarImg.setAttribute("src", isLight ? AVATAR_LIGHT_SRC : AVATAR_DARK_SRC);
  }

  const toggleButton = document.getElementById("theme-toggle");
  if (toggleButton) {
    toggleButton.setAttribute("aria-checked", String(isLight));
  }
}

/* -----------------------------------------------------------------------
 * 4. toggleMode()
 * Função exposta globalmente (usada pelo atributo onclick do botão de
 * tema no HTML). Inverte o tema atual e persiste a escolha.
 * --------------------------------------------------------------------- */
function toggleMode() {
  const isLight = !document.documentElement.classList.contains("light");
  applyTheme(isLight);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, isLight ? "light" : "dark");
  } catch (error) {
    // Falha silenciosa: persistência é apenas um extra, não é crítica.
  }
}

/* -----------------------------------------------------------------------
 * 5. initScrollReveal()
 * Revela progressivamente header, figura de destaque, seções e rodapé
 * (elementos marcados com [data-reveal]) conforme entram na tela.
 * Usa IntersectionObserver; se a API não existir, ou o usuário preferir
 * movimento reduzido, o conteúdo permanece sempre visível (ver CSS).
 * --------------------------------------------------------------------- */
function initScrollReveal() {
  const revealTargets = document.querySelectorAll("[data-reveal]");
  if (!revealTargets.length) return;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    // Sem suporte ou com movimento reduzido: mostra tudo imediatamente,
    // sem ativar a classe que oculta os elementos por padrão.
    return;
  }

  // Só a partir daqui os elementos ficam ocultos até entrarem em vista
  // (classe controlada via CSS: .js-reveal-ready [data-reveal]).
  document.documentElement.classList.add("js-reveal-ready");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.15,
    }
  );

  revealTargets.forEach((target) => observer.observe(target));
}

/* -----------------------------------------------------------------------
 * 6. Inicialização
 * --------------------------------------------------------------------- */
initTheme(); // roda o quanto antes para evitar flash de tema incorreto

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
});
