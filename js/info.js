document.addEventListener('DOMContentLoaded', function() {
    // 從 sessionStorage 獲取選擇的日期
    const selectedDate = sessionStorage.getItem('selectedDate');
    if (!selectedDate) {
        window.location.href = '/uf'; // 如果沒有日期就返回選擇頁面
        return;
    }

    // 顯示選擇的日期
    const date = new Date(selectedDate);
    const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
    document.getElementById('displayDate').textContent = formattedDate;

    // 初始化表單其他部分的代碼...
}); 
