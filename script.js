window.addEventListener("load", () => {
  console.log("RePlay Cinematic script initialized");
  
  // Give the browser a moment to render the DOM and calculate heights
  setTimeout(initCinematic, 150);
});

function initCinematic() {
  try {
    // Initialize Lenis for buttery smooth trackpad & mouse scrolling within the explicit container
    const scrollWrapper = document.getElementById('main-wrapper');
    const scrollContent = document.getElementById('scroll-content');
    
    const lenis = new Lenis({
      wrapper: scrollWrapper,
      content: scrollContent,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // Set default scroller for all ScrollTriggers
    ScrollTrigger.defaults({ scroller: "#main-wrapper" });
    
    console.log("GSAP Plugins registered & Lenis activated on main-wrapper");

    // 1. Smooth Reveal animations for all text and content
    ScrollTrigger.batch(".gs-reveal", {
      start: "top 88%",
      onEnter: batch => gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: "expo.out",
        overwrite: true
      }),
      once: true
    });

    // 2. Background Environment Crossfades
    const sections = gsap.utils.toArray('.cinematic-section');
    sections.forEach(section => {
      const bgId = section.getAttribute('data-bg');
      if (bgId) {
        ScrollTrigger.create({
          trigger: section,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => switchBackground(bgId),
          onEnterBack: () => switchBackground(bgId)
        });
      }
    });

    function switchBackground(targetId) {
      const layers = document.querySelectorAll('.env-layer');
      layers.forEach(layer => {
        if (layer.id === targetId) {
          layer.classList.add('active');
        } else {
          layer.classList.remove('active');
        }
      });
    }

    // 3. GENERATE DYNAMIC SVG PATH
    // This solves all scaling and alignment issues by creating a 1:1 pixel coordinate path
    const scrollEl = document.getElementById("scroll-content");
    const h = scrollEl.offsetHeight || 5000;
    const w = window.innerWidth;
    
    const svg = document.getElementById("master-track-svg");
    // Set SVG to exact pixel dimensions and explicitly style the height
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.style.width = w + "px";
    svg.style.height = h + "px";
    svg.removeAttribute("preserveAspectRatio"); // We don't need this anymore
    
    // Create a smooth weaving path from top to bottom, starting from the RIGHT side
    let d = `M ${w * 0.85} 0 `;
    
    const segments = 8;
    const stepY = h / segments;
    
    for(let i=1; i<=segments; i++) {
      let curY = i * stepY;
      let prevY = (i - 1) * stepY;
      
      // Since we start on the right (0.85), segment 1 (odd) goes left (0.15), segment 2 (even) goes right (0.85).
      let targetX = (i % 2 === 1) ? w * 0.15 : w * 0.85;
      if (i === segments) targetX = w / 2; // final segment goes back to center
      
      // Control points for smooth S-curve
      // cp1X continues from the previous X position
      let cp1X = (i % 2 === 1) ? w * 0.85 : w * 0.15;
      
      d += `C ${cp1X} ${prevY + stepY*0.3}, ${targetX} ${curY - stepY*0.3}, ${targetX} ${curY} `;
    }
    
    const baseTrack = document.getElementById("master-track-base");
    const activeTrack = document.getElementById("master-track-active");
    const dashTrack = document.getElementById("master-track-dash");
    const maskPath = document.getElementById("master-track-mask-path");
    
    baseTrack.setAttribute("d", d);
    activeTrack.setAttribute("d", d);
    dashTrack.setAttribute("d", d);
    maskPath.setAttribute("d", d);

    // 4. Track Draw Animation
    const pathLength = maskPath.getTotalLength();
    maskPath.style.strokeDasharray = pathLength;
    maskPath.style.strokeDashoffset = pathLength;

    gsap.to(maskPath, {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: "#scroll-content",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      },
      ease: "none"
    });

    // Set initial crawler position
    const initPoint = baseTrack.getPointAtLength(0);
    gsap.set("#crawler-wrap", { x: initPoint.x, y: initPoint.y, rotation: 90 });

    // 5. Crawler Motion (Native SVG getPointAtLength for guaranteed movement)
    // Using ScrollTrigger.create instead of empty gsap.to to ensure continuous progress updates
    ScrollTrigger.create({
      trigger: "#scroll-content",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // self.progress is between 0 and 1
        const progress = self.progress;
        
        // Get the current point on the SVG path
        const currentLength = progress * pathLength;
        const point = baseTrack.getPointAtLength(currentLength);
        
        // Get a point slightly ahead to calculate rotation
        let nextLength = currentLength + 2;
        if (nextLength > pathLength) nextLength = pathLength;
        const nextPoint = baseTrack.getPointAtLength(nextLength);
        
        // Calculate angle in degrees
        const dx = nextPoint.x - point.x;
        const dy = nextPoint.y - point.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        // Apply position and rotation to crawler wrap
        gsap.set("#crawler-wrap", {
          x: point.x,
          y: point.y,
          rotation: angle + 90 // +90 because the car image faces up by default
        });
      }
    });

    // 6. Venue Carousel
    const vTrack = document.getElementById('vTrack');
    if (vTrack) {
      const cards = Array.from(vTrack.children);
      const N = cards.length;
      
      const state = { progress: 0 };
      let isHovered = false;
      let isDragging = false;
      let startX = 0;
      let dragStartProgress = 0;

      const stopAuto = () => { isHovered = true; };
      const startAuto = () => { 
        isHovered = false; 
        isDragging = false;
        // Snap to the closest card on release with smooth deceleration
        gsap.to(state, {
          progress: Math.round(state.progress),
          duration: 0.3,
          ease: "power2.out",
          overwrite: true
        });
      };

      // Auto-step one by one every 1.5 seconds using smooth easing
      setInterval(() => {
        if (!isHovered && !isDragging) {
          gsap.to(state, {
            progress: Math.round(state.progress) + 1,
            duration: 0.4,
            ease: "power2.inOut",
            overwrite: true
          });
        }
      }, 1500);

      vTrack.addEventListener('mouseenter', stopAuto);
      vTrack.addEventListener('mouseleave', startAuto);
      
      vTrack.addEventListener('mousedown', (e) => {
        isDragging = true;
        gsap.killTweensOf(state); // Stop any ongoing auto-animation
        startX = e.clientX;
        dragStartProgress = state.progress;
      });
      vTrack.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        state.progress = dragStartProgress - (dx / 100);
      });
      window.addEventListener('mouseup', () => { if (isDragging) startAuto(); });

      // Touch events
      vTrack.addEventListener('touchstart', (e) => {
        stopAuto();
        isDragging = true;
        gsap.killTweensOf(state);
        startX = e.touches[0].clientX;
        dragStartProgress = state.progress;
      }, {passive: true});
      
      vTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - startX;
        state.progress = dragStartProgress - (dx / 100);
      }, {passive: true});

      window.addEventListener('touchend', () => { if (isDragging) startAuto(); });

      function animateCarousel() {
        let currentProgress = state.progress;

        cards.forEach((card, i) => {
          // delta is the distance from the center card in index units
          let delta = ((i - currentProgress) % N + N + N/2) % N - N/2;
          
          card.hoverState = card.hoverState || 0;
          if (card.matches(':hover')) {
            card.hoverState += (1 - card.hoverState) * 0.15;
          } else {
            card.hoverState += (0 - card.hoverState) * 0.15;
          }

          const absDelta = Math.abs(delta);
          
          if (absDelta > 3.5) {
             card.style.opacity = 0;
             card.style.pointerEvents = 'none';
             return;
          }
          card.style.pointerEvents = 'auto';

          let baseScale = 1.2 - (absDelta * 0.35);
          if (baseScale < 0.6) baseScale = 0.6;
          const finalScale = baseScale + (card.hoverState * 0.05);
          
          // Gap between cards in 3D space. Dynamic for mobile so they don't spread off-screen.
          const gapSize = window.innerWidth < 768 ? 160 : 240;
          const xOffset = delta * gapSize; 
          
          const zOffset = 200 - (absDelta * 150);
          
          // Fade out faster so the card is invisible when it teleports to the other side
          let opacity = Math.max(0, 1 - (absDelta * 0.45));
          if (absDelta > 2.2) opacity = 0;
          
          const blur = absDelta * 3; 
          const brightness = 1 - (absDelta * 0.2);
          
          const zIndex = Math.round(100 - absDelta * 10) + Math.round(card.hoverState * 50);
          
          card.style.transform = `translate(-50%, -50%) translateX(${xOffset}px) translateZ(${zOffset}px) scale(${finalScale})`;
          card.style.opacity = opacity;
          card.style.filter = `blur(${blur}px) brightness(${brightness})`;
          card.style.zIndex = zIndex;
          
          if (absDelta < 0.5) {
            card.classList.add('active');
            if (card.hoverState > 0.1) {
              card.classList.add('hover-glow');
            } else {
              card.classList.remove('hover-glow');
            }
          } else {
            card.classList.remove('active');
            card.classList.remove('hover-glow');
          }
        });

        requestAnimationFrame(animateCarousel);
      }
      
      // Start the animation loop immediately to set initial positions and avoid jump glitch
      animateCarousel();
    }

    console.log("Crawler animation setup complete. Path Length:", pathLength);

  } catch (error) {
    console.error("GSAP Initialization Error:", error);
  }
}

