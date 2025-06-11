document.addEventListener('DOMContentLoaded', () => {
  // 공통 include 처리 (header, footer)
  document.querySelectorAll('[data-include]').forEach(el => {
    fetch(el.getAttribute('data-include'))
      .then(response => response.text())
      .then(data => {
        el.innerHTML = data;

        if (el.getAttribute('data-include').includes('header.html')) {
          window.bindNavEvents();  // 전역에 노출된 함수 호출
          window.bindHeaderScroll();
        }
      });
  });

  window.loadMainContent = function(pageName) {
    const main = document.querySelector('main');
    fetch(`html/content/${pageName}.html`)
      .then(response => response.text())
      .then(data => {
        main.innerHTML = data;

        const body = document.body;
        if (pageName === 'home') {
          body.classList.add('main');
          body.classList.remove('sub');

          const logoImg = document.querySelector('.logo img');
          if (logoImg) logoImg.src = '../images/common/logo_white.svg';
        } else {
          body.classList.add('sub');
          body.classList.remove('main');

          const logoImg = document.querySelector('.logo img');
          if (logoImg) logoImg.src = '../images/common/logo_blue.svg';
        }

        // 콘텐츠가 완전히 로드된 시점에 이벤트 바인딩 함수 호출
        if (window.onContentLoaded) {
          window.onContentLoaded(pageName);
        }
      });
  };

  window.bindNavEvents = function() {
    const navLinks = document.querySelectorAll('nav a[data-page]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        window.loadMainContent(page);
      });
    });
  };

  window.bindHeaderScroll = function() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  };

  // 최초 초기화
  loadMainContent('home');
});