document.addEventListener("DOMContentLoaded", function () {
  const noteInput = document.getElementById("note-input");
  const noteCategory = document.getElementById("note-category");
  const addNoteBtn = document.getElementById("add-note-btn");

  // Retorna a cor padrão da categoria
  function getCategoryColor(category) {
    return (
      {
        Trabalho: "#ffeb3b",
        Pessoal: "#4caf50",
        Estudos: "#2196f3",
        Saúde: "#f44336",
        Finanças: "#ff9800",
        Eventos: "#9c27b0",
      }[category] || "#ffffff"
    );
  }

  // Função para buscar as notas do servidor
  function fetchNotes() {
    fetch("/get_notes")
      .then((response) => response.json())
      .then((notes) => {
        document
          .querySelectorAll(".note-list")
          .forEach((list) => (list.innerHTML = ""));

        notes.forEach((note) => {
          const noteElement = document.createElement("div");
          noteElement.classList.add("note");
          noteElement.style.backgroundColor =
            note.color || getCategoryColor(note.category); // Usa a cor da categoria se não tiver cor salva

          noteElement.innerHTML = `
            <p>${note.content}</p>
            <p class="timestamp">Criado em: ${new Date(
              note.created_at
            ).toLocaleString()}</p>
            <button class="edit-btn" data-id="${note.id}" data-category="${
            note.category
          }" data-color="${note.color}" data-content="${
            note.content
          }">Editar</button>
            <button class="delete-btn" data-id="${note.id}">Excluir</button>
          `;

          const categoryContainer = document.querySelector(
            `[data-category="${note.category}"] .note-list`
          );
          if (categoryContainer) {
            categoryContainer.appendChild(noteElement);
          }
        });

        addEventListeners();
      })
      .catch((error) => console.error("Erro ao buscar notas:", error));
  }

  // Adiciona eventos para edição e exclusão
  function addEventListeners() {
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const noteId = this.dataset.id;
        const category = this.dataset.category;
        const currentColor = this.dataset.color || getCategoryColor(category);
        const currentContent = this.dataset.content;

        const newContent = prompt("Edite sua nota:", currentContent);

        if (newContent !== null && newContent.trim() !== "") {
          fetch(`/edit_note/${noteId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: newContent, color: currentColor }),
          })
            .then((response) => response.json())
            .then(() => fetchNotes())
            .catch((error) => console.error("Erro ao editar nota:", error));
        }
      });
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const noteId = this.dataset.id;

        fetch(`/delete_note/${noteId}`, { method: "DELETE" })
          .then((response) => response.json())
          .then(() => fetchNotes())
          .catch((error) => console.error("Erro ao excluir nota:", error));
      });
    });
  }

  // Adiciona uma nova nota com a cor da categoria
  addNoteBtn.addEventListener("click", function () {
    const content = noteInput.value.trim();
    const category = noteCategory.value;
    const color = getCategoryColor(category);

    if (content === "") {
      alert("Digite uma nota!");
      return;
    }

    fetch("/add_note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, category, color }),
    })
      .then((response) => response.json())
      .then(() => {
        noteInput.value = "";
        fetchNotes();
      })
      .catch((error) => console.error("Erro ao adicionar nota:", error));
  });

  fetchNotes();
});
