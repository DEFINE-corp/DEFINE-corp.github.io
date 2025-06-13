document.addEventListener('DOMContentLoaded', () => {
  window.onContentLoaded = function(pageName) {
    // 페이지 로드 시 이벤트 바인딩
    if (pageName === 'professionals') {
      const buttons = document.querySelectorAll('.list_button');
      const listWrap = document.querySelector('.professionals_list_wrap');
      const detailItems = document.querySelectorAll('.professionals_detail');
      const closeButtons = document.querySelectorAll('.close_button'); // X 버튼들

      // 상세 정보는 처음에 숨겨두기
      detailItems.forEach(d => d.style.display = 'none');

      // 전문가 목록 클릭 시 상세 화면 보여주기
      buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
          listWrap.style.display = 'none';  // 전문가 목록 숨기기
          detailItems.forEach(detail => detail.style.display = 'none');  // 모든 상세 정보 숨기기
          if (detailItems[index]) {
            detailItems[index].style.display = 'flex';  // 클릭한 전문가의 상세 정보만 보이기

            // URL을 `professionals/detail`로 업데이트
            const pageName = 'professionals/detail'; // 상세 페이지 URL
            window.history.pushState({ pageName }, '', '/professionals/detail');
          }
        });
      });

      // X 버튼 클릭 시 상세 정보 숨기고 목록 화면으로 돌아가기
      closeButtons.forEach(button => {
        button.addEventListener('click', () => {
          listWrap.style.display = 'flex';  // 목록 화면 보이기
          detailItems.forEach(detail => detail.style.display = 'none');  // 상세 정보 숨기기

          // URL을 `professionals`로 되돌리기
          const pageName = 'professionals'; // 목록 페이지 URL
          window.history.pushState({ pageName }, '', '/professionals');
        });
      });
    }
  };
});