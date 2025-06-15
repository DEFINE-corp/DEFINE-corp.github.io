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

          // 페이지 스크롤을 해당 detail 요소가 화면 중간에 오도록 설정
          const rect = detail.getBoundingClientRect();
          const detailTop = rect.top + window.scrollY;
          const detailHeight = rect.height;
          const windowHeight = window.innerHeight;

          // 스크롤을 중앙에 맞추기 (상단 50% - 화면의 절반 크기)
          window.scrollTo(0, detailTop - (windowHeight / 2) + (detailHeight / 2));

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
gsap.registerPlugin(ScrollTrigger);

// 1. 서브타이틀 텍스트 애니메이션
gsap.to(".sub_title", {
  opacity: 1, // 서브타이틀을 보이게
  y: 0, // 텍스트가 원래 위치로 이동
  duration: 1,
  scrollTrigger: {
    trigger: ".pin-spacer",
    start: "top 50%", // 이미지가 화면의 50%에 왔을 때
    end: "bottom center", // 스크롤이 중간을 지나갈 때
    scrub: true, // 스크롤에 따라 애니메이션이 연동되도록
    onEnter: () => console.log("Sub Title Entered"),
  }
});

// h2 텍스트 애니메이션 (시간차로 나타나게 설정)
gsap.from(".sub_title h2", {
  opacity: 0,
  y: 50,
  duration: 1,
  delay: 0.2, // h2는 약간 지연시켜서 나타나도록 설정
  scrollTrigger: {
    trigger: ".pin-spacer",
    start: "top 50%", // h2가 보일 때 스크롤 위치
    end: "bottom center",
    scrub: true,
    onEnter: () => console.log("h2 Entered")
  }
});

// p 텍스트 애니메이션 (h2 다음으로 나타나게 설정)
gsap.from(".sub_title p", {
  opacity: 0,
  y: 50,
  duration: 1,
  delay: 0.5, // p는 h2보다 더 늦게 나타나도록 설정
  scrollTrigger: {
    trigger: ".pin-spacer",
    start: "top 40%", // p가 보일 때 스크롤 위치
    end: "bottom center",
    scrub: true,
    onEnter: () => console.log("p Entered")
  }
});

// 2. 이미지 크기 조정 (스크롤에 따라 커짐)
gsap.to(".scroll-image", {
  scale: 2, // 이미지가 최대 2배로 커짐
  scrollTrigger: {
    trigger: ".pin-spacer",
    start: "top top", // 페이지가 최상단에 있을 때
    end: "bottom top", // 페이지가 끝에 도달할 때
    scrub: 1, // 스크롤에 따라 애니메이션이 자연스럽게 변화
    onUpdate: (self) => {
      if (self.progress > 0.5) {
        // 이미지가 꽉 차면 고정
        gsap.set(".scroll-image", { position: "fixed", top: 0, left: 0 });
      }
    }
  }
});

// 3. 이미지 고정 후, 텍스트 애니메이션 완료 후 이미지 크기 축소 (스크롤 후)
gsap.to(".scroll-image", {
  scale: 1,
  scrollTrigger: {
    trigger: ".sub_title",
    start: "top bottom", // 서브타이틀이 보일 때
    end: "bottom top",
    scrub: 1,
    onEnter: () => console.log("Image Shrink Entered"),
    onLeaveBack: () => gsap.set(".scroll-image", { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }) // 이미지 다시 원래 위치
  }
});
