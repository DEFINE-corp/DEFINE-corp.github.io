document.addEventListener('DOMContentLoaded', () => {
  // professionals
  window.onContentLoaded = function(pageName) {
    if (pageName === 'professionals') {
      const buttons = document.querySelectorAll('.list_button');
      const listWrap = document.querySelector('.professionals_list_wrap');
      const detailItems = document.querySelectorAll('.professionals_detail');
      const closeButtons = document.querySelectorAll('.close_button');

      detailItems.forEach(d => d.style.display = 'none');

      window.showProfessionalDetail = function(index = 0) {
        listWrap.style.display = 'none';
        detailItems.forEach(detail => detail.style.display = 'none');
        
        // Check if the detailItems[index] exists
        if (detailItems[index]) {
          const detail = detailItems[index];
          detail.style.display = 'flex';

          const isMobile = window.innerWidth <= 768;

          if (isMobile) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const rect = detail.getBoundingClientRect();
            const detailTop = rect.top + window.scrollY;
            const detailHeight = rect.height;
            const windowHeight = window.innerHeight;
      
            window.scrollTo({
              top: detailTop - (windowHeight / 2) + (detailHeight / 2),
              behavior: 'smooth'
            });
          }
      
          history.pushState({ pageName: 'professionals/detail', index }, '', '/professionals/detail');
        } else {
          console.error("Detail item not found for index:", index);
        }
      };      

      buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
          window.showProfessionalDetail(index);
        });
      });

      closeButtons.forEach(button => {
        button.addEventListener('click', () => {
          listWrap.style.display = 'flex';
          detailItems.forEach(detail => detail.style.display = 'none');
          history.pushState({ pageName: 'professionals' }, '', '/professionals');
        });
      });

      // 최초 진입이 detail이면
      if (window.location.pathname === '/professionals/detail') {
        window.showProfessionalDetail(0);
      }
    }

    if (pageName === 'location') {
      initNaverMap();
    }
  };
});

// location map
function initNaverMap() {
  const mapOptions = {
    center: new naver.maps.LatLng(37.503219, 127.036620),
    zoom: 16,
  };

  const map = new naver.maps.Map('map', mapOptions);

  // 마커 생성 (위치 설정)
  const markerPosition = new naver.maps.LatLng(37.503219, 127.036620);
  const marker = new naver.maps.Marker({
    position: markerPosition,
    map: map,
    title: "DEFINE 특허법인",
  });
}

// select
document.addEventListener('DOMContentLoaded', function() {
  const selectWrapper = document.querySelector('.select-wrap');

  if (selectWrapper) {
    const select = selectWrapper.querySelector('select');

    select.addEventListener('focus', () => {
      selectWrapper.classList.add('open');
    });

    select.addEventListener('blur', () => {
      selectWrapper.classList.remove('open');
    });
  }
});
