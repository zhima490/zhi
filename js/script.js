document.addEventListener('DOMContentLoaded', function () {
    const closeButton = document.getElementById('close-btn');
    const announcementBox = document.getElementById('announcement');

    document.body.style.overflow = 'hidden';

    closeButton.addEventListener('click', function () {
        announcementBox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    closeButton.addEventListener('click', function () {
        announcementBox.style.display = 'none';
    });
});
