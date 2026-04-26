// === Infinite Carousel ===
const projectsTrack = document.getElementById('projectsTrack');

if (projectsTrack) {
  // Clone the project cards to create a seamless infinite scrolling effect
  const projectCards = Array.from(projectsTrack.children);
  
  // Clone the entire set of cards to double the length
  projectCards.forEach(card => {
    const clone = card.cloneNode(true);
    // Remove reveal class from clones to avoid re-triggering animations
    clone.classList.remove('reveal');
    projectsTrack.appendChild(clone);
  });
}
