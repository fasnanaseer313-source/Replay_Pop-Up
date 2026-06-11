window.addEventListener("load", () => {
  console.log("RePlay Cinematic script initialized");
  
  // 1. Initial Intro Animation
  const introOverlay = document.getElementById("intro-overlay");
  const mainWrapper = document.getElementById("main-wrapper");
  const btnExplore = document.getElementById("btn-explore");

  if (introOverlay && mainWrapper && btnExplore) {
    // Fade in intro text
    gsap.to(".gs-intro-reveal", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.2
    });

    // Handle CTA Click
    btnExplore.addEventListener("click", () => {
      // Create transition timeline
      const tl = gsap.timeline({
        onComplete: () => {
          introOverlay.style.display = "none";
          // Reveal main wrapper and enable interactions
          gsap.set(mainWrapper, { clearProps: "pointerEvents,height,overflow" });
          gsap.to(mainWrapper, { opacity: 1, duration: 0.8, ease: "power2.inOut" });
          
          // Now that main wrapper is visible and height is auto, initialize the cinematic experience
          setTimeout(initCinematic, 50);
        }
      });

      // Fade out intro elements
      tl.to(".gs-intro-reveal", { opacity: 0, y: -20, duration: 0.6, stagger: 0.1, ease: "power2.in" })
        .to(introOverlay, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "-=0.2");
    });
  } else {
    // Fallback if intro elements are missing
    setTimeout(initCinematic, 150);
  }
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
    
    // Initialize pinned process section
    initStepsHighlight();
    
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
    gsap.set("#crawler-wrap", { 
      x: initPoint.x, 
      y: initPoint.y, 
      xPercent: -50, 
      yPercent: -50, 
      rotation: 90,
      transformOrigin: "center center"
    });

    // 5. Crawler Motion (Native SVG getPointAtLength for guaranteed movement)
    ScrollTrigger.create({
      trigger: "#scroll-content",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Get the current point on the SVG path
        const currentLength = progress * pathLength;
        const point = baseTrack.getPointAtLength(currentLength);
        
        // Get a point slightly ahead to calculate rotation
        let nextLength = currentLength + 5; // Look ahead 5 pixels for stable orientation
        if (nextLength > pathLength) nextLength = pathLength;
        const nextPoint = baseTrack.getPointAtLength(nextLength);
        
        // Calculate angle in degrees
        const dx = nextPoint.x - point.x;
        const dy = nextPoint.y - point.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        // Apply strict centering, position, and rotation
        gsap.set("#crawler-wrap", {
          x: point.x,
          y: point.y,
          xPercent: -50,
          yPercent: -50,
          rotation: angle + 90 // Face forward correctly
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
  initFaqToggle();
});

// ════════ PINNED SCROLL 5-STEP PROCESS ════════
function initStepsHighlight() {
  const processWrap = document.querySelector('.process-pin-wrap');
  const cards = gsap.utils.toArray('.process-card');
  const progressFill = document.querySelector('.process-progress-fill');
  
  if (!processWrap || cards.length === 0) return;

  ScrollTrigger.create({
    trigger: processWrap,
    scroller: "#main-wrapper",
    start: "top top",
    end: "+=250%", // Pin for 2.5x viewport height to scrub through 5 cards
    pin: true,
    pinType: "transform",
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const numCards = cards.length;
      
      // Update progress bar line
      if (progressFill) {
        gsap.set(progressFill, { height: `${progress * 100}%` });
      }

      // Determine which card is active based on progress (0 to 1)
      const step = 1 / numCards;
      
      cards.forEach((card, index) => {
        const cardStart = index * step;
        const cardEnd = (index + 1) * step;
        
        if (progress >= cardStart && progress < cardEnd) {
          card.classList.add('active');
          card.classList.remove('passed');
        } else if (progress >= cardEnd) {
          card.classList.remove('active');
          card.classList.add('passed');
        } else {
          card.classList.remove('active');
          card.classList.remove('passed');
        }
      });
      
      // Ensure the last card stays active at the very end
      if (progress === 1) {
        cards.forEach(c => { c.classList.remove('active'); c.classList.add('passed'); });
        cards[cards.length - 1].classList.remove('passed');
        cards[cards.length - 1].classList.add('active');
      }
    }
  });
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
