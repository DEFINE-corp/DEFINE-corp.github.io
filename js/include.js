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

  window.loadMainContent = function(pageName, pushState = true) {
  const main = document.querySelector('main');
  fetch(`html/content/${pageName}.html`)
    .then(response => {
      if (!response.ok) throw new Error('Page not found');
      return response.text();
    })
    .then(data => {
      main.innerHTML = data;

      // const titleMap = {
      //   home: '홈',
      //   about: '회사 소개',
      //   contact: '문의하기'
      // };
      // document.title = `${titleMap[pageName] || '페이지'} | 사이트 이름`;

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
        history.pushState({ pageName }, '', `/${pageName}`);
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
  if (redirectPath) {
    sessionStorage.removeItem('redirectPath');
    const path = redirectPath.replace(basePath, '').replace(/^\/+/, '') || 'home';
    loadMainContent(path);
  } else {
    const path = window.location.pathname.replace(basePath, '').replace(/^\/+/, '') || 'home';
    loadMainContent(path);
  }
});