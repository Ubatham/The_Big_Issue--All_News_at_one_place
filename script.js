 // 🔑 Your NewsAPI key
const API_KEY = "09ca60a220f0416f9fced47c5b4cbb27";
const BASE_URL = "https://newsapi.org/v2/everything?q=";


/* ================= STATE ================= */
let page = 1;
let currentCategory = "general";
let searchQuery = "";
let loading = false;
let endReached = false;

/* ================= DOM ================= */
const container = document.getElementById("news-container");
const loader = document.getElementById("loader");
const featured = document.getElementById("featured");
const ticker = document.getElementById("ticker");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const themeToggle = document.getElementById("themeToggle");
const search = document.getElementById("search");
const topBtn = document.getElementById("topBtn");
const progressBar = document.getElementById("progress");

/* ================= TOAST ================= */
function showToast(msg){
    const toast=document.getElementById("toast");
    toast.innerText=msg;
    toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"),2500);
}

/* ================= MOBILE MENU ================= */
hamburger.onclick=()=>navMenu.classList.toggle("show");

/* ================= THEME ================= */
function applyThemeFromStorage() {
    const stored = localStorage.getItem("theme");
    if(stored === "dark"){
        document.body.classList.add("dark");
    }
    updateThemeToggleLabel();
}

function updateThemeToggleLabel(){
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀ Light" : "🌙 Dark";
}

applyThemeFromStorage();

themeToggle.onclick=()=>{
    document.body.classList.toggle("dark");
    localStorage.setItem("theme",
        document.body.classList.contains("dark")?"dark":"light");
    updateThemeToggleLabel();
};

/* ================= SCROLL + PROGRESS ================= */
window.addEventListener("scroll",()=>{
    const scrollTop = window.scrollY;
    const height = document.body.scrollHeight - window.innerHeight;

    progressBar.style.width = (scrollTop/height)*100 + "%";

    if(window.scrollY>500) topBtn.style.display="block";
    else topBtn.style.display="none";

    if(window.innerHeight + window.scrollY >= document.body.offsetHeight-200)
        getNews();
});

/* ================= FETCH NEWS ================= */
async function getNews(reset=false){

    if(loading || endReached) return;
    loading = true;

    if(reset){
        page=1;
        endReached=false;
        container.innerHTML="";
        loader.innerText="Loading news...";
    }

    const keyword = searchQuery || (currentCategory + " india news");

    const url=`https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&language=en&sortBy=publishedAt&pageSize=9&page=${page}&apiKey=${API_KEY}`;

    try{
        const res = await fetch(url);
        if(!res.ok) throw new Error("API error");

        const data = await res.json();

        if(!data.articles || data.articles.length===0){
            const isSearch = !!searchQuery;
            loader.innerHTML = `
                <div class="spinner"></div>
                <span class="loader-text">${isSearch ? "No articles found for this search." : "No more news"}</span>
            `;
            endReached=true;
            loading=false;
            return;
        }

        if(page===1){
            setFeatured(data.articles[0]);
            setTicker(data.articles);
        }

        data.articles.forEach(createCard);
        page++;

    }catch(err){
        loader.innerHTML = `
            <div class="spinner"></div>
            <span class="loader-text">⚠ Unable to load news</span>
            <button class="share" id="retryBtn">Retry</button>
        `;
        const retry = document.getElementById("retryBtn");
        if(retry){
            retry.onclick = () => {
                loader.innerHTML = `
                    <div class="spinner"></div>
                    <span class="loader-text">Loading news...</span>
                `;
                getNews(false);
            };
        }
        showToast("API limit reached or network issue");
    }

    loading=false;
}

/* ================= FEATURED ================= */
function setFeatured(a){
    featured.innerHTML=`
        <img src="${a.urlToImage || 'https://picsum.photos/1000/600'}">
        <div class="overlay">
            <h2>${a.title}</h2>
            <p>${a.description||""}</p>
        </div>`;

    featured.onclick=()=>window.open(a.url,"_blank");
}

/* ================= TICKER ================= */
function setTicker(articles){
    const headlines=articles.slice(0,6)
        .map(a=>"🔴 "+a.title)
        .join(" ✦ ");
    ticker.innerHTML=`<span>${headlines}</span>`;
}

/* ================= CARD ================= */
function createCard(a){

    if(!a.title) return;

    const words=((a.content||a.description||"").split(" ").length);
    const readTime=Math.max(1,Math.ceil(words/200));
    const date=new Date(a.publishedAt).toLocaleDateString();

    const card=document.createElement("div");
    card.className="card";

    card.innerHTML=`
        <div class="bookmark">☆</div>
        <img loading="lazy" src="${a.urlToImage || 'https://picsum.photos/500/300?random='+Math.random()}">
        <div class="content">
            <div class="meta">${a.source.name} • ${date} • ${readTime} min read</div>
            <div class="title">${a.title}</div>
            <div class="desc">${a.description||""}</div>
            <button class="share">Share</button>
        </div>
    `;

    /* ---------- Prevent star/share from opening article ---------- */
    card.addEventListener("click",(e)=>{
        if(e.target.closest(".bookmark") || e.target.closest(".share")) return;
        window.open(a.url,"_blank");
    });

    /* ---------- Bookmark Logic (SAFE STORAGE) ---------- */
    const bookmarkBtn = card.querySelector(".bookmark");
    let saved=JSON.parse(localStorage.getItem("savedNews"))||[];

    // restore star on reload
    if(saved.some(item=>item.url===a.url))
        bookmarkBtn.innerText="⭐";

    bookmarkBtn.addEventListener("click",(e)=>{
        e.stopPropagation();

        saved=JSON.parse(localStorage.getItem("savedNews"))||[];

        const articleData={
            title:a.title,
            description:a.description,
            url:a.url,
            urlToImage:a.urlToImage,
            source:a.source?.name,
            publishedAt:a.publishedAt
        };

        const exists=saved.find(item=>item.url===articleData.url);

        if(exists){
            saved=saved.filter(item=>item.url!==articleData.url);
            bookmarkBtn.innerText="☆";
            showToast("Removed from Saved");
        }else{
            saved.push(articleData);
            bookmarkBtn.innerText="⭐";
            showToast("Saved Successfully");
        }

        localStorage.setItem("savedNews",JSON.stringify(saved));
    });

    /* ---------- Share ---------- */
    card.querySelector(".share").addEventListener("click",(e)=>{
        e.stopPropagation();

        if(navigator.share){
            navigator.share({title:a.title,url:a.url});
        }else{
            navigator.clipboard.writeText(a.url);
            showToast("Link Copied");
        }
    });

    container.appendChild(card);
}

/* ================= CATEGORY ================= */
document.querySelectorAll(".nav-btn").forEach(btn=>{
    btn.onclick=()=>{
        document.querySelector(".active").classList.remove("active");
        btn.classList.add("active");
        currentCategory=btn.dataset.category;
        searchQuery="";
        getNews(true);
    };
});

/* ================= SEARCH ================= */
let timer;
search.oninput=e=>{
    clearTimeout(timer);
    timer=setTimeout(()=>{
        searchQuery=e.target.value.trim();
        getNews(true);
    },600);
};

/* ================= TOP BUTTON ================= */
topBtn.onclick=()=>window.scrollTo({top:0,behavior:"smooth"});

/* ================= INITIAL LOAD ================= */
getNews(true);