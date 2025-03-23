document.addEventListener('DOMContentLoaded', function() {
    // 從 sessionStorage 獲取所有選擇的資訊
    const selectedDate = sessionStorage.getItem('selectedDate');
    const selectedTime = sessionStorage.getItem('selectedTime');
    const selectedAdults = sessionStorage.getItem('selectedAdults') || '1';
    const selectedChildren = sessionStorage.getItem('selectedChildren') || '0';
    
    if (!selectedDate || !selectedTime) {
        window.location.href = '/uf';
        return;
    }

    // 設置隱藏的表單值
    document.getElementById('date').value = selectedDate;
    document.getElementById('time').value = selectedTime;
    document.getElementById('adults').value = selectedAdults;
    document.getElementById('children').value = selectedChildren;

    // 顯示選擇的日期和時間
    const date = new Date(selectedDate);
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} (${dayNames[date.getDay()]})`;
    
    document.getElementById('displayDate').textContent = formattedDate;
    document.getElementById('displayTime').textContent = selectedTime;

    // 顯示選擇的人數
    let peopleText = [];
    peopleText.push(`${selectedAdults}位大人`);
    if (selectedChildren && selectedChildren !== '0') {
        peopleText.push(`${selectedChildren}位小孩`);
    }
    document.getElementById('displayPeople').textContent = peopleText.join('、');


    // 表單提交處理
    const form = document.getElementById('reservationForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // 獲取提交按鈕並修改文字和狀態
        const submitButton = document.querySelector('.submit-btn');
        const originalText = submitButton.textContent;
        submitButton.textContent = '正在提交訂位';
        submitButton.disabled = true;

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
            
            // 發生錯誤時恢復按鈕狀態
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}); 
