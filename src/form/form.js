import "../assets/styles/styles.scss";
import "./form.scss";

const form = document.querySelector("form");
const errorElement = document.querySelector("#error");
let errors = [];

form.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const formData = new FormData(form);
    const articles = Object.fromEntries(formData.entries());
    if (formIsValid(articles)) {
      const json = JSON.stringify(articles);
      const response = await fetch("https://restapi.fr/api/article", {
        method: "POST",
        body: json,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status < 299) {
        location.assign("../index.html");
      }
    }
  } catch (e) {
    console.log("erreur : ", e);
  }
});

const formIsValid = (articles) => {
  if (!articles.author || !articles.category || !articles.content) {
    errors.push("S'il vous plait remplissez tous les champs");
  } else {
    errors = [];
  }

  if (errors.length) {
    let errorHTML = "";
    errors.forEach((e) => {
      errorHTML = `<li>${e}</li>`;
    });
    errorElement.innerHTML = errorHTML;
    return false;
  } else {
    errorElement.innerHTML = "";
    return true;
  }
};
