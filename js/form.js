document.addEventListener('DOMContentLoaded', function() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const reservationForm = document.getElementById('reservationForm');
    const cancelContainer = document.getElementById('cancel-container');
    const reservationSummary = document.getElementById('reservation-summary');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (this.dataset.form === 'reservation') {
                reservationForm.style.display = 'block';
                cancelContainer.style.display = 'none';
                reservationSummary.style.display = 'block';
            } else {
                reservationForm.style.display = 'none';
                cancelContainer.style.display = 'block';
                reservationSummary.style.display = 'none';
            }
        });
    });

    // 處理取消訂位表單的選項切換
    const cancelMethodRadios = document.querySelectorAll('input[name="cancelMethod"]');
    const codeInput = document.getElementById('codeInput');
    const infoInput = document.getElementById('infoInput');
    const reservationDisplay = document.getElementById('reservation-display');

    // 清除函數
    function clearForm() {
        // 清除所有輸入框的值
        codeInput.querySelector('input').value = '';
        infoInput.querySelectorAll('input').forEach(input => {
            input.value = '';
        });
        // 清除查詢結果
        reservationDisplay.innerHTML = '';
    }

    cancelMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // 切換選項時先清除表單和查詢結果
            clearForm();
            
            if (this.value === 'code') {
                // 顯示代碼輸入，隱藏姓名電話輸入
                codeInput.style.display = 'block';
                infoInput.style.display = 'none';
                // 設置必填項
                codeInput.querySelector('input').required = true;
                infoInput.querySelectorAll('input').forEach(input => {
                    input.required = false;
                });
            } else {
                // 顯示姓名電話輸入，隱藏代碼輸入
                codeInput.style.display = 'none';
                infoInput.style.display = 'block';
                // 設置必填項
                codeInput.querySelector('input').required = false;
                infoInput.querySelectorAll('input').forEach(input => {
                    input.required = true;
                });
            }
        });
    });

    if (typeof jQuery === 'undefined') {
        console.error('jQuery is not loaded!');
        return;
    }
    console.log('jQuery is loaded');

    // 處理取消訂位表單提交
    const cancelForm = document.getElementById('cancelForm');
    if (cancelForm) {
        cancelForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const cancelMethod = document.querySelector('input[name="cancelMethod"]:checked').value;
            let data;
            
            if (cancelMethod === 'code') {
                const bookingCode = document.querySelector('#codeInput input').value;
                data = { bookingCode };
            } else {
                const name = document.querySelector('#infoInput input[name="name"]').value;
                const phone = document.querySelector('#infoInput input[name="phone"]').value;
                data = { name, phone };
            }

            try {
                const endpoint = cancelMethod === 'code' ? 
                    '/api/reservations/search-by-code' : 
                    '/api/reservations/search-by-info';

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || '查詢失敗');
                }

                displayReservationInfo(result);
            } catch (error) {
                alert(error.message || '查詢失敗，請稍後再試');
            }
        });
    }

    // 綁定表單提交按鈕
    document.getElementById('submitButton')?.addEventListener('click', submitForm);
    
    // 其他事件監聽器設定
    setupFormListeners();
});

function setupFormListeners() {
    // 其他表單相關的事件監聽
    const form = document.getElementById('reservationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm();
        });
    }
}

async function submitForm() {
    try {
        // 獲取表單數據
        const formData = {
            name: document.getElementById('name').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            people: document.getElementById('people').value
        };

        // 發送 API 請求
        const response = await fetch('/api/cancel-reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            credentials: 'same-origin'
        });

        const result = await response.json();
        
        if (response.ok) {
            alert('取消成功！');
            window.location.href = '/';
        } else {
            alert(result.message || '取消失敗，請稍後再試');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('發生錯誤，請稍後再試');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const adultsSelect = document.getElementById('adults');
    const childrenSelect = document.getElementById('children');

    for (let i = 1; i <= 6; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}位大人`;
        adultsSelect.appendChild(option);
    }

    for (let i = 0; i <= 6; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}位小孩`;
        childrenSelect.appendChild(option);
    }

    adultsSelect.value = 1;
    document.getElementById('preview-adults').textContent = '1位大人';
    document.getElementById('preview-children').textContent = '0位小孩';

    adultsSelect.addEventListener('change', () => {
        document.getElementById('preview-adults').textContent = adultsSelect.value;
    });
    childrenSelect.addEventListener('change', () => {
        document.getElementById('preview-children').textContent = childrenSelect.value;
    });
    document.getElementById('phone').addEventListener('input', () => {
        document.getElementById('preview-phone').textContent = document.getElementById('phone').value;
    });
    document.getElementById('email').addEventListener('input', () => {
        document.getElementById('preview-email').textContent = document.getElementById('email').value;
    });
    document.getElementById('notes').addEventListener('input', () => {
        document.getElementById('preview-notes').textContent = document.getElementById('notes').value;
    });

    document.getElementById('vegetarian').addEventListener('input', () => {
        document.getElementById('preview-vegetarian').textContent = document.getElementById('vegetarian').value;
    });

    document.getElementById('specialNeeds').addEventListener('input', () => {
        document.getElementById('preview-special').textContent = document.getElementById('specialNeeds').value;
    });
});


