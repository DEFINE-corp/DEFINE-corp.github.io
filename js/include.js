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
          let href = link.getAttribute('href');
          if (href && !href.includes('?v=')) {
            const newHref = `${href}?v=${version}`;
            const newLink = link.cloneNode();
            newLink.setAttribute('href', newHref);
            link.parentNode.replaceChild(newLink, link);  // 기존 링크 교체
          }
        });

        // JS 파일 캐시 무시하고 새로 불러오기
        const scriptTags = document.querySelectorAll('script[src]');
        scriptTags.forEach(script => {
          let src = script.getAttribute('src');
          if (src && !src.includes('?v=')) {
            const newScript = document.createElement('script');
            newScript.src = `${src}?v=${version}`;
            newScript.defer = true;
            script.parentNode.replaceChild(newScript, script);
          }
        });
      });
  });

  window.loadMainContent = function(pageName, pushState = true) {
    const main = document.querySelector('main');
    const body = document.body;
  
    fetch(`/html/content/${pageName}.html`)
      .then(response => {
        if (!response.ok) throw new Error('Page not found');
        return response.text();
      })
      .then(data => {
        // 스타일 적용 전 body class 먼저 세팅
        if (pageName === 'home') {
          body.classList.remove('sub');
          body.classList.add('main');
          const logoImg = document.querySelector('.logo img');
          if (logoImg) logoImg.src = '../images/common/logo_white.svg';
        } else {
          body.classList.remove('main');
          body.classList.add('sub');
          const logoImg = document.querySelector('.logo img');
          if (logoImg) logoImg.src = '../images/common/logo_blue.svg';
        }
  
        main.innerHTML = data;
  
        if (window.onContentLoaded) {
          window.onContentLoaded(pageName);
        }
  
        if (pushState) {
          let newUrl = `/${pageName}`;
          if (pageName === 'home') newUrl = '/';
          else if (pageName === 'about') newUrl = '/about-us';
          else if (pageName === 'location') newUrl = '/location';
          else if (pageName === 'contact') newUrl = '/contact-us';
          else if (pageName === 'professionals') newUrl = '/professionals';
          history.pushState({ pageName }, '', newUrl);
        }
      })
      .catch(error => {
        main.innerHTML = `<p>요청한 페이지를 불러올 수 없습니다.</p>`;
        console.error(error);
      });
  };  

  window.addEventListener('popstate', (event) => {
    const state = event.state || {};
    const pageName = state.pageName || 'home';
  
    if (pageName === 'professionals/detail') {
      if (typeof window.showProfessionalDetail === 'function') {
        window.showProfessionalDetail(state.index || 0);
      } else {
        // 아직 contents.js에서 showProfessionalDetail 정의 안 됐을 경우
        window.loadMainContent('professionals', false);
      }
    } else {
      window.loadMainContent(pageName, false); // false → URL 변경 안 함
    }
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
    'contact-us': 'contact',
    'professionals': 'professionals',
    'professionals/detail': 'professionals',
  };

  if (redirectPath) {
    sessionStorage.removeItem('redirectPath');
    const rawPath = redirectPath.replace(basePath, '').replace(/^\/+/, '');
    const path = urlToPageMap[rawPath] || 'home';
  
    loadMainContent(path);
  
    // ✅ professionals/detail 리다이렉트일 때 상세 자동 표시
    if (rawPath === 'professionals/detail') {
      setTimeout(() => {
        if (typeof window.showProfessionalDetail === 'function') {
          window.showProfessionalDetail(0);
        }
      }, 100); // loadMainContent 후 DOM 렌더링 기다리기
    }
  } else {
    const rawPath = window.location.pathname.replace(basePath, '').replace(/^\/+/, '');
    const path = urlToPageMap[rawPath] || 'home';
  
    loadMainContent(path);
  
    // ✅ 새로고침 또는 직접 진입 케이스 처리
    if (rawPath === 'professionals/detail') {
      setTimeout(() => {
        if (typeof window.showProfessionalDetail === 'function') {
          window.showProfessionalDetail(0);
        }
      }, 100);
    }
  }  
});