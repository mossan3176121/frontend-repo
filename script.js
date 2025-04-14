window.addEventListener('load', function () {
    var gtmScript = document.createElement('script');
    gtmScript.src = "https://www.googletagmanager.com/gtag/js?id=G-8YBTB93Y69";
    gtmScript.async = true;
    document.head.appendChild(gtmScript);

    gtmScript.onload = function () {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-8YBTB93Y69');
    };
});

const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");
const mainContent = document.getElementById("mainContent");
const overlay = document.getElementById("overlay");

toggleBtn.addEventListener("click", () => {
  const isClosed = sidebar.classList.toggle("closed");
  mainContent.classList.toggle("full-width");

  if (window.innerWidth < 768) {
    overlay.classList.toggle("hidden", isClosed);
  }
});

const menuItems = document.querySelectorAll(".menu-item");
menuItems.forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    item.classList.toggle("open");
    const next = item.nextElementSibling;
    if (next && next.tagName === 'UL') {
      next.classList.toggle("open");
    }
  });
});

const sidebarLinks = sidebar.querySelectorAll(".menu-link");
sidebarLinks.forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      sidebar.classList.add("closed");
      mainContent.classList.add("full-width");
      overlay.classList.add("hidden");
    }
  });
});

overlay.addEventListener("click", () => {
  sidebar.classList.add("closed");
  mainContent.classList.add("full-width");
  overlay.classList.add("hidden");
});

// ✅ URLに応じて自動で active クラスを付与
const currentPath = window.location.pathname;
sidebarLinks.forEach(link => {
  const linkPath = new URL(link.href).pathname;
  if (currentPath === linkPath) {
    link.classList.add("active");
    // サブメニューも展開
    let parent = link.parentElement.parentElement.previousElementSibling;
    if (parent?.classList.contains("menu-item")) {
      parent.classList.add("open");
      link.parentElement.parentElement.classList.add("open");
    }
  }
});

let lastScrollY = window.scrollY;
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  // モバイルサイズのみ有効
  if (window.innerWidth < 768) {
    if (currentScrollY > lastScrollY) {
      // スクロールダウン：ヘッダーを隠す
      header.style.top = "-64px";
    } else {
      // スクロールアップ：ヘッダーを表示
      header.style.top = "0";
    }
  }

  lastScrollY = currentScrollY;
});
