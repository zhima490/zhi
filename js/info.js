document.addEventListener('DOMContentLoaded', function() {
    // 從 sessionStorage 獲取所有選擇的資訊
    const selectedDate = sessionStorage.getItem('selectedDate');
    const selectedTime = sessionStorage.getItem('selectedTime');
    const selectedAdults = sessionStorage.getItem('selectedAdults');
    const selectedChildren = sessionStorage.getItem('selectedChildren');
    
    if (!selectedDate || !selectedTime) {
        window.location.href = '/uf';
        return;
    }

    // 設置隱藏的表單值
    document.getElementById('date').value = selectedDate;
    document.getElementById('time').value = selectedTime;
    document.getElementById('adults').value = selectedAdults || '1';
    document.getElementById('children').value = selectedChildren || '0';

    // 顯示選擇的日期和時間
    const date = new Date(selectedDate);
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} (${dayNames[date.getDay()]})`;
    
    document.getElementById('displayDate').textContent = formattedDate;
    document.getElementById('displayTime').textContent = selectedTime;

    // 顯示選擇的人數
    const peopleText = [];
    if (selectedAdults) {
        peopleText.push(`${selectedAdults}位大人`);
    }
    if (selectedChildren && selectedChildren !== '0') {
        peopleText.push(`${selectedChildren}位小孩`);
    }
    document.getElementById('displayPeople').textContent = peopleText.join('、') || '1位大人';

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
