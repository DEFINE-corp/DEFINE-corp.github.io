document.addEventListener('DOMContentLoaded', () => {
  // 현재 날짜+시간을 버전 문자열로 생성 (예: 20250613_143012)
  const now = new Date();
  const version =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') + '_' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');

  // 공통 include 처리 (header, footer)
  document.querySelectorAll('[data-include]').forEach(el => {
    fetch(el.getAttribute('data-include'))
      .then(response => response.text())
      .then(data => {
        el.innerHTML = data;

        if (el.getAttribute('data-include').includes('header.html')) {
          window.bindNavEvents();
          window.bindHeaderScroll();
        }

        // CSS 파일 캐시 무시하고 새로 불러오기
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach(link => {
          const url = link.getAttribute('href');
          if (url && !url.includes('?v=')) {
            link.setAttribute('href', `${url}?v=${version}`);
          }
        });

        // JS 파일 캐시 무시하고 새로 불러오기
        const scriptTags = document.querySelectorAll('script');
        scriptTags.forEach(script => {
          const url = script.getAttribute('src');
          if (url && !url.includes('?v=')) {
            script.setAttribute('src', `${url}?v=${version}`);
          }
        });
      });
  });

  window.loadMainContent = function(pageName, pushState = true) {
    const main = document.querySelector('main');
    fetch(`html/content/${pageName}.html`)
      .then(response => {
        if (!response.ok) throw new Error('Page not found');
        return response.text();
      })
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

        if (window.onContentLoaded) {
          window.onContentLoaded(pageName);
        }

        // 주소 변경
        if (pushState) {
          let newUrl = `/${pageName}`;
          if (pageName === 'home') {
            newUrl = '/';
          } else if (pageName === 'about') {
            newUrl = '/about-us';
          } else if (pageName === 'location') {
            newUrl = '/location';
          } else if (pageName === 'contact') {
            newUrl = '/contact-us';
          }
          history.pushState({ pageName }, '', newUrl);
        }
      })
      .catch(error => {
        main.innerHTML = `<p>요청한 페이지를 불러올 수 없습니다.</p>`;
        console.error(error);
      });
  };

  window.addEventListener('popstate', (event) => {
    const pageName = (event.state && event.state.pageName) || 'home';
    window.loadMainContent(pageName, false);  // pushState 하지 않음
  });

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
  // loadMainContent('home');

  // 초기 진입 시 경로 파싱
  const basePath = '';
  const redirectPath = sessionStorage.redirectPath;

  const urlToPageMap = {
    '': 'home',
    'about-us': 'about',
    'location': 'location',
    'contact-us': 'contact'
  };

  if (redirectPath) {
    sessionStorage.removeItem('redirectPath');
    const rawPath = redirectPath.replace(basePath, '').replace(/^\/+/, '');
    const path = urlToPageMap[rawPath] || 'home';
    loadMainContent(path);
  } else {
    const rawPath = window.location.pathname.replace(basePath, '').replace(/^\/+/, '');
    const path = urlToPageMap[rawPath] || 'home';
    loadMainContent(path);
  }
});