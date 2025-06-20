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
      
          // Get the bounding rectangle for the detail item
          const rect = detail.getBoundingClientRect();
          const detailTop = rect.top + window.scrollY;
          const detailHeight = rect.height;
          const windowHeight = window.innerHeight;
      
          // Scroll to the middle of the screen where the detail is
          window.scrollTo(0, detailTop - (windowHeight / 2) + (detailHeight / 2));
      
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
