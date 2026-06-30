import "../assets/styles/styles.scss";
import "./form.scss";

const form = document.querySelector("form");
form.addEventListener("submit", e => {
    e.preventDefault();
})