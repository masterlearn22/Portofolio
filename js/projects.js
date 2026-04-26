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

// === 3D Tech Orbit Engine (High Performance) ===
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
    const rx = 100 + (index * 12) + (Math.random() * 20);
    const ry = rx * (0.3 + Math.random() * 0.4);
    const tilt = Math.random() * Math.PI * 2;
    const speed = (0.003 + Math.random() * 0.004) * (index % 2 === 0 ? 1 : -1);
    const angle = Math.random() * Math.PI * 2;

    const sat = document.createElement('div');
    sat.className = 'satellite';
    sat.innerHTML = iconHTML;
    orbitSystem.appendChild(sat);

    const data = {
      el: sat,
      rx, ry,
      cosTilt: Math.cos(tilt),
      sinTilt: Math.sin(tilt),
      speed, angle,
      isHovered: false,
      currentScale: 1,
      targetScale: 1
    };

    sat.addEventListener('mouseenter', () => data.targetScale = 1.4);
    sat.addEventListener('mouseleave', () => data.targetScale = 1);
    
    satellitesData.push(data);
  });

  const ringConfigs = [
    { rx: 120, ry: 60, tilt: 0.5 },
    { rx: 200, ry: 90, tilt: 2.1 },
    { rx: 270, ry: 120, tilt: 4.2 }
  ];
  ringConfigs.forEach(cfg => {
    const ring = document.createElement('div');
    ring.className = 'orbit-ring';
    ring.style.width = `${cfg.rx * 2}px`;
    ring.style.height = `${cfg.ry * 2}px`;
    ring.style.transform = `translate(-50%, -50%) rotate(${cfg.tilt}rad)`;
    orbitSystem.appendChild(ring);
  });

  let orbitRunning = false;
  let orbitRAF = null;

  function animateOrbits() {
    for (let i = 0; i < satellitesData.length; i++) {
      const d = satellitesData[i];
      d.angle += d.speed;

      // Smooth scale interpolation for hover
      d.currentScale += (d.targetScale - d.currentScale) * 0.15;

      const cosA = Math.cos(d.angle);
      const sinA = Math.sin(d.angle);
      const x = d.rx * cosA;
      const y = d.ry * sinA;
      const rotatedX = x * d.cosTilt - y * d.sinTilt;
      const rotatedY = x * d.sinTilt + y * d.cosTilt;

      const z = d.rx * sinA;
      const baseScale = (z + 500) / 500;
      const finalScale = baseScale * d.currentScale;

      // Use translate3d for GPU acceleration and batch updates
      d.el.style.transform = `translate3d(${rotatedX}px, ${rotatedY}px, 0) scale(${finalScale})`;
      d.el.style.zIndex = Math.round(z + 1000);
      d.el.style.opacity = Math.min(1, Math.max(0.4, (z + 200) / 200));
    }
    if (orbitRunning) {
      orbitRAF = requestAnimationFrame(animateOrbits);
    }
  }

  const orbitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!orbitRunning) {
          orbitRunning = true;
          orbitRAF = requestAnimationFrame(animateOrbits);
        }
      } else {
        orbitRunning = false;
        if (orbitRAF) {
          cancelAnimationFrame(orbitRAF);
          orbitRAF = null;
        }
      }
    });
  }, { threshold: 0.1 });

  orbitObserver.observe(orbitSystem);
}