const today = new Date();
today.setHours(0, 0, 0, 0)
let selectedTime = null;
let selectedDate = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function generateCalendar(month = currentMonth, year = currentYear) {
    const calendarTitle = document.getElementById('calendar-title');
    const daysContainer = document.getElementById('days-container');
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayWeekday = firstDay.getDay();

    calendarTitle.textContent = `${year}年 ${month + 1}月`;

    daysContainer.innerHTML = '';

    for (let i = 0; i < firstDayWeekday; i++) {
        daysContainer.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.classList.add('day');

        const currentDate = new Date(year, month, day);

        const isToday = currentDate.getDate() === today.getDate() &&
                       currentDate.getMonth() === today.getMonth() &&
                       currentDate.getFullYear() === today.getFullYear();

        // 如果是今天，添加底線
        if (isToday) {
            const underline = document.createElement('div');
            underline.classList.add('day-underline');
            dayElement.appendChild(underline);
        }

        if (currentDate < today) {
            dayElement.classList.add('disabled');
            dayElement.style.pointerEvents = 'none';
        } else {
            dayElement.addEventListener('click', () => selectDate(day, month, year));
        }

        daysContainer.appendChild(dayElement);
    }

    const prevMonthButton = document.getElementById('prevMonth');
    if (month === today.getMonth() && year === today.getFullYear()) {
        prevMonthButton.disabled = true;
        prevMonthButton.style.pointerEvents = 'none';
        prevMonthButton.style.opacity = 0.5;
    } else {
        prevMonthButton.disabled = false;
        prevMonthButton.style.pointerEvents = 'auto';
        prevMonthButton.style.opacity = 1;
    }
}

