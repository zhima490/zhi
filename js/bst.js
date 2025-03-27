document.addEventListener('DOMContentLoaded', function() {
    const viewReservationsLink = document.getElementById('view-reservations');
    const reservationsView = document.getElementById('reservations-view');
    const reservationDate = document.getElementById('reservation-date');
    const reservationsList = document.querySelector('.reservations-list');
    const modal = document.getElementById('details-modal');
    const closeModal = document.querySelector('.close');

    // 設置今天的日期為預設值
    const today = new Date().toISOString().split('T')[0];
    reservationDate.value = today;

    viewReservationsLink.addEventListener('click', function(e) {
        e.preventDefault();
        reservationsView.style.display = 'block';
        loadReservations(reservationDate.value);
    });

    reservationDate.addEventListener('change', function() {
        loadReservations(this.value);
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    function loadReservations(date) {
        fetch(`/api/bookings?date=${date}`)
            .then(response => response.json())
            .then(bookings => {
                reservationsList.innerHTML = '';
                bookings.forEach(booking => {
                    const card = createReservationCard(booking);
                    reservationsList.appendChild(card);
                });
            })
            .catch(error => console.error('Error loading reservations:', error));
    }

    function createReservationCard(booking) {
        const card = document.createElement('div');
        card.className = 'reservation-card';
        card.innerHTML = `
            <div class="reservation-header">
                <span class="guest-name">${booking.name} ${booking.gender}</span>
                <span class="guest-count">${booking.adults}大${booking.children}小</span>
                <span class="time-slot">${booking.time}</span>
            </div>
            <div class="contact-info">${booking.phone}</div>
            <div class="action-buttons">
                <button class="details-btn" onclick="showDetails('${booking._id}')">完整資訊</button>
                <button class="status-btn seated ${booking.seated ? '' : 'disabled'}" 
                        onclick="updateStatus('${booking._id}', 'seated')" 
                        ${booking.seated ? 'disabled' : ''}>
                    已入座
                </button>
                <button class="status-btn not-arrived ${booking.seated ? 'disabled' : ''}" 
                        onclick="updateStatus('${booking._id}', 'not-arrived')"
                        ${booking.seated ? 'disabled' : ''}>
                    未到
                </button>
            </div>
        `;
        return card;
    }

    window.showDetails = function(bookingId) {
        fetch(`/api/bookings/${bookingId}`)
            .then(response => response.json())
            .then(booking => {
                document.querySelector('.reservation-details').innerHTML = `
                    <p><strong>姓名：</strong> ${booking.name} ${booking.gender}</p>
                    <p><strong>電話：</strong> ${booking.phone}</p>
                    <p><strong>電子郵件：</strong> ${booking.email}</p>
                    <p><strong>日期：</strong> ${booking.date}</p>
                    <p><strong>時間：</strong> ${booking.time}</p>
                    <p><strong>人數：</strong> ${booking.adults}大${booking.children}小</p>
                    <p><strong>訂位代碼：</strong> ${booking.bookingCode}</p>
                    <p><strong>備註：</strong> ${booking.notes || '無'}</p>
                `;
                modal.style.display = 'block';
            })
            .catch(error => console.error('Error loading booking details:', error));
    };

    window.updateStatus = function(bookingId, status) {
        if (status === 'seated') {
            fetch(`/api/bookings/${bookingId}/seat`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    loadReservations(reservationDate.value);
                }
            })
            .catch(error => console.error('Error updating status:', error));
        }
    };
});

function logout() {
    fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/bslt';
        }
    })
    .catch(error => console.error('Logout error:', error));
}
