document.addEventListener("DOMContentLoaded", () => {
  // 공통 include 처리 (header, footer)
  document.querySelectorAll("[data-include]").forEach(el => {
    fetch(el.getAttribute("data-include"))
      .then(response => response.text())
      .then(data => {
        el.innerHTML = data;

        // header 로드된 후 nav 이벤트 바인딩
        if (el.getAttribute("data-include").includes("header.html")) {
          bindNavEvents();
        }
      });
  });

  // 초기 콘텐츠 로딩
  loadMainContent("home");

  function bindNavEvents() {
    const navLinks = document.querySelectorAll("nav a[data-page]");
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = link.getAttribute("data-page");
        loadMainContent(page);
      });
    });
  }

  function loadMainContent(pageName) {
    const main = document.querySelector("main");
    fetch(`html/content/${pageName}.html`)
      .then(response => {
        if (!response.ok) throw new Error("Page not found");
        return response.text();
      })
      .then(data => {
        main.innerHTML = data;
      })
      .catch(err => {
        main.innerHTML = "<p>페이지를 불러오지 못했습니다.</p>";
        console.error(err);
      });
  }
});
