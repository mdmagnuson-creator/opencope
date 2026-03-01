// OpenCope - Scripts
// Minimal interactivity for the cope experience

document.addEventListener('DOMContentLoaded', () => {
  console.log('OpenCope loaded. The cope is real. But so is everything else.');
  
  // News Carousel (mobile only)
  const carousel = document.querySelector('.news-carousel');
  const columns = document.querySelectorAll('.news-column');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentIndex = 0;
  let autoRotateInterval;
  
  function showColumn(index) {
    columns.forEach((col, i) => {
      col.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }
  
  function nextColumn() {
    const next = (currentIndex + 1) % columns.length;
    showColumn(next);
  }
  
  function startAutoRotate() {
    // Only auto-rotate on mobile
    if (window.innerWidth <= 768) {
      autoRotateInterval = setInterval(nextColumn, 4000);
    }
  }
  
  function stopAutoRotate() {
    clearInterval(autoRotateInterval);
  }
  
  // Initialize carousel
  if (columns.length > 0) {
    // Set first column as active on mobile
    if (window.innerWidth <= 768) {
      showColumn(0);
      startAutoRotate();
    }
    
    // Dot click handlers
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopAutoRotate();
        showColumn(index);
        startAutoRotate();
      });
    });
    
    // Pause on hover/touch
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoRotate);
      carousel.addEventListener('mouseleave', startAutoRotate);
      carousel.addEventListener('touchstart', stopAutoRotate, { passive: true });
      carousel.addEventListener('touchend', () => {
        setTimeout(startAutoRotate, 2000);
      }, { passive: true });
    }
    
    // Handle resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        stopAutoRotate();
        columns.forEach(col => col.classList.remove('active'));
      } else {
        showColumn(currentIndex);
        startAutoRotate();
      }
    });
  }
  
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
