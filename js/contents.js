document.addEventListener('DOMContentLoaded', () => {
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
          history.replaceState({ pageName: 'professionals/detail' }, '', '/professionals/detail');
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
          history.replaceState({ pageName: 'professionals' }, '', '/professionals');
        });
      });
  
      // ✅ 현재 주소가 /professionals/detail 이면 상세 보기 자동 열기
      if (window.location.pathname === '/professionals/detail') {
        window.showProfessionalDetail(0); // 첫 번째 상세
      }
    }
  };   
});