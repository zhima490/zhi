document.addEventListener('DOMContentLoaded', function() {
    // 從 sessionStorage 獲取選擇的日期和時間
    const selectedDate = sessionStorage.getItem('selectedDate');
    const selectedTime = sessionStorage.getItem('selectedTime');
    
    if (!selectedDate || !selectedTime) {
        window.location.href = '/uf'; // 如果沒有日期或時間就返回選擇頁面
        return;
    }

    // 設置隱藏的表單值
    document.getElementById('date').value = selectedDate;
    document.getElementById('time').value = selectedTime;

    // 顯示選擇的日期和時間
    const date = new Date(selectedDate);
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} (${dayNames[date.getDay()]})`;
    
    document.getElementById('displayDate').textContent = formattedDate;
    document.getElementById('displayTime').textContent = selectedTime;

    // 表單提交處理
    const form = document.getElementById('reservationForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.redirected) {
                window.location.href = response.url;
            } else {
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || '預訂失敗');
                }
            }
        } catch (error) {
            console.error('Reservation error:', error);
            alert(error.message || '預訂失敗，請稍後再試');
        }
    });
}); 
