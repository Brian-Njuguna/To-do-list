
import "./notes.css";
import createSidebar from "./sidebar.js";
import createProjects from "./projects.js";
import createNote from "./notes.js";

// Create the HTML containers first.
createSidebar();

// Initialize the project system once.
const projectActions = createProjects();

// Connect the overlapping notes to the note-creation function.
if (projectActions) {
    createNote(projectActions.createNewNote);
}


