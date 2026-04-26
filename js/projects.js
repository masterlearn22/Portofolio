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

// === 3D Tech Orbit Engine ===
const orbitSystem = document.getElementById('techOrbitSystem');
if (orbitSystem) {
  const techIcons = [
    '<i class="devicon-laravel-plain colored"></i>',
    '<i class="devicon-go-original-wordmark colored"></i>',
    '<i class="devicon-javascript-plain colored"></i>',
    '<i class="devicon-python-plain colored"></i>',
    '<i class="devicon-go-original colored"></i><span class="sat-label">Fiber</span>',
    '<i class="devicon-go-original colored"></i><span class="sat-label">Gin</span>',
    '<i class="devicon-fastapi-plain colored"></i>',
    '<div class="text-sat"><span>REST</span></div>',
    '<div class="text-sat"><span>JWT</span></div>',
    '<i class="devicon-mysql-plain-wordmark colored"></i>',
    '<i class="devicon-postgresql-plain-wordmark colored"></i>',
    '<i class="devicon-mongodb-plain-wordmark colored"></i>',
    '<i class="devicon-supabase-plain colored"></i>',
    '<i class="devicon-html5-plain colored"></i>',
    '<i class="devicon-git-plain colored"></i>'
  ];

  const satellitesData = [];

  techIcons.forEach((iconHTML, index) => {
    // Generate random 3D orbit parameters
    // Spread radius between 100px and 280px
    const rx = 100 + (index * 12) + (Math.random() * 20); 
    const ry = rx * (0.3 + Math.random() * 0.4); // Elliptical squash for 3D perspective
    const tilt = Math.random() * Math.PI * 2; // Random 3D tilt of the orbit plane
    const speed = (0.003 + Math.random() * 0.004) * (index % 2 === 0 ? 1 : -1); // Random speed & direction
    const angle = Math.random() * Math.PI * 2; // Random start position

    // Create background ring
    const ring = document.createElement('div');
    ring.className = 'orbit-ring';
    ring.style.width = `${rx * 2}px`;
    ring.style.height = `${ry * 2}px`;
    // The CSS transform matches the 2D tilt of the JS calculation
    ring.style.transform = `translate(-50%, -50%) rotate(${tilt}rad)`;
    orbitSystem.appendChild(ring);

    // Create Satellite
    const sat = document.createElement('div');
    sat.className = 'satellite';
    sat.innerHTML = iconHTML;
    orbitSystem.appendChild(sat);

    satellitesData.push({ el: sat, rx, ry, tilt, speed, angle });
  });

  function animateOrbits() {
    satellitesData.forEach(data => {
      data.angle += data.speed;
      
      // Calculate 2D position on standard ellipse
      const x = data.rx * Math.cos(data.angle);
      const y = data.ry * Math.sin(data.angle);
      
      // Rotate coordinate by tilt angle
      const rotatedX = x * Math.cos(data.tilt) - y * Math.sin(data.tilt);
      const rotatedY = x * Math.sin(data.tilt) + y * Math.cos(data.tilt);
      
      // Depth (Z) estimation based on Y position before tilt
      const z = data.rx * Math.sin(data.angle); 
      const scale = (z + 500) / 500; // normalize scale (objects closer are larger)
      const opacity = Math.min(1, Math.max(0.4, (z + 200) / 200));
      
      // Apply transforms in 2D space -> Icon NEVER skews, always faces user!
      data.el.style.transform = `translate(-50%, -50%) translate(${rotatedX}px, ${rotatedY}px) scale(${scale})`;
      data.el.style.zIndex = Math.round(z + 1000);
      data.el.style.opacity = opacity;
    });
    requestAnimationFrame(animateOrbits);
  }
  
  animateOrbits();
}
