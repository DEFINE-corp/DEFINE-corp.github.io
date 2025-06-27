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
  // 최초 한 번만 실행되도록 플래그 사용
  let cacheBusted = false;

  document.querySelectorAll('[data-include]').forEach(el => {
    fetch(el.getAttribute('data-include'))
      .then(response => response.text())
      .then(data => {
        el.innerHTML = data;

        if (el.getAttribute('data-include').includes('header.html')) {
          window.bindNavEvents();
          window.bindHeaderScroll();
          window.bindMobileNavToggle();

          updateLogoImageStyle();
        }

        if (el.getAttribute('data-include').includes('footer.html')) {
          const footerLinks = el.querySelectorAll('a[data-page]');
          footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              const page = link.getAttribute('data-page');
              window.loadMainContent(page);
            });
          });
        }        

        if (!cacheBusted) {
          // CSS 캐시 무시 한번만
          const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
          cssLinks.forEach(link => {
            let href = link.getAttribute('href');
            if (href && !href.includes('?v=')) {
              const newHref = `${href}?v=${version}`;
              const newLink = link.cloneNode();
              newLink.setAttribute('href', newHref);
              link.parentNode.replaceChild(newLink, link);
            }
          });

          // JS 캐시 무시 한번만
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

          // style.css 내 @import 처리
          const styleSheet = document.querySelector('link[rel="stylesheet"][href="/css/style.css"]');
          if (styleSheet) {
            fetch(styleSheet.href)
              .then(response => response.text())
              .then(content => {
                // @import 구문에서 버전 추가
                content = content.replace(/@import\s*['"]([^'"]+)\.css['"];/g, (match, p1) => {
                  return `@import '${p1}.css?v=${version}';`;
                });

                // 수정된 내용을 <style> 태그로 삽입
                const styleTag = document.createElement('style');
                styleTag.innerHTML = content;
                document.head.appendChild(styleTag);
              })
              .catch(error => console.error('Error loading style.css:', error));
          }

          cacheBusted = true;
        }
      });
  });

  function updateLogoImageStyle() {
    const logoImg = document.querySelector('.logo img');
    if (!logoImg) return;
  
    const isHome = document.body.classList.contains('main');
    logoImg.src = isHome
      ? '../images/common/logo_white.svg'
      : '../images/common/logo_blue.svg';
  }  

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
        } else {
          body.classList.remove('main');
          body.classList.add('sub');
        }
  
        main.innerHTML = data;

        updateLogoImageStyle();

        // ScrollTrigger 초기화 및 기존 Trigger 제거
        ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // 모든 기존 ScrollTrigger를 제거

        // 스크롤 트리거 새로 초기화
        initializeScrollTrigger();

        window.scrollTo(0, 0);
  
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
          else if (pageName === 'practices') newUrl = '/practices';
          else if (pageName === 'terms_privacy') newUrl = '/terms-privacy';
          else if (pageName === 'terms_email') newUrl = '/terms-email';
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

  let isMobileNavBound = false;

  window.bindMobileNavToggle = function () {
    if (isMobileNavBound) return;
    isMobileNavBound = true;

    const toggle = document.querySelector('.mobile_nav_toggle');
    const navLinks = document.querySelectorAll('.nav_links a');

    // 메뉴 항목 클릭 시 메뉴 닫기
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (toggle?.checked) toggle.checked = false;
      });
    });

    // 바깥 클릭 시 메뉴 닫기 (setTimeout으로 defer 처리)
    document.addEventListener('pointerdown', (e) => {
      if (!toggle?.checked) return;

      const isInsideNav = e.target.closest('nav');
      const isInsideLabel = e.target.closest('label.mobile_nav_label');
      const isInsideIcon = e.target.closest('.mobile_nav_icon');

      // nav 또는 label 내부 클릭이면 닫지 않음
      if (isInsideNav || isInsideLabel || isInsideIcon) return;

      // defer 처리
      setTimeout(() => {
        if (toggle.checked) {
          toggle.checked = false;
        }
      }, 0);
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
    'practices': 'practices',
    'terms-privacy': 'terms_privacy',
    'terms-email': 'terms_email'
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

  function initializeScrollTrigger() {
    // .motion_sub_visual_wrap 내에서 ScrollTrigger 초기화
    const observer = new MutationObserver(() => {
      const img = document.querySelector(".motion_sub_visual_wrap .motion_sub_visual img");
      const titleH2 = document.querySelector(".motion_sub_visual_wrap .motion_sub_title h2");
      const titleP = document.querySelector(".motion_sub_visual_wrap .motion_sub_title p");
  
      if (img && titleH2 && titleP) {
        // 기존 ScrollTrigger가 존재하면 제거
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());

        if (!gsap.core.globals().ScrollTrigger) {
          gsap.registerPlugin(ScrollTrigger);
        }
  
        gsap.set(img, {
          width: 1300,
          height: 540,
          scale: 1,
          xPercent: -50,
          yPercent: -50,
          transformOrigin: "center center"
        });
  
        gsap.set(titleH2, { opacity: 0, y: 40 });
        gsap.set(titleP, { opacity: 0, y: 40 });
  
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".motion_sub_visual",
            start: "center center",
            end: "+=150%",
            pin: true,
            scrub: true,
            markers: false
          }
        });
  
        tl.to(img, {
          scale: 2.5,
          duration: 1.5,
          ease: "power2.inOut"
        });
  
        tl.to(titleH2, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out"
        });
  
        tl.to(titleP, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out"
        });
  
        ScrollTrigger.refresh();
        observer.disconnect(); // observer 종료
      }
    });
  
    // DOM 변화 감지 시작
    observer.observe(document.body, { childList: true, subtree: true });
  }  
});