document.addEventListener('DOMContentLoaded', function() {
    // 從 sessionStorage 獲取選擇的日期和時間
    const selectedDate = sessionStorage.getItem('selectedDate');
    const selectedTime = sessionStorage.getItem('selectedTime');
    
    if (!selectedDate || !selectedTime) {
        window.location.href = '/uf'; // 如果沒有日期或時間就返回選擇頁面
        return;
    }

    // 顯示選擇的日期和時間
    const date = new Date(selectedDate);
    const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
    document.getElementById('displayDate').textContent = `${formattedDate} ${selectedTime}`;

    // 初始化表單其他部分的代碼...
}); 
