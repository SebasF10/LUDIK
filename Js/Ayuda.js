// Script para desplegar preguntas frecuentes - Funcionalidad original mantenida
const questions = document.querySelectorAll(".faq-question");
questions.forEach(q => {
    q.addEventListener("click", () => {
        q.classList.toggle("active");
        const answer = q.nextElementSibling;
        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
        } else {
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});