function selectDate(day, month, year) {
    selectedDate = new Date(year, month, day);
    const localDate = selectedDate.toLocaleDateString('en-CA'); 
    document.getElementById('date').value = localDate;

    const formattedDate = `${year}/${String(month + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const weekday = weekdays[selectedDate.getDay()];
    document.getElementById('preview-date').textContent = `${formattedDate} (${weekday})`;

    const days = document.querySelectorAll('#days-container .day');
    days.forEach(dayElement => {
        dayElement.classList.remove('selected');
        if (parseInt(dayElement.textContent) === day) {
            dayElement.classList.add('selected');
        }
    });

    // 顯示時間選擇器，確保表單欄位保持隱藏
    document.getElementById('time-picker-container').style.display = 'block';
    
    updateTimeButtons();
}

document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
});

document.getElementById('prevMonth').addEventListener('click', () => {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    generateCalendar(currentMonth, currentYear);
});

window.onload = () => {
    generateCalendar(currentMonth, currentYear);
};

const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); 
const yyyy = today.getFullYear();
const currentDate = `${yyyy}-${mm}-${dd}`;
document.getElementById('date').setAttribute('min', currentDate);

async function updateTimeButtons() {
    const selectedDate = new Date($('#date').val());
    const dayOfWeek = selectedDate.getDay();
    const dateString = selectedDate.toISOString().split('T')[0];
    
    // 預先清空並顯示載入中的提示
    const timeContainer = $('#time-picker-container');
    timeContainer.html('<div class="loading">載入時段中...</div>').show();
    
    try {
        // 預先定義時段模板
        const weekdaySlots = {
            morning: [
                { time: '11:00', id: 'wm1' },
                { time: '11:30', id: 'wm1' },
                { time: '12:00', id: 'wm2' },
                { time: '12:30', id: 'wm2' },
                { time: '13:00', id: 'wm3' },
                { time: '13:30', id: 'wm3' }
            ],
            afternoon: [
                { time: '17:00', id: 'wa1' },
                { time: '17:30', id: 'wa1' },
                { time: '18:00', id: 'wa2' },
                { time: '18:30', id: 'wa2' },
                { time: '19:00', id: 'wa3' },
                { time: '19:30', id: 'wa3' },
                { time: '20:00', id: 'wa3' }
            ]
        };

        const holidaySlots = {
            morning: [
                { time: '11:00', id: 'hm1' },
                { time: '11:30', id: 'hm1' },
                { time: '12:00', id: 'hm2' },
                { time: '12:30', id: 'hm2' },
                { time: '13:00', id: 'hm3' },
                { time: '13:30', id: 'hm3' },
                { time: '14:00', id: 'hm4' },
                { time: '14:30', id: 'hm4' }
            ],
            afternoon: [
                { time: '17:00', id: 'ha1' },
                { time: '17:30', id: 'ha1' },
                { time: '18:00', id: 'ha2' },
                { time: '18:30', id: 'ha2' },
                { time: '19:00', id: 'ha3' },
                { time: '19:30', id: 'ha3' },
                { time: '20:00', id: 'ha3' }
            ]
        };

        // 獲取預訂狀態
        const response = await fetch(`/api/time-slots?date=${dateString}`);
        const data = await response.json();

        // 準備 HTML 字符串
        let html = '';
        const slots = (dayOfWeek >= 1 && dayOfWeek <= 5) ? weekdaySlots : holidaySlots;
        const limits = data.settings;

        // 生成上午時段
        html += '<div class="time-section">';
        html += '<h3>上午</h3>';
        html += '<div class="time-buttons">';
        slots.morning.forEach(slot => {
            const count = data[slot.id] || 0;
            const limit = limits[slot.id.substring(0, 2)] || 0;
            const disabled = count >= limit ? 'disabled' : '';
            html += `<button type="button" class="time-button ${disabled}" 
                     data-slot-id="${slot.id}" data-time="${slot.time}" 
                     ${disabled ? 'disabled' : ''}>${slot.time}</button>`;
        });
        html += '</div></div>';

        // 生成下午時段
        html += '<div class="time-section">';
        html += '<h3>下午</h3>';
        html += '<div class="time-buttons">';
        slots.afternoon.forEach(slot => {
            const count = data[slot.id] || 0;
            const limit = limits[slot.id.substring(0, 2)] || 0;
            const disabled = count >= limit ? 'disabled' : '';
            html += `<button type="button" class="time-button ${disabled}" 
                     data-slot-id="${slot.id}" data-time="${slot.time}" 
                     ${disabled ? 'disabled' : ''}>${slot.time}</button>`;
        });
        html += '</div></div>';

        // 一次性更新 DOM
        timeContainer.html(html);

        // 綁定事件監聽器
        timeContainer.find('.time-button').not('.disabled').on('click', function() {
            timeContainer.find('.time-button').removeClass('selected');
            $(this).addClass('selected');
            
            const selectedTime = $(this).data('time');
            $('#time').val(selectedTime);
            $('#preview-time').text(selectedTime);
            
            $('.form-row, .pe-note').addClass('show');
        });

    } catch (error) {
        console.error('Error fetching time slots:', error);
        timeContainer.html('<div class="error">載入時段失敗，請重試</div>');
    }
}

function displayReservationInfo(results) {
    console.log('Received results:', results); // 用於調試
    
    const displayArea = document.getElementById('reservation-display');
    
    // 如果沒有資料
    if (!results || (Array.isArray(results) && results.length === 0)) {
        displayArea.innerHTML = `
            <div class="reservation-info">
                <h3>查詢結果</h3>
                <p>找不到訂位資料</p>
            </div>
        `;
        return;
    }

    // 確保 results 是陣列
    const reservations = Array.isArray(results) ? results : [results];
    
    // 生成所有訂位資料的 HTML
    const reservationsHTML = reservations.map(reservation => `
        <div class="reservation-info">
            <h3>訂位資訊</h3>
            <div class="reservation-details">
                <p>訂位人：${reservation.name}</p>
                <p>日期：${reservation.date}</p>
                <p>時間：${reservation.time}</p>
                <p>電話：${reservation.phone}</p>
                <p>Email：${reservation.email}</p>
                <p>人數：${reservation.adults}大${reservation.children}小</p>
                <p>訂位代碼：${reservation.bookingCode}</p>
            </div>
            <div class="button-group">
                <button onclick="confirmCancel('${reservation.bookingCode}')" class="confirm-btn">確認取消</button>
            </div>
        </div>
    `).join('');

    // 顯示所有訂位資料和返回按鈕
    displayArea.innerHTML = `
        <div class="reservations-container">
            ${reservationsHTML}
            <div class="button-group">
                <button onclick="cancelOperation()" class="cancel-btn">返回</button>
            </div>
        </div>
    `;
}

// 確認取消訂位
async function confirmCancel(bookingCode) {
    if (!confirm('確定要取消此訂位嗎？')) return;

    try {
        console.log('Attempting to cancel booking:', bookingCode); // 添加日誌

        const response = await fetch('/api/reservations/cancel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookingCode })
        });

        const data = await response.json(); // 獲取詳細的回應數據

        if (!response.ok) {
            throw new Error(data.error || '取消失敗');
        }

        console.log('Cancel response:', data); // 添加日誌
        alert(data.message || '訂位已成功取消');
        location.reload();
    } catch (error) {
        console.error('Cancel error details:', error); // 添加詳細錯誤日誌
        alert(error.message || '取消失敗，請稍後再試');
    }
}

// 確認取消選中的訂位
async function confirmCancelSelected() {
    const selected = document.querySelector('input[name="reservation"]:checked');
    if (!selected) {
        alert('請選擇要取消的訂位');
        return;
    }

    await confirmCancel(selected.value);
}

// 放棄取消操作
function cancelOperation() {
    document.getElementById('reservation-display').innerHTML = '';
    document.getElementById('cancelForm').reset();
}
