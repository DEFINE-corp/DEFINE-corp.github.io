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

// sub - motion
window.addEventListener('scroll', function() {
  const image = document.querySelector('.scroll-image');
  const textContent = document.querySelector('.text-content');

  // 만약 해당 클래스가 존재할 때에만 실행
  if (image && textContent) {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    // 이미지 크기 변화 (초기 이미지 크기에서 점차 커짐)
    const scaleFactor = 2; // 최대 확대 배율 (예: 2배)
    const imageWidth = 1300 * scaleFactor; // 최대 너비
    const imageHeight = 504 * scaleFactor; // 최대 높이

    // 스크롤에 따라 이미지 크기와 투명도 변화
    const scale = 1 + scrollPosition / (windowHeight * 2); // 확대 비율 (스크롤이 내려갈수록 이미지 확대)
    const imageOpacity = 1 - Math.min(scrollPosition / windowHeight, 1); // 이미지가 스크롤될수록 투명해짐
    image.style.width = `${1300 * scale}px`; // 이미지 너비 변경
    image.style.height = `${504 * scale}px`; // 이미지 높이 변경
    image.style.opacity = 1; // 처음부터 이미지는 보이도록 설정

    // 텍스트가 나타나는 조건
    if (scrollPosition > windowHeight / 2) {
      textContent.style.opacity = 1; // 텍스트가 나타남
    } else {
      textContent.style.opacity = 0; // 텍스트가 숨겨짐
    }
  }
});
