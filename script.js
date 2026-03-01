// OpenCope - Scripts
// Minimal interactivity for the cope experience

document.addEventListener('DOMContentLoaded', () => {
  console.log('OpenCope loaded. The cope is real. But so is everything else.');
  
  // Add staggered animation to cope cards
  const cards = document.querySelectorAll('.cope-card, .news-item, .reason-card');
  
  // Only animate if user hasn't requested reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      // Intersection Observer for scroll-based animation
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, index % 4 * 100); // Stagger within viewport groups
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      observer.observe(card);
    });
  }
  
  // Track time on page (for potential future analytics)
  let startTime = Date.now();
  
  // Log when user reaches the end (engagement metric)
  const footer = document.querySelector('footer');
  if (footer) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const timeSpent = Math.round((Date.now() - startTime) / 1000);
          console.log(`Reader reached the end in ${timeSpent} seconds. The window is open.`);
          footerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    footerObserver.observe(footer);
  }
  
  // Easter egg: Konami code reveals a message
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        console.log('🎮 Achievement unlocked: Still looking for cheat codes in 2026');
        alert('The only cheat code is accepting reality and acting on it.');
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
});
