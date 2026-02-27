## 📰 The Big Issue – Latest News from India & World

The Big Issue is a lightweight news dashboard that shows the latest headlines from India and around the world using the NewsAPI service. It focuses on a clean, fast UI with dark mode, category filters, infinite scroll, and local “saved” bookmarks.

---

![The Big Issue Demo](https://raw.githubusercontent.com/Ubatham/The_Big_Issue--All_News_at_one_place/refs/heads/main/preview.png)

---

## 🌟 Features

- **Category filters**: Quickly switch between `General`, `Business`, `Sports`, `Tech`, `Entertainment`, and `Health`.
- **Search**: Type to search for specific topics; requests are debounced to avoid unnecessary API calls.
- **Featured story & breaking ticker**: Top story highlighted as a hero banner plus a moving breaking-news ticker.
- **Infinite scroll**: More articles auto-load as you reach the bottom.
- **Bookmarks**: Save / unsave articles to `localStorage` and view them on the `saved.html` page.
- **Share**: Uses the Web Share API when available, otherwise copies the article URL to the clipboard.
- **Dark mode**: Persistent theme toggle stored in `localStorage`.
- **Responsive UI**: Works on desktop, tablet, and mobile with a sticky navbar and hamburger menu.

## 🌟 Tech Stack

- **HTML5** – semantic layout and SEO meta tags.
- **CSS3** – modern, responsive layout and theming.
- **Vanilla JavaScript (ES6+)** – API integration and UI interactions.
- **NewsAPI** – article data (`https://newsapi.org/`).

## 🌟 Configuring the NewsAPI Key

This project uses NewsAPI’s `everything` endpoint. To use your own key:

1. Create a free account on `https://newsapi.org/`.
2. Generate an API key.
3. Open `script.js` and update the `API_KEY` constant near the top:

   ```js
   const API_KEY = "YOUR_NEWSAPI_KEY_HERE";
   ```

> **Note:** For production deployments, you should not expose sensitive keys in client-side JavaScript. Consider a small backend proxy if you need stronger protection or higher-rate plans.

## 🌟 Project Structure

- `index.html` – main news homepage.
- `style.css` – global styles, layout, and theme variables.
- `script.js` – NewsAPI integration and all interactions (search, filters, bookmarks, infinite scroll, etc.).
- `saved.html` (if present) – page that reads saved articles from `localStorage` and renders them.
- `preview.png` – social/OG preview image used in meta tags.

## 🌟 Key Behaviors

- **Infinite scroll**: As the user scrolls near the bottom, more articles are fetched unless the API reports no more results.
- **Saved articles**: Stored under the `savedNews` key in `localStorage`. Toggling the star on a card adds/removes that article.
- **Error handling**:
  - Shows toast notifications when the API fails or is rate-limited.
  - Displays a user-friendly message and a retry button in the loader area on errors.

## 🌟 Deployment

Because this is a static site (HTML/CSS/JS only), you can deploy it easily to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting or S3-compatible bucket

Just upload the project files and ensure that `index.html` is served as the root page.

### License

This project is for personal / educational use. If you plan to reuse or redistribute, please also respect the [NewsAPI terms of service](https://newsapi.org/terms).