// === Infinite Carousel ===
const projectsCarousel = document.querySelector('.projects-carousel');
const projectsTrack = document.getElementById('projectsTrack');

if (projectsCarousel && projectsTrack) {
  const originalCards = Array.from(projectsTrack.children);
  
  // Clone cards twice for safe infinite scrolling
  for (let i = 0; i < 2; i++) {
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      projectsTrack.appendChild(clone);
    });
  }

  let isPaused = false;
  let isDragging = false;
  let startX;
  let scrollLeft;
  let resetPosition = 0;

  // Calculate the exact pixel width of one original set of cards
  const calculateResetPosition = () => {
    // The offsetLeft of the first clone is exactly the width of the original set + gap
    const firstClone = originalCards[originalCards.length - 1].nextElementSibling;
    if (firstClone) {
      resetPosition = firstClone.offsetLeft - originalCards[0].offsetLeft;
    }
  };

  // Wait briefly for layout, then calculate
  setTimeout(calculateResetPosition, 500);
  window.addEventListener('resize', calculateResetPosition);

  const autoScroll = () => {
    if (!isPaused && !isDragging && resetPosition > 0) {
      projectsCarousel.scrollLeft += 1; // Auto-scroll speed
      
      // Loop forward
      if (projectsCarousel.scrollLeft >= resetPosition) {
        projectsCarousel.scrollLeft -= resetPosition;
      }
    }
    requestAnimationFrame(autoScroll);
  };

  requestAnimationFrame(autoScroll);

  // Hover to pause
  projectsCarousel.addEventListener('mouseenter', () => isPaused = true);
  projectsCarousel.addEventListener('mouseleave', () => isPaused = false);

  // Drag to scroll
  projectsCarousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - projectsCarousel.offsetLeft;
    scrollLeft = projectsCarousel.scrollLeft;
    projectsCarousel.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      projectsCarousel.style.cursor = 'grab';
    }
  });

  projectsCarousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - projectsCarousel.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    
    let newScrollLeft = scrollLeft - walk;
    
    // Infinite drag handling
    if (newScrollLeft >= resetPosition) {
      newScrollLeft -= resetPosition;
      scrollLeft -= resetPosition; // adjust start reference
    } else if (newScrollLeft <= 0) {
      newScrollLeft += resetPosition;
      scrollLeft += resetPosition; // adjust start reference
    }
    
    projectsCarousel.scrollLeft = newScrollLeft;
  });
}


