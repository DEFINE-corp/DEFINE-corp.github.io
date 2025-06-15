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
  };

  initNaverMap();
});

// location map
function initNaverMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl) {
    console.warn('#map 요소가 존재하지 않아 지도 초기화를 건너뜁니다.');
    return;
  }

  var mapOptions = {
    center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 16
  };

  var map = new naver.maps.Map('map', mapOptions);

  var geocoder = new naver.maps.Service();

  geocoder.geocode({ address: '서울특별시 강남구 봉은사로30길 68' }, function(status, response) {
    if (status !== naver.maps.Service.Status.OK) {
      return alert('Geocoding 실패');
    }

    var result = response.result.items[0];
    var coords = new naver.maps.LatLng(result.point.y, result.point.x);

    console.log('위도:', coords.lat(), '경도:', coords.lng());

    map.setCenter(coords);
  });
}