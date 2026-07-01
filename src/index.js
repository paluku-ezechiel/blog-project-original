import "./assets/styles/styles.scss";
import "./index.scss";

const articleContainer = document.querySelector(".articles-container");

const createArticles = (articles) => {
  const articlesDOM = articles.map((article) => {
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
      const target = e.target;
      const articleId = target.dataset.id;
      const response = await fetch(
        `https://restapi.fr/api/article/${articleId}`,
        {
          method: "DELETE",
        }
      );
      const body = await response.json();
      console.log(body);
      fetchArticles();
    });
  });
};

const fetchArticles = async () => {
  const response = await fetch("https://restapi.fr/api/article");
  const articles = await response.json();
  createArticles(articles);
};

fetchArticles();
