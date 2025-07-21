// 🔑 Your NewsAPI key
const API_KEY = "09ca60a220f0416f9fced47c5b4cbb27";
const BASE_URL = "https://newsapi.org/v2/everything?q=";

// ⏳ Show loading initially
window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

// 📡 Fetch news from API
async function fetchNews(query) {
    try {
        document.getElementById("loading").style.display = "block";

        const response = await fetch(`${BASE_URL}${query}&apiKey=${API_KEY}`);
        const data = await response.json();

        if (data.status !== "ok") {
            throw new Error(data.message || "Failed to fetch news");
        }

        bindData(data.articles);
    } catch (error) {
        console.error("❌ Error fetching news:", error);
        alert("⚠️ Unable to fetch news. Please try again later or check your API key.");
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

// 🧩 Inject news articles into the DOM
function bindData(articles) {
    const container = document.getElementById("cards-container");
    const template = document.getElementById("template-news-card");

    container.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;

        const clone = template.content.cloneNode(true);
        fillDataInCard(clone, article);
        container.appendChild(clone);
    });
}

// ✍️ Fill card content
function fillDataInCard(cardClone, article) {
    const img = cardClone.querySelector("#news-img");
    const title = cardClone.querySelector("#news-title");
    const source = cardClone.querySelector("#news-source");
    const desc = cardClone.querySelector("#news-desc");

    img.src = article.urlToImage;
    title.innerText = article.title;
    desc.innerText = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
    });

    source.innerText = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// 🌐 Category navigation click
let curSelectedNav = null;

function onNavItemClick(category) {
    fetchNews(category);

    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => item.classList.remove("active"));

    const target = document.querySelector(`#${category.toLowerCase().split(" ")[1]}`);
    if (target) {
        target.classList.add("active");
        curSelectedNav = target;
    }
}

// 🔎 Search functionality
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return;

    fetchNews(query);

    if (curSelectedNav) curSelectedNav.classList.remove("active");
    curSelectedNav = null;
});
