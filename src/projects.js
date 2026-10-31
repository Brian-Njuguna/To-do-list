
import folderIcon from "./assets/folder.png";

// Create a note object
function Note(title, date, description, projectName) {
    this.id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.title = title;
    this.due_date = date;
    this.description = description;
    this.projectName = projectName;
}

// Get saved notes safely
function getSavedNotes() {
    try {
        const data = JSON.parse(localStorage.getItem("notes")) || [];
        const notes = Array.isArray(data) ? data : [data];

        let changed = false;

        notes.forEach(note => {
            if (!note.id) {
                note.id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
                changed = true;
            }

            if (!note.projectName) {
                note.projectName = "General Notes";
                changed = true;
            }

            if (note.description === undefined) {
                note.description = "";
                changed = true;
            }

            if (note.due_date === undefined) {
                note.due_date = "";
                changed = true;
            }
        });

        if (changed) {
            saveNotes(notes);
        }

        return notes;
    } catch (error) {
        console.error("Could not load saved notes:", error);
        return [];
    }
}

// Save notes
function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Get saved projects safely
function getSavedProjects() {
    try {
        const data = JSON.parse(localStorage.getItem("projects")) || [];

        return Array.isArray(data)
            ? data.filter(project => typeof project === "string")
            : [];
    } catch (error) {
        console.error("Could not load saved projects:", error);
        return [];
    }
}

// Save projects
function saveProjects(projects) {
    localStorage.setItem("projects", JSON.stringify(projects));
}

// Validate a date in YYYY-MM-DD format
function isValidDate(date) {
    if (!date) return true;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const parsedDate = new Date(`${date}T00:00:00Z`);

    return (
        !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === date
    );
}

