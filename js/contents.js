document.addEventListener('DOMContentLoaded', () => {
  window.onContentLoaded = function(pageName) {
    // 예: 전문가 페이지 로드 시만 이벤트 바인딩
    if (pageName === 'professionals') {
      const buttons = document.querySelectorAll('.list_button');
      const listWrap = document.querySelector('.professionals_list_wrap');
      const detailWrap = document.querySelector('.professionals_detail_wrap');
      const detailItems = document.querySelectorAll('.professionals_detail');
  
      detailWrap.style.display = 'none';
      detailItems.forEach(d => d.style.display = 'none');
  
      buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
          listWrap.style.display = 'none';
          detailWrap.style.display = 'block';
          detailItems.forEach(detail => {
            detail.style.display = 'none';
          });
          if (detailItems[index]) {
            detailItems[index].style.display = 'block';
          }
          detailWrap.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }
  };  
});