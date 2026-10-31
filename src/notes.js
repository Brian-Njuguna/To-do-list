
export default function createNote(createNewNote) {
    const notesContainer = document.querySelector(".notes-container");

    if (!notesContainer) {
        console.error("Could not find .notes-container");
        return;
    }
    if (typeof createNewNote !== "function") {
    console.error("createNewNote was not passed to createNote().");
    return;
    }

    const noteStack = document.createElement("div");
    noteStack.classList.add("note-grid");

    const colors = ["yellow", "pink", "green", "blue", "yellow"];

    colors.forEach((color, index) => {
        const note = document.createElement("div");
        note.classList.add("note", color);
        note.textContent = "Add note";
        note.setAttribute("role", "button");
        note.setAttribute("tabindex", "0");

        function handleClick() {
            // Use the same note-creation logic as the Add note button.
            createNewNote();
        }

        note.addEventListener("click", handleClick);

        note.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleClick();
            }
        });

        noteStack.appendChild(note);
    });

    notesContainer.prepend(noteStack);
}
