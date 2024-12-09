window.addEventListener('scroll', function() {
    const p1 = document.querySelector('.p1');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 150) {
        const blurValue = Math.min((scrollPosition - 150) / 100, 10);
        p1.style.filter = `blur(${2}px)`;
    } else {
        p1.style.filter = 'blur(0px)';
    }
});

let currentImageIndex = 0;
const images = [
    '/web2/images/sesame.png',
    '/web2/images/br.png'
];

const rotatingImage = document.getElementById('rotating-image');

function changeImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    rotatingImage.style.opacity = 0; 

    setTimeout(() => {
        rotatingImage.src = images[currentImageIndex]; 
        rotatingImage.style.opacity = 1;
    }, 500); 
}

setInterval(changeImage, 5000);

let touchStartX = 0;

rotatingImage.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
});

rotatingImage.addEventListener('touchend', function(event) {
    const touchEndX = event.changedTouches[0].clientX; 
    if (touchEndX < touchStartX) {
        changeImage();
    } else if (touchEndX > touchStartX) {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        rotatingImage.style.opacity = 0;

        setTimeout(() => {
            rotatingImage.src = images[currentImageIndex]; 
            rotatingImage.style.opacity = 1; 
        }, 500);
    }
});

document.getElementById('prev-button').addEventListener('click', function() {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
    rotatingImage.src = images[currentIndex];
});

document.getElementById('next-button').addEventListener('click', function() {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    rotatingImage.src = images[currentIndex];
});

function openInNewTab(url) {
    window.open(url, '_blank');
}
