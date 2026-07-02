import "./assets/styles/styles.scss";
import "./index.scss";
import { openModal } from "./assets/javascripts/modal";

const articleContainer = document.querySelector(".articles-container");
const categoriesContainerElement = document.querySelector(".categories");
const selectElement = document.querySelector("select");
let filter;
let articles;
let sortBy = "desc";

selectElement.addEventListener("change", (event) => {
  sortBy = selectElement.value;
  fetchArticles();
});
const createArticles = () => {
  const articlesDOM = articles
    .filter((article) => {
      if (filter) {
        return article.category === filter;
      } else {
        return true;
      }
    })
    .map((article) => {
      const articleDOM = document.createElement("div");
      articleDOM.classList.add("article");
      const img = document.createElement("img");
      img.src = `${article.img}`;
      img.alt = "profile";
      const title = document.createElement("h2");
      title.innerText = `${article.title}`;
      const articleAuthor = document.createElement("p");
      articleAuthor.classList.add("article-author");
      articleAuthor.innerText = `${article.author} ${new Date(
        article.createdAt
      ).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`;
      const articleContent = document.createElement("p");
      articleContent.classList.add("article-content");
      articleContent.innerHTML = `${article.content}`;
      const articleActions = document.createElement("div");
      articleActions.classList.add("article-actions");
      const buttonDanger = document.createElement("button");
      buttonDanger.classList.add("btn", "btn-danger");
      buttonDanger.dataset.id = `${article._id}`;
      buttonDanger.innerText = "Supprimer";
      const buttonModifier = document.createElement("button");
      buttonModifier.classList.add("btn", "btn-primary");
      buttonModifier.dataset.id = `${article._id}`;
      buttonModifier.innerText = "Modifier";
      articleActions.append(buttonModifier, buttonDanger);
      articleDOM.append(
        img,
        title,
        articleAuthor,
        articleContent,
        articleActions
      );
      return articleDOM;
    });

  articleContainer.innerHTML = "";
  articleContainer.append(...articlesDOM);

  // Evenement du bouton Supprimer
  const deleteArticles = articleContainer.querySelectorAll(".btn-danger");
  deleteArticles.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const result = await openModal("Etes-vous sûr de vouloir supprimer votre article ? ");
      if (result === true) {
        try {
          const target = e.target;
          const articleId = target.dataset.id;
          const response = await fetch(
            `https://restapi.fr/api/article/${articleId}`,
            {
              method: "DELETE",
            }
          );
          const body = await response.json();
          fetchArticles();
        } catch (e) {
          console.log("e : ", e);
        }
      }
    });
  });

  const updateArticle = articleContainer.querySelectorAll(".btn-primary");
  updateArticle.forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = e.target;
      const articleId = target.dataset.id;
      location.assign(`./form/form.html?id=${articleId}`);
    });
  });
};

const displayMenuCategories = (categoriesArr) => {
  const liElement = categoriesArr.map((article) => {
    const li = document.createElement("li");
    li.innerHTML = `${article[0]} <strong>(${article[1]})</strong>`;
    if (article[0] === filter) {
      li.classList.add("active");
    }
    li.addEventListener("click", () => {
      if (filter === article[0]) {
        filter = null;
        li.classList.remove("active");
        createArticles();
      } else {
        filter = article[0];
        liElement.forEach((li) => {
          li.classList.remove("active");
        });
        li.classList.add("active");
        createArticles();
      }
    });
    return li;
  });
  categoriesContainerElement.innerHTML = "";
  categoriesContainerElement.append(...liElement);
};

const createMenuCategory = () => {
  const categories = articles.reduce((acc, value) => {
    if (acc[value.category]) {
      acc[value.category]++;
    } else {
      acc[value.category] = 1;
    }
    return acc;
  }, {});

  const categoriesArr = Object.keys(categories)
    .map((category) => {
      return [category, categories[category]];
    })
    .sort((c1, c2) => c1[0].localeCompare(c2[0]));
  displayMenuCategories(categoriesArr);
};

const fetchArticles = async () => {
  const response = await fetch(
    `https://restapi.fr/api/article?sort=createdAt:${sortBy}`
  );
  articles = await response.json();
  createArticles();
  createMenuCategory();
};

fetchArticles();
