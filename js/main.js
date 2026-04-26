document.addEventListener('DOMContentLoaded', () => {

  // === Fullscreen Menu Toggle ===
  const menuToggle = document.querySelector('.menu-toggle');
  const body = document.body;
  const menuLinks = document.querySelectorAll('.menu-link');

  function toggleMenu() {
    body.classList.toggle('menu-open');
  }

  menuToggle.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (body.classList.contains('menu-open')) {
        toggleMenu();
      }
    });
  });


  // === Side Navigation Active State ===
  const sections = document.querySelectorAll('.section');
  const navDots = document.querySelectorAll('.nav-dot');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // Section is active when 50% visible
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all dots
        navDots.forEach(dot => dot.classList.remove('active'));
        
        // Find corresponding dot and add active class
        const id = entry.target.getAttribute('id');
        const activeDot = document.querySelector(`.nav-dot[href="#${id}"]`);
        if (activeDot) {
          activeDot.classList.add('active');
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  // === Smooth Scroll for Links ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

});
