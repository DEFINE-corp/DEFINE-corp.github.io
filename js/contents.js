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
  const subTitle = document.querySelector('.sub_title');
  const windowHeight = window.innerHeight;
  const scrollPosition = window.scrollY;

  // 1. 이미지가 100% 크기로 커질 때 고정
  const scale = 1 + (scrollPosition / windowHeight) * 3; // 커지는 비율 설정
  const imageWidth = 1300 * scale;
  const imageHeight = 504 * scale;

  // 이미지가 100% 크기로 커지면 고정
  if (scale >= 1.8) {
    image.style.width = `${imageWidth}px`;
    image.style.height = `${imageHeight}px`;
    image.style.position = 'fixed';
    image.style.top = 0; // 이미지가 화면에 고정되도록 설정
    image.style.left = 0; // 좌측 상단에 고정
  } else {
    image.style.width = `${imageWidth}px`;
    image.style.height = `${imageHeight}px`;
  }

  // 2. 서브타이틀 텍스트 애니메이션
  if (scrollPosition > windowHeight / 3) {
    subTitle.classList.add('is-visible'); // 텍스트 애니메이션을 시작
  } else {
    subTitle.classList.remove('is-visible'); // 스크롤이 다시 위로 올라가면 텍스트가 숨겨짐
  }

  // 3. 서브타이틀의 텍스트가 다 나타난 후, 스크롤이 더 내려가면 이미지가 리사이징 되도록
  if (scrollPosition > windowHeight * 1.5 && scale >= 1.8) {
    image.style.width = `${1300}px`; // 이미지가 다시 원래 크기로 줄어듬
    image.style.height = `${504}px`;
    image.style.position = 'absolute';
    image.style.top = '50%'; // 이미지의 위치를 원래대로 되돌림
    image.style.left = '50%';
    image.style.transform = 'translate(-50%, -50%)';
  }
});