// Display one note card
function displayNote(note, mainFrame, onEdit, onDelete) {
    const colors = ["yellow", "green", "blue", "pink"];

    if (!note.color || !colors.includes(note.color)) {
        note.color = colors[Math.floor(Math.random() * colors.length)];
        saveNotes(getSavedNotes());
    }

    const addedNote = document.createElement("div");
    addedNote.classList.add("created-note", note.color);

    const titleElement = document.createElement("h3");
    titleElement.textContent = note.title;

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = note.description;

    const dateElement = document.createElement("p");
    dateElement.textContent = note.due_date
        ? `Due: ${note.due_date}`
        : "No due date";

    const actions = document.createElement("div");
    actions.classList.add("note-actions");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("button", "edit-note");

    editButton.addEventListener("click", () => {
        onEdit(note);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("button", "delete-note");

    deleteButton.addEventListener("click", () => {
        onDelete(note);
    });

    actions.append(editButton, deleteButton);

    addedNote.append(
        titleElement,
        descriptionElement,
        dateElement,
        actions
    );

    mainFrame.appendChild(addedNote);
}

export default function createProjects() {
    const mainFrame = document.querySelector(".notes-container");
    const sidebar = document.querySelector(".sidebar");

    if (!mainFrame || !sidebar) {
        console.error("Could not find .notes-container or .sidebar.");
        return;
    }

    sidebar.replaceChildren();

    let selectedProject = "General Notes";

    // Sidebar heading
    const heading = document.createElement("h2");
    heading.textContent = "My Notes";

    const addProjectButton = document.createElement("button");
    addProjectButton.textContent = "+ Add project";
    addProjectButton.classList.add("button", "add_project");

    const projectHeading = document.createElement("h2");
    projectHeading.classList.add("project_heading");
    projectHeading.textContent = "Projects";

    const projectsList = document.createElement("ul");
    projectsList.classList.add("projects_list");

    const addNoteButton = document.createElement("button");
    addNoteButton.textContent = "+ Add note";
    addNoteButton.classList.add("button", "add_note");

    sidebar.append(
        heading,
        addProjectButton,
        projectHeading,
        projectsList,
        addNoteButton
    );

    // Highlight the currently selected project.
    function updateProjectHighlight() {
        projectsList.querySelectorAll(".project").forEach(project => {
            const isSelected =
                project.dataset.projectName === selectedProject;

            project.classList.toggle("selected-project", isSelected);

            const link = project.querySelector(".project_link");

            if (link) {
                if (isSelected) {
                    link.setAttribute("aria-current", "page");
                } else {
                    link.removeAttribute("aria-current");
                }
            }
        });
    }

    // Render notes belonging to the selected project.
    function renderProjectNotes() {
        mainFrame
            .querySelectorAll(".created-note")
            .forEach(note => note.remove());

        const savedNotes = getSavedNotes();

        const projectNotes = savedNotes.filter(
            note => note.projectName === selectedProject
        );

        projectNotes.forEach(note => {
            displayNote(note, mainFrame, editNote, deleteNote);
        });

        updateProjectHighlight();
    }

    // Create and save a note.
    function createNewNote() {
        const titleInput = prompt("Enter note title:");

        if (titleInput === null || titleInput.trim() === "") {
            return;
        }

        const descriptionInput = prompt("Enter a description:");

        if (descriptionInput === null) {
            return;
        }

        const dateInput = prompt(
            "Enter due date (YYYY-MM-DD), or leave blank:"
        );

        if (dateInput === null) {
            return;
        }

        const date = dateInput.trim();

        if (!isValidDate(date)) {
            alert("Enter a valid date as YYYY-MM-DD, or leave it blank.");
            return;
        }

        const newNote = new Note(
            titleInput.trim(),
            date,
            descriptionInput.trim(),
            selectedProject
        );

        const savedNotes = getSavedNotes();
        savedNotes.push(newNote);

        saveNotes(savedNotes);
        renderProjectNotes();
    }

    // Edit an existing note.
    function editNote(note) {
        const titleInput = prompt("Edit note title:", note.title);

        if (titleInput === null || titleInput.trim() === "") {
            return;
        }

        const descriptionInput = prompt(
            "Edit description:",
            note.description
        );

        if (descriptionInput === null) {
            return;
        }

        const dateInput = prompt(
            "Edit due date (YYYY-MM-DD), or leave blank:",
            note.due_date || ""
        );

        if (dateInput === null) {
            return;
        }

        const date = dateInput.trim();

        if (!isValidDate(date)) {
            alert("Enter a valid date as YYYY-MM-DD, or leave it blank.");
            return;
        }

        const savedNotes = getSavedNotes();

        const noteIndex = savedNotes.findIndex(
            savedNote => savedNote.id === note.id
        );

        if (noteIndex === -1) {
            alert("Could not find this note.");
            return;
        }

        savedNotes[noteIndex].title = titleInput.trim();
        savedNotes[noteIndex].description = descriptionInput.trim();
        savedNotes[noteIndex].due_date = date;

        saveNotes(savedNotes);
        renderProjectNotes();
    }

    // Delete an existing note.
    function deleteNote(note) {
        const confirmed = confirm(
            `Are you sure you want to delete "${note.title}"?`
        );

        if (!confirmed) {
            return;
        }

        const savedNotes = getSavedNotes();

        const updatedNotes = savedNotes.filter(
            savedNote => savedNote.id !== note.id
        );

        saveNotes(updatedNotes);
        renderProjectNotes();
    }

    // Delete a project and preserve its notes.
    function deleteProject(projectName) {
        if (projectName === "General Notes") {
            return;
        }

        const confirmed = confirm(
            `Delete "${projectName}"? Its notes will be moved to General Notes.`
        );

        if (!confirmed) {
            return;
        }

        // Remove the project from storage.
        const savedProjects = getSavedProjects();

        const updatedProjects = savedProjects.filter(
            name => name !== projectName
        );

        saveProjects(updatedProjects);

        // Move the project's notes to General Notes.
        const savedNotes = getSavedNotes();

        savedNotes.forEach(note => {
            if (note.projectName === projectName) {
                note.projectName = "General Notes";
            }
        });

        saveNotes(savedNotes);

        // Switch to General Notes if necessary.
        if (selectedProject === projectName) {
            selectedProject = "General Notes";
        }

        // Rebuild the sidebar.
        renderProjectsList();
        renderProjectNotes();
    }

    // Add buttons and links for a project.
    function addProject(projectName) {
        const project = document.createElement("li");
        project.classList.add("project");
        project.dataset.projectName = projectName;

        const icon = document.createElement("img");
        icon.src = folderIcon;
        icon.alt = "";
        icon.width = 18;
        icon.height = 18;

        const projectLink = document.createElement("a");
        projectLink.classList.add("project_link", "project_names");
        projectLink.href = "#";
        projectLink.textContent = projectName;

        projectLink.addEventListener("click", event => {
            event.preventDefault();

            selectedProject = projectName;
            renderProjectNotes();
        });

        const projectActions = document.createElement("div");
        projectActions.classList.add("project-actions");

        // Add note button for this project.
        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.textContent = "+";
        addButton.classList.add("button", "add-project-note");
        addButton.title = `Add note to ${projectName}`;
        addButton.setAttribute(
            "aria-label",
            `Add note to ${projectName}`
        );

        addButton.addEventListener("click", () => {
            selectedProject = projectName;
            updateProjectHighlight();
            createNewNote();
        });

        // Delete project button.
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "×";
        deleteButton.classList.add("button", "delete-project");
        deleteButton.title = `Delete ${projectName}`;
        deleteButton.setAttribute(
            "aria-label",
            `Delete ${projectName}`
        );

        if (projectName === "General Notes") {
            deleteButton.disabled = true;
            deleteButton.title = "General Notes cannot be deleted";
        }

        deleteButton.addEventListener("click", () => {
            deleteProject(projectName);
        });

        projectActions.append(addButton, deleteButton);
        project.append(icon, projectLink, projectActions);
        projectsList.appendChild(project);
    }

    // Render all projects, including saved projects.
    function renderProjectsList() {
        projectsList.replaceChildren();

        const savedProjects = getSavedProjects();

        const projectNames = [
            "General Notes",
            ...savedProjects.filter(
                name => name.toUpperCase() !== "GENERAL NOTES"
            )
        ];

        projectNames.forEach(addProject);
        updateProjectHighlight();
    }

    // Restore projects when the app starts.
    renderProjectsList();

    // Add a new project.
    addProjectButton.addEventListener("click", () => {
        const input = prompt("Enter your project name:");

        if (input === null || input.trim() === "") {
            return;
        }

        const projectName = input.trim().toUpperCase();
        const existingProjects = getSavedProjects();

        const alreadyExists = [
            "General Notes",
            ...existingProjects
        ].some(name => name.toUpperCase() === projectName);

        if (alreadyExists) {
            alert("Project name already taken.");
            return;
        }

        existingProjects.push(projectName);
        saveProjects(existingProjects);

        selectedProject = projectName;

        renderProjectsList();
        renderProjectNotes();
    });

    // General Add Note button.
    addNoteButton.addEventListener("click", createNewNote);

    // Display General Notes when the app starts.
    renderProjectNotes();

    // Let other modules use the same note-creation function.
    return {
        createNewNote
    };
}
