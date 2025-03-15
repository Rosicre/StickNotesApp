document.addEventListener("DOMContentLoaded", function () {
  loadNotes();

  document
    .getElementById("add-note-btn")
    .addEventListener("click", function () {
      const noteContent = document.getElementById("note-input").value.trim();
      const category = document.getElementById("note-category").value;

      if (noteContent === "") {
        alert("Digite uma nota antes de adicionar!");
        return;
      }

      fetch("/add_note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent, category }),
      })
        .then((response) => response.json().catch(() => response.text())) // Captura erro de JSON
        .then((result) => {
          if (result.error) {
            console.error("Erro:", result.message);
            alert("Erro ao adicionar nota: " + result.message);
          } else {
            document.getElementById("note-input").value = "";
            loadNotes();
          }
        })
        .catch((error) => console.error("Erro ao adicionar nota:", error));
    });
});

function loadNotes() {
  fetch("/get_notes")
    .then((response) => response.json().catch(() => response.text())) // Captura erro de JSON
    .then((notes) => {
      if (notes.error) {
        console.error("Erro:", notes.message);
        return;
      }

      document
        .querySelectorAll(".note-list")
        .forEach((list) => (list.innerHTML = ""));

      notes.forEach((note) => {
        const div = document.createElement("div");
        div.classList.add("note");
        div.setAttribute("data-id", note.id);
        div.style.backgroundColor = getCategoryColor(note.category); // Definir a cor de fundo da nota
        div.innerHTML = `
          <p>${note.content}</p>
          <button class="delete-btn" onclick="deleteNote(${note.id})">X</button>
        `;

        div.draggable = true;
        div.addEventListener("dragstart", dragStart);

        const categoryContainer = document.querySelector(
          `[data-category="${note.category}"] .note-list`
        );
        if (categoryContainer) {
          categoryContainer.appendChild(div);
        }
      });

      activateDragDrop();
    })
    .catch((error) => console.error("Erro ao carregar notas:", error));
}

function deleteNote(id) {
  fetch(`/delete_note/${id}`, { method: "DELETE" })
    .then((response) => response.json().catch(() => response.text())) // Captura erro de JSON
    .then((result) => {
      if (result.error) {
        console.error("Erro:", result.message);
        alert("Erro ao excluir nota: " + result.message);
      } else {
        loadNotes();
      }
    })
    .catch((error) => console.error("Erro ao excluir nota:", error));
}

function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.dataset.id);
}

function activateDragDrop() {
  document.querySelectorAll(".note-list").forEach((area) => {
    area.addEventListener("dragover", (event) => event.preventDefault());
    area.addEventListener("drop", (event) => {
      event.preventDefault();
      const noteId = event.dataTransfer.getData("text/plain");
      const newCategory = event.target
        .closest(".tick")
        .getAttribute("data-category");

      fetch(`/move_note/${noteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: newCategory }),
      })
        .then((response) => response.json().catch(() => response.text())) // Captura erro de JSON
        .then((result) => {
          if (result.error) {
            console.error("Erro:", result.message);
            alert("Erro ao mover nota: " + result.message);
          } else {
            loadNotes();
          }
        })
        .catch((error) => console.error("Erro ao mover nota:", error));
    });
  });
}

function getCategoryColor(category) {
  const categoryColors = {
    Urgente: "#f44336", // Vermelho para urgente
    Trabalho: "#ffeb3b", // Amarelo para trabalho
    Pessoal: "#4caf50", // Verde para pessoal
    Estudos: "#2196f3", // Azul para estudos
    Saúde: "#D8BFD8", // Lilas para saúde
    Finanças: "#ff9800", // Laranja para finanças
    Eventos: "#FF6347", // Vermelho para eventos
  };

  return categoryColors[category] || "#f0f0f0"; // Cor padrão (cinza claro)
}