// ════════ R-TRACK HERO CARD ANIMATION ════════
function initRTrackCard() {
  const bgLayers = document.querySelectorAll('.rtc-bg-layer');
  const dynamicText = document.getElementById('rtc-dynamic-text');
  
  if (!bgLayers.length || !dynamicText) return;
  
  let currentIndex = 0;
  const intervalTime = 3000; // 3 seconds per slide

  setInterval(() => {
    // Remove active from current
    bgLayers[currentIndex].classList.remove('active');
    
    // Move to next
    currentIndex = (currentIndex + 1) % bgLayers.length;
    const nextLayer = bgLayers[currentIndex];
    
    // Add active
    nextLayer.classList.add('active');
    
    // Update text
    dynamicText.textContent = nextLayer.getAttribute('data-label');
  }, intervalTime);
}

// Ensure it runs after DOM load
document.addEventListener("DOMContentLoaded", () => {
  initRTrackCard();
  initStepsHighlight();
  initFaqToggle();
});

// ════════ STEPS AUTO-HIGHLIGHT ════════
function initStepsHighlight() {
  const steps = document.querySelectorAll('.steps-list .step');
  if (!steps.length) return;
  
  let currentStep = 0;
  let interval;
  
  const startLoop = () => {
    interval = setInterval(() => {
      steps.forEach(s => s.classList.remove('active'));
      steps[currentStep].classList.add('active');
      currentStep = (currentStep + 1) % steps.length;
    }, 2500); // 2.5 seconds per step
  };
  
  const stopLoop = () => clearInterval(interval);
  
  // Pause on hover
  const stepsList = document.querySelector('.steps-list');
  if (stepsList) {
    stepsList.addEventListener('mouseenter', () => {
      stopLoop();
      steps.forEach(s => s.classList.remove('active')); // let CSS hover take over
    });
    stepsList.addEventListener('mouseleave', () => {
      // Re-highlight the current step before starting the loop so it doesn't wait 2.5s empty
      steps[currentStep].classList.add('active');
      startLoop();
    });
  }
  
  // Start initially
  steps[currentStep].classList.add('active');
  startLoop();
}

// ════════ FAQ TOGGLE ════════
function initFaqToggle() {
  const faqBtn = document.getElementById('faq-toggle-btn');
  const faqContainer = document.getElementById('faq-list-container');
  if (faqBtn && faqContainer) {
    faqBtn.addEventListener('click', () => {
      if (faqContainer.style.display === 'none') {
        faqContainer.style.display = 'block';
        faqBtn.textContent = 'Show Less';
      } else {
        faqContainer.style.display = 'none';
        faqBtn.textContent = 'Learn More';
      }
      // Refresh ScrollTrigger so layout heights are recalculated
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => ScrollTrigger.refresh(), 100);
      }
    });
  }
}
