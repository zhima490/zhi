// 輪播圖片功能
const images = [
    '/images/index_photo/br1.webp',
    '/images/index_photo/br2.webp',
    '/images/index_photo/br3.webp',
    '/images/index_photo/br4.webp'
];

let currentIndex = 0;
const slideshowImage = document.getElementById('slideshow-image');

function changeImage() {
    slideshowImage.style.opacity = '0';
    
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % images.length;
        slideshowImage.src = images[currentIndex];
        slideshowImage.style.opacity = '1';
    }, 500);
}

setInterval(changeImage, 10000);
