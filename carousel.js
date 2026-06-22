// Mobile Carousel for "WHAT IT ACTUALLY LOOKS LIKE"
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.looks-like-track');
  if (!track) return;

  let isMobile = window.innerWidth <= 768;
  let initialized = false;
  let animationId = null;
  
  let currentX = 0;
  let speed = 1.5; // Pixels per frame (adjust for speed)
  let isDragging = false;
  let startX = 0;
  let prevX = 0;
  let velocity = 0;
  
  let trackWidth = 0;
  let originalCards = Array.from(track.children);
  
  function initCarousel() {
    if (initialized) return;
    initialized = true;
    
    // Clone cards for infinite loop
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.classList.add('clone');
      track.appendChild(clone);
    });
    
    // Calculate width of one set of cards
    setTimeout(() => {
      recalculateWidth();
      startAnimation();
    }, 100);
    
    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchmove', handleTouchMove, { passive: true });
    track.addEventListener('touchend', handleTouchEnd);
  }
  
  function recalculateWidth() {
    if (!initialized) return;
    // The width is exactly half of the total scrollWidth
    trackWidth = track.scrollWidth / 2;
  }
  
  function destroyCarousel() {
    if (!initialized) return;
    initialized = false;
    
    cancelAnimationFrame(animationId);
    
    // Remove clones
    const clones = track.querySelectorAll('.clone');
    clones.forEach(clone => clone.remove());
    
    // Reset transform
    track.style.transform = '';
    currentX = 0;
    
    track.removeEventListener('touchstart', handleTouchStart);
    track.removeEventListener('touchmove', handleTouchMove);
    track.removeEventListener('touchend', handleTouchEnd);
  }
  
  function update() {
    if (!isDragging) {
      if (Math.abs(velocity) > 0.1) {
        currentX += velocity;
        velocity *= 0.95; // Friction
      } else {
        currentX -= speed; // Auto scroll left
      }
    }
    
    // Seamless infinite loop logic
    if (currentX <= -trackWidth) {
      currentX += trackWidth;
    } else if (currentX > 0) {
      currentX -= trackWidth;
    }
    
    track.style.transform = `translate3d(${currentX}px, 0, 0)`;
    animationId = requestAnimationFrame(update);
  }
  
  function startAnimation() {
    cancelAnimationFrame(animationId);
    update();
  }
  
  function handleTouchStart(e) {
    isDragging = true;
    startX = e.touches[0].clientX;
    prevX = startX;
    velocity = 0;
  }
  
  function handleTouchMove(e) {
    if (!isDragging) return;
    const currentTouchX = e.touches[0].clientX;
    const deltaX = currentTouchX - prevX;
    
    currentX += deltaX;
    velocity = deltaX; // Keep track of velocity for momentum
    prevX = currentTouchX;
  }
  
  function handleTouchEnd() {
    isDragging = false;
  }
  
  // Handle resize
  window.addEventListener('resize', () => {
    const mobileNow = window.innerWidth <= 768;
    if (mobileNow && !isMobile) {
      isMobile = true;
      initCarousel();
    } else if (!mobileNow && isMobile) {
      isMobile = false;
      destroyCarousel();
    } else if (mobileNow && isMobile) {
      recalculateWidth();
    }
  });
  
  // Initial check
  if (isMobile) {
    initCarousel();
  }
  
  // Recalculate width on load to ensure images don't mess it up
  window.addEventListener('load', () => {
    if (isMobile) recalculateWidth();
  });
});
