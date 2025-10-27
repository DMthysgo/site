// Espera o documento HTML estar totalmente carregado
document.addEventListener("DOMContentLoaded", () => {
  // Carrega as imagens do portfólio
  loadPortfolioImages();

  // --- Lógica do Modal ---
  const modalOverlay = document.getElementById("modal-overlay");
  const modalCloseBtn = document.getElementById("modal-close");

  // Função para fechar o modal
  const closeModal = () => {
    modalOverlay.classList.remove("active");
  };

  // Fecha o modal ao clicar no 'X'
  modalCloseBtn.addEventListener("click", closeModal);

  // Fecha o modal ao clicar fora da caixa de conteúdo (no fundo escuro)
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  // Fecha o modal ao pressionar a tecla 'Esc'
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });
});

/**
 * Função principal para carregar e exibir as imagens na grade.
 */
async function loadPortfolioImages() {
  const gridContainer = document.getElementById("portfolio-grid");

  if (!gridContainer) {
    console.error("Erro: Contêiner da grade não encontrado.");
    return;
  }

  try {
    const response = await fetch("assets/js/json/images.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const images = await response.json();
    gridContainer.innerHTML = "";

    images.forEach((imageData) => {
      const gridItem = document.createElement("div");
      gridItem.className = "grid-item";

      if (imageData.class) {
        gridItem.classList.add(imageData.class);
      }

      const img = document.createElement("img");
      img.src = imageData.src;
      img.alt = imageData.alt; // O alt continua importante para acessibilidade

      gridItem.appendChild(img);

      // --- NOVO: Adiciona o 'ouvinte' de clique ---
      // Passa o objeto 'imageData' completo para a função openModal
      gridItem.addEventListener("click", () => {
        openModal(imageData);
      });

      gridContainer.appendChild(gridItem);
    });
  } catch (error) {
    console.error("Erro ao carregar as imagens do portfólio:", error);
    gridContainer.innerHTML =
      '<p style="color: var(--accent-pink);">Falha ao carregar o portfólio.</p>';
  }
}

/**
 * Função para abrir o modal e preencher com as informações corretas.
 * @param {object} imageData - O objeto da imagem (com src, title, alt).
 */
function openModal(imageData) {
  // Pega os elementos do modal
  const modalOverlay = document.getElementById("modal-overlay");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const whatsappBtn = document.getElementById("modal-whatsapp-btn");

  // 1. Preenche o conteúdo
  modalImg.src = imageData.src;
  modalTitle.textContent = imageData.title;
  modalDesc.textContent = imageData.alt; // Usando 'alt' como descrição

  // 2. Monta a URL do WhatsApp
  const seuNumero = "558396576222";

  // Mensagem personalizada, usando o título do item
  const mensagem = `Vi seu portfolio e gostei do ${imageData.title} está disponivel para encomenda?`;

  // Codifica a mensagem para ser usada em uma URL
  const mensagemCodificada = encodeURIComponent(mensagem);

  // Define o link do botão
  whatsappBtn.href = `https://wa.me/${seuNumero}?text=${mensagemCodificada}`;

  // 3. Exibe o modal
  modalOverlay.classList.add("active");
}
