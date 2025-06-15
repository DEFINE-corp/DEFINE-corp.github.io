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
    center: new naver.maps.LatLng(37.513787, 127.058120),
    zoom: 16,
  };

  const map = new naver.maps.Map('map', mapOptions);
}

// email
document.getElementById('contactForm').addEventListener('submit', async function (e) {
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
      document.getElementById('contactForm').reset();
    } else {
      alert('전송 중 오류가 발생했습니다.');
    }
  } catch (err) {
    console.error(err);
    alert('전송 실패');
  }
});