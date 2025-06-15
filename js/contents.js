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
        if (detailItems[index]) {
          detailItems[index].style.display = 'flex';
          history.pushState({ pageName: 'professionals/detail', index }, '', '/professionals/detail');
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
  const mapEl = document.getElementById('map');
  if (!mapEl) {
    console.warn('#map 요소가 존재하지 않아 지도 초기화를 건너뜁니다.');
    return;
  }

  const mapOptions = {
    center: new naver.maps.LatLng(37.3595704, 127.105399), // 초기 위치
    zoom: 16
  };

  const map = new naver.maps.Map('map', mapOptions);

  // 주소 → 좌표 변환 (정적 메서드 사용)
  naver.maps.Service.geocode(
    { query: '서울특별시 강남구 봉은사로30길 68' },
    function(status, response) {
      if (status !== naver.maps.Service.Status.OK) {
        return alert('Geocoding 실패');
      }
  
      const result = response.v2.addresses[0]; // 좌표 정보
      const coords = new naver.maps.LatLng(result.y, result.x);
  
      map.setCenter(coords);
  
      // 마커 표시 (선택 사항)
      new naver.maps.Marker({
        position: coords,
        map: map
      });
    }
  );  
}