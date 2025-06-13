document.addEventListener('DOMContentLoaded', () => {
  window.onContentLoaded = function(pageName) {
    if (pageName === 'professionals') {
      const buttons = document.querySelectorAll('.list_button');
      const listWrap = document.querySelector('.professionals_list_wrap');
      const detailItems = document.querySelectorAll('.professionals_detail');
      const closeButtons = document.querySelectorAll('.close_button');
  
      detailItems.forEach(d => d.style.display = 'none');
  
      buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
          listWrap.style.display = 'none';
          detailItems.forEach(detail => detail.style.display = 'none');
          if (detailItems[index]) {
            detailItems[index].style.display = 'flex';
            window.history.pushState({ pageName: 'professionals/detail' }, '', '/professionals/detail');
          }
        });
      });
  
      closeButtons.forEach(button => {
        button.addEventListener('click', () => {
          listWrap.style.display = 'flex';
          detailItems.forEach(detail => detail.style.display = 'none');
          window.history.pushState({ pageName: 'professionals' }, '', '/professionals');
        });
      });
  
      // ✅ 현재 주소가 /professionals/detail 이면 상세 보기 자동 열기
      const currentPath = window.location.pathname;
      if (currentPath === '/professionals/detail') {
        listWrap.style.display = 'none';
        if (detailItems[0]) detailItems[0].style.display = 'flex'; // 첫번째 상세를 자동 표시하거나 index를 쿼리파라미터로 처리 가능
      }
    }
  };  
});