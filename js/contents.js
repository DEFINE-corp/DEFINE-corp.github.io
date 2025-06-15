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
  const mapOptions = {
    center: new naver.maps.LatLng(37.503219, 127.036620),
    zoom: 20,
  };

  const map = new naver.maps.Map('map', mapOptions);

  // 마커 위치 설정
  const markerPosition = new naver.maps.LatLng(37.503219, 127.036620);
  
  // 마커 생성
  const marker = new naver.maps.Marker({
    position: markerPosition,
    map: map,
    title: "DEFINE 특허법인",  // 마커에 마우스를 올리면 표시되는 타이틀
  });

  // InfoWindow 생성 (마커 위에 항상 표시될 텍스트)
  const infowindow = new naver.maps.InfoWindow({
    content: '<div class="location_map_title">DEFINE 특허법인</div>',  // 표시할 내용
    position: markerPosition  // InfoWindow를 마커 위치에 띄움
  });

  // InfoWindow를 지도에 표시
  infowindow.open(map);
}

// email
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = {
        category: document.getElementById('category').value,
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        qna: document.getElementById('qna').value,
      };

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          alert('문의가 성공적으로 전송되었습니다.');
          form.reset();  // form.reset()을 이렇게 사용
        } else {
          alert('전송 중 오류가 발생했습니다.');
        }
      } catch (err) {
        console.error(err);
        alert('전송 실패');
      }
    });
  } else {
    console.error('contactForm 요소를 찾을 수 없습니다.');
  }
});