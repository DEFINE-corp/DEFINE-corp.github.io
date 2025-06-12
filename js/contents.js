document.addEventListener('DOMContentLoaded', () => {
  window.onContentLoaded = function(pageName) {
    // 페이지 로드 시 이벤트 바인딩
    if (pageName === 'professionals') {
      const buttons = document.querySelectorAll('.list_button');
      const listWrap = document.querySelector('.professionals_list_wrap');
      const detailItems = document.querySelectorAll('.professionals_detail');
  
      detailItems.forEach(d => d.style.display = 'none');
  
      buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
          listWrap.style.display = 'none';
          detailItems.forEach(detail => {
            detail.style.display = 'none';
          });
          if (detailItems[index]) {
            detailItems[index].style.display = 'flex';
          }
          // detailWrap.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }
  };  
});