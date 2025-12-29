// Countdown Timer
function updateCountdown() {
    // Set to December 30, 2025 at 16:00:00 (4 PM) IST (UTC+05:30)
    const eventDate = new Date('2025-12-30T16:00:00+05:30').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        document.querySelector('.countdown-section h2').textContent = 'The Adventure Has Begun';
        return;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Update countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);

// Carousel Logic
const track = document.querySelector('.carousel-track');
let slides = Array.from(track.children);
const nextButton = document.querySelector('.next-btn');
const prevButton = document.querySelector('.prev-btn');
const dotsContainer = document.querySelector('.carousel-dots');

// Clone first and last slides for infinite loop effect
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.id = 'first-clone';
lastClone.id = 'last-clone';

track.append(firstClone);
track.prepend(lastClone);

// Re-query slides to include clones
const allSlides = document.querySelectorAll('.carousel-slide');

let currentSlideIndex = 1; // Start at 1 because 0 is lastClone
let isTransitioning = false;

// Create dots (based on original slides count)
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => moveToSlide(index + 1)); // +1 offset for clones
    dotsContainer.appendChild(dot);
});

const dots = Array.from(dotsContainer.children);

// Set initial position
track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

function updateDots(index) {
    dots.forEach(dot => dot.classList.remove('active'));
    // Adjust index for dots (0-based) from slide index (1-based with clones)
    let dotIndex = index - 1;
    if (dotIndex < 0) dotIndex = slides.length - 1;
    if (dotIndex >= slides.length) dotIndex = 0;
    
    if(dots[dotIndex]) dots[dotIndex].classList.add('active');
}

function moveToSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${index * 100}%)`;
    currentSlideIndex = index;
    
    updateDots(currentSlideIndex);
}

track.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (allSlides[currentSlideIndex].id === 'first-clone') {
        track.style.transition = 'none';
        currentSlideIndex = 1;
        track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }
    if (allSlides[currentSlideIndex].id === 'last-clone') {
        track.style.transition = 'none';
        currentSlideIndex = allSlides.length - 2;
        track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }
});

nextButton.addEventListener('click', () => {
    if (currentSlideIndex >= allSlides.length - 1) return;
    moveToSlide(currentSlideIndex + 1);
});

prevButton.addEventListener('click', () => {
    if (currentSlideIndex <= 0) return;
    moveToSlide(currentSlideIndex - 1);
});

// Auto advance slides
setInterval(() => {
    if (!isTransitioning) {
        moveToSlide(currentSlideIndex + 1);
    }
}, 5000);
