import "../assets/styles/styles.scss";
import "./form.scss";
import { openModal } from "../assets/javascripts/modal";

const form = document.querySelector("form");
const btnCancel = document.querySelector(".btn-secondary");
const errorElement = document.querySelector("#error");
let articleId;
let errors = [];

const fillForm = (article) => {
  const author = document.querySelector("input[name='author']");
  const img = document.querySelector("input[name='img']");
  const categories = document.querySelector("input[name='category']");
  const title = document.querySelector("input[name='title']");
  const content = document.querySelector("textarea");
  author.value = article.author || "";
  img.value = article.img || "";
  categories.value = article.category;
  title.value = article.title || "";
  content.value = article.content || "";
};
const initForm = async () => {
  try {
    const params = new URL(location.href);
    articleId = params.searchParams.get("id");
    if (articleId) {
      const response = await fetch(
        `https://restapi.fr/api/article/${articleId}`
      );
      if (response.status < 300) {
        const article = await response.json();
        fillForm(article);
      }
    }
  } catch (e) {
    console.log("e : ", e);
  }
};

initForm();

btnCancel.addEventListener("click", async () => {
  const result = await openModal(
    "Si vous quittez la page, vous allez perdre votre article"
  );
  if (result) {
    locati9on.assign("../index.html");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const articles = Object.fromEntries(formData.entries());
  try {
    const json = JSON.stringify(articles);
    let response;
    if (formIsValid(articles)) {
      if (articleId) {
        response = await fetch(`https://restapi.fr/api/article/${articleId}`, {
          method: "PATCH",
          body: json,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        response = await fetch("https://restapi.fr/api/article", {
          method: "POST",
          body: json,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      if (response.status < 299) {
        location.assign("../index.html");
      }
    }
  } catch (e) {
    console.log("erreur : ", e);
  }
});

const formIsValid = (articles) => {
  if (
    !articles.author ||
    !articles.category ||
    !articles.content ||
    !articles.img ||
    !articles.title
  ) {
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
