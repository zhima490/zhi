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

    const cancelMethodRadios = document.querySelectorAll('input[name="cancelMethod"]');
    const codeInput = document.getElementById('codeInput');
    const infoInput = document.getElementById('infoInput');
    const reservationDisplay = document.getElementById('reservation-display');

    function clearForm() {
        codeInput.querySelector('input').value = '';
        infoInput.querySelectorAll('input').forEach(input => {
            input.value = '';
        });
        reservationDisplay.innerHTML = '';
    }

    cancelMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            clearForm();
            
            if (this.value === 'code') {
                codeInput.style.display = 'block';
                infoInput.style.display = 'none';
                codeInput.querySelector('input').required = true;
                infoInput.querySelectorAll('input').forEach(input => {
                    input.required = false;
                });
            } else {
                codeInput.style.display = 'none';
                infoInput.style.display = 'block';
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
});

document.addEventListener('DOMContentLoaded', function () {
    const adultsSelect = document.getElementById('adults');
    const childrenSelect = document.getElementById('children');

    function updateChildrenOptions() {
        const maxAdults = parseInt(adultsSelect.value);
        const maxChildren = 6 - maxAdults;

        childrenSelect.innerHTML = '';

        for (let i = 0; i <= maxChildren; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}位小孩`;
            childrenSelect.appendChild(option);
        }

        if (parseInt(childrenSelect.value) > maxChildren) {
            childrenSelect.value = maxChildren;
        }

        document.getElementById('preview-children').textContent = `${childrenSelect.value}位小孩`;
    }

    for (let i = 1; i <= 6; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}位大人`;
        adultsSelect.appendChild(option);
    }

    updateChildrenOptions();

    adultsSelect.value = 1;
    document.getElementById('preview-adults').textContent = '1位大人';
    document.getElementById('preview-children').textContent = '0位小孩';

    adultsSelect.addEventListener('change', () => {
        document.getElementById('preview-adults').textContent = `${adultsSelect.value}位大人`;
        updateChildrenOptions();
    });

    childrenSelect.addEventListener('change', () => {
        document.getElementById('preview-children').textContent = `${childrenSelect.value}位小孩`;
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
    
    const timeContainer = $('#time-picker-container');
    timeContainer.html('<div class="loading">載入時段中...</div>').show();
    
    try {
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

        const response = await fetch(`/api/time-slots?date=${dateString}`);
        const data = await response.json();

        let html = '';
        const slots = (dayOfWeek >= 1 && dayOfWeek <= 5) ? weekdaySlots : holidaySlots;
        const limits = data.settings;

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        html += '<div class="time-section">';
        html += '<h3>上午</h3>';
        html += '<div class="time-buttons">';
        slots.morning.forEach(slot => {
            const [hour, minute] = slot.time.split(':').map(Number);
            const slotTime = hour * 60 + minute;
            const count = data[slot.id] || 0;
            const limit = limits[slot.id.substring(0, 2)] || 0;
            const disabled = count >= limit ; //|| (selectedDate.toDateString() === now.toDateString() && slotTime < currentTime);
            html += `<button type="button" class="time-button ${disabled ? 'disabled' : ''}" 
                     data-slot-id="${slot.id}" data-time="${slot.time}" 
                     ${disabled ? 'disabled' : ''}>${slot.time}</button>`;
        });
        html += '</div></div>';

        html += '<div class="time-section">';
        html += '<h3>下午</h3>';
        html += '<div class="time-buttons">';
        slots.afternoon.forEach(slot => {
            const [hour, minute] = slot.time.split(':').map(Number);
            const slotTime = hour * 60 + minute;
            const count = data[slot.id] || 0;
            const limit = limits[slot.id.substring(0, 2)] || 0;
            const disabled = count >= limit || (selectedDate.toDateString() === now.toDateString() && slotTime < currentTime);
            html += `<button type="button" class="time-button ${disabled ? 'disabled' : ''}" 
                     data-slot-id="${slot.id}" data-time="${slot.time}" 
                     ${disabled ? 'disabled' : ''}>${slot.time}</button>`;
        });
        html += '</div></div>';

        timeContainer.html(html);

        timeContainer.find('.time-button').not(':disabled').on('click', function() {
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
    const displayArea = document.getElementById('reservation-display');
    
    if (!results || (Array.isArray(results) && results.length === 0)) {
        displayArea.innerHTML = `
            <div class="reservation-info">
                <h3>查詢結果</h3>
                <p>找不到訂位資料</p>
            </div>
        `;
        return;
    }

    const reservations = Array.isArray(results) ? results : [results];

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
                <button class="confirm-btn" data-booking-code="${reservation.bookingCode}">確認取消</button>
            </div>
        </div>
    `).join('');

    displayArea.innerHTML = `
        <div class="reservations-container">
            ${reservationsHTML}
            <div class="button-group">
                <button class="cancel-btn">返回</button>
            </div>
        </div>
    `;

    displayArea.addEventListener('click', function(e) {
        if (e.target.classList.contains('cancel-btn')) {
            cancelOperation();
        }
        
        if (e.target.classList.contains('confirm-btn')) {
            const bookingCode = e.target.dataset.bookingCode;
            if (bookingCode) {
                confirmCancel(bookingCode);
            }
        }
    });
}

async function confirmCancel(bookingCode) {
    if (!confirm('確定要取消此訂位嗎？')) return;

    try {
        console.log('Attempting to cancel booking:', bookingCode); 

        const response = await fetch('/api/reservations/cancel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookingCode })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || '取消失敗');
        }

        console.log('Cancel response:', data); 
        alert(data.message || '訂位已成功取消');
        location.reload();
    } catch (error) {
        console.error('Cancel error:', error);
        alert(error.message || '取消失敗，請稍後再試');
    }
}

async function confirmCancelSelected() {
    const selected = document.querySelector('input[name="reservation"]:checked');
    if (!selected) {
        alert('請選擇要取消的訂位');
        return;
    }

    await confirmCancel(selected.value);
}

function cancelOperation() {
    document.getElementById('reservation-display').innerHTML = '';
    document.getElementById('cancelForm').reset();
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reservationForm');
  
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
  
        const formData = {
            name: form.name.value,
            phone: form.phone.value,
            email: form.email.value,
            gender: form.gender.value,
            date: form.date.value,
            time: form.time.value,
            adults: form.adults.value,
            children: form.children.value,
            vegetarian: form.vegetarian.value,
            specialNeeds: form.specialNeeds.value,
            notes: form.notes.value,
        };
  
        console.log('Submitting form data:', formData);
  
        try {
            const response = await fetch('/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                redirect: 'follow' 
            });
  
            if (response.redirected) {
                console.log('Reservation successful, waiting for redirect...');
                
                window.location.href = response.url;

                setTimeout(() => {
                    form.reset();
                
                document.getElementById('preview-adults').textContent = '1';
                document.getElementById('preview-children').textContent = '0';
                document.getElementById('preview-date').textContent = '尚未選擇';
                document.getElementById('preview-time').textContent = '尚未選擇';
                document.getElementById('preview-vegetarian').textContent = '否';
                document.getElementById('preview-special').textContent = '無';
                document.getElementById('preview-phone').textContent = '尚未填寫';
                document.getElementById('preview-email').textContent = '尚未填寫';
                document.getElementById('preview-notes').textContent = '無';
                
                currentMonth = new Date().getMonth();
                currentYear = new Date().getFullYear();
                generateCalendar(currentMonth, currentYear);
                
                const days = document.querySelectorAll('#days-container .day');
                days.forEach(day => day.classList.remove('selected'));
                
                document.querySelectorAll('.time-button').forEach(btn => 
                    btn.classList.remove('selected')
                );
                
                document.getElementById('time-picker-container').style.display = 'none';
                document.querySelectorAll('.form-row').forEach(row => {
                    row.classList.remove('show');
                });
                
                document.getElementById('adults').value = '1';
                document.getElementById('children').value = '0';
                document.getElementById('vegetarian').value = '否';
                document.getElementById('specialNeeds').value = '無';
                }, 100);
                

                return;

            } else {
                throw new Error(data.message || '預訂失敗，請稍後再試');
            }
        } catch (error) {
            console.error('Reservation error details:', error);
            alert(error.message);
        }
    });
});
