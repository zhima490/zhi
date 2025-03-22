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

    // 人數計數器邏輯
    const maxTotal = 6; // 最大總人數
    let adults = 1;
    let children = 0;

    function updateCounts() {
        document.getElementById('adultsCount').textContent = adults;
        document.getElementById('childrenCount').textContent = children;
        document.getElementById('adults').value = adults;
        document.getElementById('children').value = children;

        // 更新按鈕狀態
        document.querySelector('[data-target="adults"].minus').disabled = adults <= 1;
        document.querySelector('[data-target="adults"].plus').disabled = adults + children >= maxTotal;
        document.querySelector('[data-target="children"].minus').disabled = children <= 0;
        document.querySelector('[data-target="children"].plus').disabled = adults + children >= maxTotal;
    }

    // 綁定計數器按鈕事件
    document.querySelectorAll('.counter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.dataset.target;
            const isPlus = this.classList.contains('plus');
            
            if (target === 'adults') {
                if (isPlus && adults + children < maxTotal) {
                    adults++;
                } else if (!isPlus && adults > 1) {
                    adults--;
                }
            } else if (target === 'children') {
                if (isPlus && adults + children < maxTotal) {
                    children++;
                } else if (!isPlus && children > 0) {
                    children--;
                }
            }
            
            updateCounts();
        });
    });

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

    // 初始化顯示
    updateCounts();
}); 
