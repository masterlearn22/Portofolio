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

// === UI/UX Infinite Carousel (Reverse Direction) ===
const uiuxCarousel = document.querySelector('.projects-carousel--reverse');
const uiuxTrack = document.getElementById('uiuxProjectsTrack');

if (uiuxCarousel && uiuxTrack) {
  const originalCards = Array.from(uiuxTrack.children);
  
  // Clone cards twice for safe infinite scrolling
  for (let i = 0; i < 2; i++) {
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      uiuxTrack.appendChild(clone);
    });
  }

  let isPaused = false;
  let isDragging = false;
  let startX;
  let scrollLeft;
  let resetPosition = 0;

  const calculateResetPosition = () => {
    const firstClone = originalCards[originalCards.length - 1].nextElementSibling;
    if (firstClone) {
      resetPosition = firstClone.offsetLeft - originalCards[0].offsetLeft;
    }
  };

  setTimeout(() => {
    calculateResetPosition();
    // Start scrolled to the middle (one set in) so we can scroll left immediately
    uiuxCarousel.scrollLeft = resetPosition;
  }, 500);
  window.addEventListener('resize', calculateResetPosition);

  const autoScroll = () => {
    if (!isPaused && !isDragging && resetPosition > 0) {
      uiuxCarousel.scrollLeft -= 1; // Reverse auto-scroll (scrolls LEFT)
      
      // Loop backward
      if (uiuxCarousel.scrollLeft <= 0) {
        uiuxCarousel.scrollLeft += resetPosition;
      }
      // Loop forward (if user drags right)
      if (uiuxCarousel.scrollLeft >= resetPosition * 2) {
        uiuxCarousel.scrollLeft -= resetPosition;
      }
    }
    requestAnimationFrame(autoScroll);
  };

  requestAnimationFrame(autoScroll);

  uiuxCarousel.addEventListener('mouseenter', () => isPaused = true);
  uiuxCarousel.addEventListener('mouseleave', () => isPaused = false);

  uiuxCarousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - uiuxCarousel.offsetLeft;
    scrollLeft = uiuxCarousel.scrollLeft;
    uiuxCarousel.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      uiuxCarousel.style.cursor = 'grab';
    }
  });

  uiuxCarousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - uiuxCarousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    
    let newScrollLeft = scrollLeft - walk;
    
    if (newScrollLeft >= resetPosition * 2) {
      newScrollLeft -= resetPosition;
      scrollLeft -= resetPosition;
    } else if (newScrollLeft <= 0) {
      newScrollLeft += resetPosition;
      scrollLeft += resetPosition;
    }
    
    uiuxCarousel.scrollLeft = newScrollLeft;
  });
}

// === Sprint Track Engine (Draggable + Auto-Scroll) ===
const sprintLanes = document.querySelectorAll('.sprint-lane');
sprintLanes.forEach((lane) => {
  let isDown = false;
  let startX;
  let scrollLeft;
  let isHovered = false;
  const isReverse = lane.classList.contains('lane-reverse');
  const speed = isReverse ? -1.5 : 1.5;

  const contentBlocks = lane.querySelectorAll('.sprint-track-content');
  if (contentBlocks.length < 2) return;
  
  const contentBlock1 = contentBlocks[0];
  const contentBlock2 = contentBlocks[1];

  // Dynamically clone icons until the block is wider than the screen
  // This guarantees infinite scrolling works perfectly on any screen size
  const originalIcons = Array.from(contentBlock1.children);
  while (contentBlock1.offsetWidth < window.innerWidth * 1.5) {
    originalIcons.forEach(icon => {
      contentBlock1.appendChild(icon.cloneNode(true));
      contentBlock2.appendChild(icon.cloneNode(true));
    });
  }
  
  let contentWidth = contentBlock1.offsetWidth;

  if (isReverse) {
    lane.scrollLeft = contentWidth;
  }

  lane.addEventListener('mousedown', (e) => {
    isDown = true;
    lane.style.cursor = 'grabbing';
    startX = e.pageX - lane.offsetLeft;
    scrollLeft = lane.scrollLeft;
  });
  
  lane.addEventListener('mouseleave', () => {
    isDown = false;
    isHovered = false;
    lane.style.cursor = 'grab';
  });
  
  lane.addEventListener('mouseup', () => {
    isDown = false;
    lane.style.cursor = 'grab';
  });
  
  lane.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - lane.offsetLeft;
    const walk = (x - startX) * 1.5; 
    let newScrollLeft = scrollLeft - walk;

    if (!isReverse) {
        if (newScrollLeft >= contentWidth) {
            newScrollLeft -= contentWidth;
            scrollLeft -= contentWidth;
        } else if (newScrollLeft <= 0) {
            newScrollLeft += contentWidth;
            scrollLeft += contentWidth;
        }
    } else {
        if (newScrollLeft <= 0) {
            newScrollLeft += contentWidth;
            scrollLeft += contentWidth;
        } else if (newScrollLeft >= contentWidth) {
            newScrollLeft -= contentWidth;
            scrollLeft -= contentWidth;
        }
    }

    lane.scrollLeft = newScrollLeft;
  });

  lane.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  const autoScrollLane = () => {
    contentWidth = contentBlock1.offsetWidth;
    if (!isDown && !isHovered && contentWidth > 0) {
      lane.scrollLeft += speed;
      if (!isReverse) {
        if (lane.scrollLeft >= contentWidth) {
          lane.scrollLeft -= contentWidth;
        } else if (lane.scrollLeft <= 0) {
          lane.scrollLeft += contentWidth;
        }
      } else {
        if (lane.scrollLeft <= 0) {
          lane.scrollLeft += contentWidth;
        } else if (lane.scrollLeft >= contentWidth) {
          lane.scrollLeft -= contentWidth;
        }
      }
    }
    requestAnimationFrame(autoScrollLane);
  };
  requestAnimationFrame(autoScrollLane);
});
