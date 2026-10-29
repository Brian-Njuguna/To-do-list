export default function createSidebar() {
    const main_grid = document.querySelector(".main-grid");

    const sidebar = document.createElement("aside");
    sidebar.classList.add("sidebar");

    const notesContainer = document.createElement("div");
    notesContainer.classList.add("notes-container");

    main_grid.append(sidebar, notesContainer);
}