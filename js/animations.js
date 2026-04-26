document.addEventListener('DOMContentLoaded', () => {

  // === Custom Cursor ===
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  
  if (cursorDot && cursorRing) {
    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;

    // Detect if device supports touch to hide cursor
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      // Animation loop for smooth cursor follow
      const animateCursor = () => {
        // Dot follows instantly
        dotX += (mouseX - dotX) * 1;
        dotY += (mouseY - dotY) * 1;
        
        // Ring follows with delay (easing)
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        cursorDot.style.transform = `translate(calc(${dotX}px - 50%), calc(${dotY}px - 50%))`;
        cursorRing.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;

        requestAnimationFrame(animateCursor);
      };
      
      requestAnimationFrame(animateCursor);

      // Add hover effects to interactive elements
      const interactives = document.querySelectorAll('a, button, .nav-dot, .project-card');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorRing.classList.add('hover');
          cursorDot.style.opacity = '0';
        });
        el.addEventListener('mouseleave', () => {
          cursorRing.classList.remove('hover');
          cursorDot.style.opacity = '1';
        });
      });
    } else {
      cursorDot.style.display = 'none';
      cursorRing.style.display = 'none';
      document.body.style.cursor = 'auto';
    }
  }

  // === Scroll Reveal (IntersectionObserver) ===
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after revealing if you only want it to animate once
        // revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // === Typing Effect ===
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const roles = ['Backend Engineer', 'Laravel Specialist', 'Golang Enthusiast'];
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    function typeEffect() {
      const current = roles[roleIndex];
      if (!isDeleting) {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(typeEffect, 1800);
          return;
        }
        setTimeout(typeEffect, 80);
      } else {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(typeEffect, 400);
          return;
        }
        setTimeout(typeEffect, 40);
      }
    }
    typeEffect();
  }

  // === Counter Animation ===
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.getAttribute('data-count');
        const isFloat = target.includes('.');
        const end = parseFloat(target);
        const duration = 1500;
        const start = performance.now();

        function animate(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * end;
          el.textContent = isFloat ? current.toFixed(2) : Math.floor(current) + (target.includes('+') ? '+' : '');
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

});
