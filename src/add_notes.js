export default function add_note(){
    const add_note = document.querySelector(".project_link");
    add_note.classList.add("project_note")

    add_note.addEventListener("click", function(event){
        event.preventDefault();
        const title = prompt("Enter note title")
    })

    const projectSpecificNote = document.createElement("li")


}