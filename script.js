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
          gsap.set(mainWrapper, { clearProps: "pointerEvents" });
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
    const isMobile = window.innerWidth <= 768;
    const scrollWrapper = document.getElementById('main-wrapper');
    const scrollContent = document.getElementById('scroll-content');
    
    // CRITICAL FIX: Make main-wrapper natively scrollable so ScrollTrigger can read its scrollTop.
    // Lenis (if enabled) will smooth this native scroll.
    scrollWrapper.style.overflowY = 'auto';
    scrollWrapper.style.overflowX = 'hidden';
    scrollWrapper.style.height = '100vh';
    
    if (!isMobile) {
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
    }

    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // Set default scroller for all ScrollTriggers
    ScrollTrigger.defaults({ scroller: "#main-wrapper" });
    
    // Initialize pinned process section
    initHowItWorks();
    initCardStack();
    initEditorialTestimonials();
    initEventGalleries();
    initBookingSection();
    initFooterSection();
    
    console.log("GSAP Plugins registered & Lenis activated on main-wrapper");

    // 1. Smooth Reveal animations for all text and content
    ScrollTrigger.batch(".gs-reveal", {
      scroller: "#main-wrapper",
      start: "top 88%",
      onEnter: batch => gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: isMobile ? 0.6 : 1.4,
        stagger: isMobile ? 0.05 : 0.15,
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
          scroller: "#main-wrapper",
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
    generateMasterTrack();

    // Set initial crawler position
    const baseTrack = document.getElementById("master-track-base");
    const initPoint = baseTrack.getPointAtLength(0);
    gsap.set("#crawler-wrap", { 
      x: initPoint.x, 
      y: initPoint.y, 
      xPercent: -50, 
      yPercent: -50
    });

    // 5. Crawler Motion (Native SVG getPointAtLength for guaranteed movement)
    ScrollTrigger.create({
      trigger: "#scroll-content",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Get the current point on the SVG path
        const currentLength = progress * globalPathLength;
        const point = baseTrack.getPointAtLength(currentLength);
        
        // Get a point slightly ahead to calculate rotation
        let nextLength = currentLength + 5; // Look ahead 5 pixels for stable orientation
        if (nextLength > globalPathLength) nextLength = globalPathLength;
        const nextPoint = baseTrack.getPointAtLength(nextLength);
        
        // Calculate angle in degrees
        const dx = nextPoint.x - point.x;
        const dy = nextPoint.y - point.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        // Apply strict centering and position ONLY (No 2D rotation!)
        // Use a slight negative offset in Y to lower the car closer to the track visually
        // and eliminate hovering/floating.
        gsap.set("#crawler-wrap", {
          x: point.x,
          y: point.y,
          xPercent: -50,
          yPercent: -50,
          force3D: true
        });

        if (isMobile) return; // Skip heavy orientation calculation for <model-viewer> on mobile

        // Apply 3D Orientation to the <model-viewer>
        const crawlerCar = document.getElementById("crawler-car");
        if (crawlerCar && crawlerCar.tagName.toLowerCase() === 'model-viewer') {
          // Force camera target to put the pivot near the bottom (wheels)
          // so rotation doesn't swing the car off the track.
          crawlerCar.setAttribute("camera-target", "0m -0.15m 0m");

          // 1. Yaw (Steering): Map 2D angle to 3D Y-axis rotation
          // Standard mapping: -angle offsets the 2D clockwise mapping to 3D counter-clockwise.
          // Changed offset from -90 to 90/etc depending on correct alignment. 
          // If the car drifted, it means yaw angle offset or sign was wrong.
          // -angle + 90 usually points Z-forward cars correctly.
          const yaw = -angle + 90; 
          
          // 2. Pitch (Slopes): Lean down when moving down the screen, lean up when moving up
          const pitchOffset = Math.sin(angle * Math.PI / 180) * 12;
          const pitch = 180 + pitchOffset; // Base 180 fixes the original upside-down model
          
          // 3. Roll (Turns): Lean into corners
          let furtherLength = currentLength + 20;
          if (furtherLength > globalPathLength) furtherLength = globalPathLength;
          const furtherPoint = baseTrack.getPointAtLength(furtherLength);
          const furtherAngle = Math.atan2(furtherPoint.y - point.y, furtherPoint.x - point.x) * (180 / Math.PI);
          
          let angleDiff = furtherAngle - angle;
          if (angleDiff > 180) angleDiff -= 360;
          if (angleDiff < -180) angleDiff += 360;
          
          // Roll leans opposite to the turn for realistic suspension weight transfer
          const roll = angleDiff * 1.2; 
          
          // model-viewer orientation format is "x y z" (Pitch Yaw Roll)
          crawlerCar.setAttribute('orientation', `${pitch}deg ${yaw}deg ${roll}deg`);
        }
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

// Ã¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•Â R-TRACK HERO CARD ANIMATION Ã¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•Â
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

// Ã¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•Â PINNED SCROLL 5-STEP PROCESS Ã¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•Â
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

// Ã¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•Â FAQ TOGGLE Ã¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•ÂÃ¢•Â
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

// ---------------- HERO VIDEO INTERACTION ----------------
function initHeroVideo() {
    const card = document.getElementById('heroVideoCard');
    const video = document.getElementById('heroVideo');
    const backdrop = document.getElementById('video-backdrop');
    const closeBtn = document.getElementById('heroVideoCloseBtn');
    
    if (!card || !video || !backdrop) return;

    let isExpanded = false;
    let isAnimating = false;
    let originalRect = null;
    let spacer = null;

    // Handle Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isExpanded && !isAnimating) {
            shrinkVideo();
        }
    });

    card.addEventListener('click', () => {
        if (isExpanded || isAnimating) return;
        
        isExpanded = true;
        isAnimating = true;
        
        // Kill existing animations on the card to prevent conflicts
        gsap.killTweensOf(card);
        
        // FLIP Animation: Get current position
        originalRect = card.getBoundingClientRect();
        
        // Create a spacer so the layout doesn't collapse
        if (!document.getElementById('heroVideoSpacer')) {
            spacer = document.createElement('div');
            spacer.id = 'heroVideoSpacer';
            spacer.style.width = originalRect.width + 'px';
            spacer.style.height = originalRect.height + 'px';
            card.parentNode.insertBefore(spacer, card);
        } else {
            spacer = document.getElementById('heroVideoSpacer');
        }
        
        // Set card to fixed at exactly its current layout position
        gsap.set(card, {
            position: 'fixed',
            top: originalRect.top,
            left: originalRect.left,
            width: originalRect.width,
            height: originalRect.height,
            margin: 0,
            zIndex: 1000
        });
        
        // Animate to expanded state
        gsap.to(card, {
            top: "50%",
            left: "50%",
            xPercent: -50,
            yPercent: -50,
            width: "80vw",
            height: "80vh",
            duration: 0.6,
            ease: "power3.inOut",
            onComplete: () => {
                isAnimating = false;
            }
        });

        // Add classes for expanded state
        card.classList.add('is-expanded');
        backdrop.classList.add('active');
        
        // Reset and play video
        video.currentTime = 0;
        video.play().catch(e => console.log("Video play error:", e));
    });

    // Close Button
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isExpanded && !isAnimating) shrinkVideo();
        });
    }

    // Shrink when video ends
    video.addEventListener('ended', () => {
        if (isExpanded && !isAnimating) shrinkVideo();
    });

    // Also shrink if backdrop is clicked
    backdrop.addEventListener('click', () => {
        if (isExpanded && !isAnimating) shrinkVideo();
    });

    function shrinkVideo() {
        if (!isExpanded || isAnimating) return;
        isExpanded = false;
        isAnimating = true;
        
        gsap.killTweensOf(card);
        
        const targetRect = spacer ? spacer.getBoundingClientRect() : (originalRect || { top: 0, left: 0, width: 300, height: 200 });
        
        card.classList.remove('is-expanded');
        backdrop.classList.remove('active');
        video.pause();
        
        // Animate back to original position
        gsap.to(card, {
            top: targetRect.top,
            left: targetRect.left,
            xPercent: 0,
            yPercent: 0,
            width: targetRect.width,
            height: targetRect.height,
            duration: 0.6,
            ease: "power3.inOut",
            onComplete: () => {
                gsap.set(card, { clearProps: "position,top,left,width,height,margin,zIndex,transform" });
                if (spacer) {
                    spacer.remove();
                    spacer = null;
                }
                isAnimating = false;
            }
        });
    }
}

// Attach to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initHeroVideo();
    initMobileSpacesCarousel();
    initMobileFunCardsCarousel();
    
    // Load heavy 3D model data only on desktop
    if (window.innerWidth > 768) {
      const script = document.createElement('script');
      script.src = 'assets/model_data.js';
      document.body.appendChild(script);
    } else {
      // Hide 3D car on mobile to save performance
      const crawlerCar = document.getElementById("crawler-car");
      if (crawlerCar) crawlerCar.style.display = 'none';
    }
});

// -------- WAYS TO REPLAY: CARD STACK --------
function initCardStack() {
  const cards = gsap.utils.toArray('.challenge-card');
  if (cards.length <= 1) return;

  let currentIndex = 0;
  let isAnimating = false;

  // Initial state: hide all cards to the right, except the first one
  gsap.set(cards, { 
    transformOrigin: "center center",
    xPercent: 100, 
    scale: 1, 
    opacity: 0, // Keep parked cards invisible so they don't stack up on the right
    zIndex: 0 
  });
  
  // Set the first card to be visible immediately
  gsap.set(cards[0], { 
    xPercent: 0, 
    opacity: 1,
    zIndex: 1 
  });

  function nextCard() {
    if (isAnimating) return;
    isAnimating = true;

    const current = cards[currentIndex];
    const nextIndex = (currentIndex + 1) % cards.length;
    const next = cards[nextIndex];

    // Prepare next card to slide in from the right, on top of the current one
    gsap.set(next, { xPercent: 100, scale: 1, opacity: 1, zIndex: 2 });
    gsap.set(current, { zIndex: 1 }); // Ensure current stays below next

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating = false;
        currentIndex = nextIndex;
        // Reset the old card's z-index and hide it completely
        gsap.set(current, { zIndex: 0, opacity: 0 });
      }
    });

    // Slide next card in
    tl.to(next, {
      xPercent: 0,
      duration: 0.4,
      ease: "power2.inOut"
    }, 0);

    // Zoom out, push left, and fade current card
    tl.to(current, {
      scale: 0.85,
      xPercent: -20,
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut"
    }, 0);
  }

  // Start the infinite automatic loop
  setInterval(nextCard, 3500);
}

function initEditorialTestimonials() {
  gsap.utils.toArray('.ed-divider').forEach(divider => {
    gsap.fromTo(divider, 
      { scaleX: 0 }, 
      { scaleX: 1, duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: divider, scroller: "#main-wrapper", start: "top 85%" } }
    );
  });

  gsap.utils.toArray('.ed-quote-line').forEach(line => {
    gsap.fromTo(line, 
      { scaleY: 0 }, 
      { scaleY: 1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: line, scroller: "#main-wrapper", start: "top 85%" } }
    );
  });
}


// â•â•â•â•â•â•â•â• HOW IT WORKS: EDITORIAL â•â•â•â•â•â•â•â•
function initEditorialProcess() {
  // Staggered fade up for process steps
  gsap.utils.toArray('.gs-process-step').forEach(step => {
    gsap.to(step, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: step,
        scroller: "#main-wrapper",
        start: "top 85%"
      }
    });

    // Expand highlight bar
    const bar = step.querySelector('.ed-highlight-bar');
    if (bar) {
      gsap.to(bar, {
        width: 4,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: step,
          scroller: "#main-wrapper",
          start: "top 80%"
        }
      });
    }

    // Counter animation for step numbers
    const num = step.querySelector('.num-counter');
    if (num) {
      const targetVal = parseInt(step.getAttribute('data-step') || 0);
      gsap.to({ val: 0 }, {
        val: targetVal,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: function() {
          num.innerText = Math.round(this.targets()[0].val);
        },
        scrollTrigger: {
          trigger: step,
          scroller: "#main-wrapper",
          start: "top 80%"
        }
      });
    }
  });

  // Stagger trust row cards
  gsap.fromTo('.ed-trust-card', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", 
      scrollTrigger: {
        trigger: ".ed-trust-row",
        scroller: "#main-wrapper",
        start: "top 85%"
      }
    }
  );
}

function initHowItWorks() {
  const howWrap = document.querySelector('.editorial-how');
  if (!howWrap) return;

  // Title reveal animation
  const title = howWrap.querySelector('.how-title');
  if (title) {
    const text = title.innerText;
    title.innerHTML = '';
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.innerText = char;
      span.style.opacity = '0';
      if ((i >= 5 && i <= 11) || (i >= 16 && i <= 21)) {
        span.classList.add('orange');
      }
      title.appendChild(span);
    });

    gsap.to(title.querySelectorAll('span'), {
      scrollTrigger: {
        trigger: title,
        scroller: "#main-wrapper",
        start: "top 85%"
      },
      opacity: 1,
      duration: 0.05,
      stagger: 0.03,
      ease: "none"
    });
  }

  // Cinematic Timeline Animation
  const stepsList = howWrap.querySelector('.how-steps-list');
  const progressLine = howWrap.querySelector('.how-timeline-progress');
  const pulse = howWrap.querySelector('.how-timeline-pulse');
  const steps = gsap.utils.toArray('.gs-how-step');
  
  if (!stepsList || !progressLine || !pulse || steps.length === 0) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stepsList,
      scroller: "#main-wrapper",
      start: "top 75%", // Triggers when ~25% visible
      once: true // Play only once
    }
  });

  // Reveal pulse
  tl.to(pulse, { opacity: 1, duration: 0.2, ease: "power2.out" });

  // Animate the line and pulse across 5 steps (0% to 100%)
  tl.fromTo(stepsList, 
    { "--timeline-progress": "0%" },
    {
      "--timeline-progress": "100%",
      duration: 2.8,
      ease: "power1.inOut",
      onUpdate: function() {
        const val = this.progress() * 100;
        
        steps.forEach((step, i) => {
          const threshold = i * 25;
          if (val >= threshold && !step.classList.contains('icon-active') && !step.classList.contains('icon-completed') && !step.classList.contains('icon-final')) {
            // Pulse arrived at this step
            step.classList.add('icon-active');
            step.classList.add('ripple-active');
            step.classList.add('content-revealed');
            
            // Mark previous steps as completed
            for (let j = 0; j < i; j++) {
              steps[j].classList.remove('icon-active');
              steps[j].classList.add('icon-completed');
            }
          }
        });
      },
    onComplete: function() {
      // Final Celebration State
      const lastStep = steps[steps.length - 1];
      lastStep.classList.remove('icon-active');
      lastStep.classList.add('icon-final');
      
      // Shimmer across full timeline
      stepsList.classList.add('shimmer-active');
      
      // Fade out pulse orb gracefully
      gsap.to(pulse, { opacity: 0, duration: 0.5, delay: 0.5 });
    }
  });
}

function initBookingSection() {
  const bookingWrap = document.querySelector('.editorial-booking');
  if (!bookingWrap) return;

  // Form submission logic
  const form = document.getElementById('whatsapp-booking-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('b-name').value;
      const phone = document.getElementById('b-phone').value;
      const email = document.getElementById('b-email').value;
      const occasion = document.getElementById('b-occasion').value;
      const venue = document.getElementById('b-venue').value;
      const date = document.getElementById('b-date').value;
      const crowd = document.getElementById('b-crowd').value;

      const message = `Hello RePlay Team,\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nOccasion: ${occasion}\nVenue: ${venue}\nPreferred Date: ${date}\nCrowd Size: ${crowd}\n\nPlease suggest the best setup for my event.`;
      
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/919987412025?text=${encodedMessage}`, '_blank');
    });
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: bookingWrap,
      scroller: "#main-wrapper",
      start: "top 75%"
    }
  });

  // Section label text reveal
  const title = bookingWrap.querySelector('.booking-title');
  if (title) {
    tl.fromTo(title, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }

  // Divider draw
  const divider = bookingWrap.querySelector('.booking-divider');
  if (divider) {
    tl.fromTo(divider,
      { scaleX: 0 },
      { scaleX: 1, duration: 1, ease: "expo.out" },
      "-=0.6"
    );
  }

  // Left column slide
  const leftCol = bookingWrap.querySelector('.gs-booking-slide-left');
  if (leftCol) {
    tl.fromTo(leftCol,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    );
  }

  // Right column slide
  const rightCol = bookingWrap.querySelector('.gs-booking-slide-right');
  if (rightCol) {
    tl.fromTo(rightCol,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
      "-=0.8"
    );
  }

  // Stagger inputs
  const inputs = bookingWrap.querySelectorAll('.gs-form-input');
  if (inputs.length) {
    tl.fromTo(inputs,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
      "-=0.4"
    );
  }
}

function initFooterSection() {
  const footerWrap = document.querySelector('.editorial-footer');
  if (!footerWrap) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: footerWrap,
      scroller: "#main-wrapper",
      start: "top 85%"
    }
  });

  // Section label text reveal
  const title = footerWrap.querySelector('.footer-title');
  if (title) {
    tl.fromTo(title, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }

  // Divider draw
  const divider = footerWrap.querySelector('.footer-divider');
  if (divider) {
    tl.fromTo(divider,
      { scaleX: 0 },
      { scaleX: 1, duration: 1, ease: "expo.out" },
      "-=0.6"
    );
  }

  // Columns stagger
  const cols = footerWrap.querySelectorAll('.gs-footer-col');
  if (cols.length) {
    tl.fromTo(cols,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" },
      "-=0.4"
    );
  }

  // Bottom CTA and bar fade up
  const bottoms = footerWrap.querySelectorAll('.gs-footer-bottom');
  if (bottoms.length) {
    tl.fromTo(bottoms,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power2.out" },
      "-=0.2"
    );
  }
}

function initEventGalleries() {
  const galleries = document.querySelectorAll('.event-gallery');
  if (!galleries.length) return;

  // Setup gallery parallax and card stagger
  galleries.forEach((gallery) => {
    const cards = gallery.querySelectorAll('.gs-gallery-card');
    
    // Staggered reveal for cards inside the gallery
    gsap.fromTo(cards, 
      { opacity: 0, y: 50, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: gallery,
          scroller: "#main-wrapper",
          start: "top 85%"
        }
      }
    );

    // Soft Parallax movement for the whole gallery
    gsap.to(gallery, {
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: gallery,
        scroller: "#main-wrapper",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  });

  // Storytelling Active States
  // When a testimonial hits the center of the screen, highlight it and its subsequent gallery
  const testimonials = document.querySelectorAll('.ed-testimonial');
  testimonials.forEach((testimonial) => {
    // Find the very next element sibling, which is the gallery
    const nextGallery = testimonial.nextElementSibling;
    
    ScrollTrigger.create({
      trigger: testimonial,
      scroller: "#main-wrapper",
      start: "top center+=100",
      end: "bottom center-=100",
      onEnter: () => {
        testimonial.classList.add('is-active');
        if (nextGallery && nextGallery.classList.contains('event-gallery')) {
          nextGallery.classList.add('is-active');
        }
      },
      onLeave: () => {
        testimonial.classList.remove('is-active');
        if (nextGallery && nextGallery.classList.contains('event-gallery')) {
          nextGallery.classList.remove('is-active');
        }
      },
      onEnterBack: () => {
        testimonial.classList.add('is-active');
        if (nextGallery && nextGallery.classList.contains('event-gallery')) {
          nextGallery.classList.add('is-active');
        }
      },
      onLeaveBack: () => {
        testimonial.classList.remove('is-active');
        if (nextGallery && nextGallery.classList.contains('event-gallery')) {
          nextGallery.classList.remove('is-active');
        }
      }
    });
  });
}

let globalPathLength = 0;
let masterTrackScrollTrigger = null;

function generateMasterTrack() {
  const scrollEl = document.getElementById("scroll-content");
  if (!scrollEl) return;
  const full_h = scrollEl.offsetHeight || 5000;
  const w = window.innerWidth;
  
  let term_h = full_h;
  const closingSection = document.querySelector('.how-closing');
  if (closingSection) {
    const rect = closingSection.getBoundingClientRect();
    const scrollRect = scrollEl.getBoundingClientRect();
    term_h = rect.top - scrollRect.top - 20; // Terminate just above the section
  }
  
  const svg = document.getElementById("master-track-svg");
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 " + w + " " + term_h);
  svg.style.width = w + "px";
  svg.style.height = term_h + "px";
  svg.removeAttribute("preserveAspectRatio");
  
  // Premium fade-out effect at the termination point
  svg.style.WebkitMaskImage = "linear-gradient(to bottom, black 0%, black calc(100% - 150px), transparent 100%)";
  svg.style.maskImage = "linear-gradient(to bottom, black 0%, black calc(100% - 150px), transparent 100%)";
  
  let d = "M " + (w * 0.85) + " 0 ";
  const segments = 8;
  const stepY = full_h / segments;
  
  for(let i=1; i<=segments; i++) {
    let curY = i * stepY;
    let prevY = (i - 1) * stepY;
    let targetX = (i % 2 === 1) ? w * 0.15 : w * 0.85;
    if (i === segments) targetX = w / 2;
    let cp1X = (i % 2 === 1) ? w * 0.85 : w * 0.15;
    d += "C " + cp1X + " " + (prevY + stepY*0.3) + ", " + targetX + " " + (curY - stepY*0.3) + ", " + targetX + " " + curY + " ";
  }
  
  const baseTrack = document.getElementById("master-track-base");
  const activeTrack = document.getElementById("master-track-active");
  const dashTrack = document.getElementById("master-track-dash");
  const maskPath = document.getElementById("master-track-mask-path");
  
  if(baseTrack) baseTrack.setAttribute("d", d);
  if(activeTrack) activeTrack.setAttribute("d", d);
  if(dashTrack) dashTrack.setAttribute("d", d);
  if(maskPath) {
    maskPath.setAttribute("d", d);
    globalPathLength = maskPath.getTotalLength();
    maskPath.style.strokeDasharray = globalPathLength;
    maskPath.style.strokeDashoffset = globalPathLength;

    if (masterTrackScrollTrigger) {
      masterTrackScrollTrigger.kill();
    }

    const animation = gsap.to(maskPath, {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: "#scroll-content",
        scroller: "#main-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        id: "master-track-draw"
      },
      ease: "none"
    });
    
    masterTrackScrollTrigger = ScrollTrigger.getById("master-track-draw");
  }

  ScrollTrigger.refresh();
}

window.addEventListener('load', generateMasterTrack);
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(generateMasterTrack, 200);
});



// ==========================================
// INSTAGRAM PULL ANIMATIONS
// ==========================================
function initInstagramSection() {
  const section = document.querySelector('.instagram-pull-section');
  if (!section) return;

  // Reveal Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      scroller: '#main-wrapper',
      start: 'top 70%',
    }
  });

  // Reveal Emojis
  tl.fromTo('.insta-emoji', 
    { y: 50, opacity: 0, scale: 0.5 },
    { y: 0, opacity: 1, scale: 1, rotation: () => gsap.utils.random(-20, 20), duration: 0.8, stagger: 0.1, ease: 'back.out(1.5)' }
  )
  // Reveal QR Card
  .fromTo('.insta-qr-container',
    { scale: 0.8, opacity: 0, y: 30 },
    { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.2)' },
    '-=0.5'
  )
  // Reveal Header and CTA
  .fromTo('.gs-insta-reveal',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'power2.out' },
    '-=0.4'
  );

  // Continuous Floating Emojis
  gsap.utils.toArray('.insta-emoji').forEach((emoji) => {
    gsap.to(emoji, {
      y: '+=15',
      x: () => gsap.utils.random(-10, 10),
      rotation: () => gsap.utils.random(-10, 10),
      duration: gsap.utils.random(2, 4),
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  });

  // Parallax / Tilt Effect
  const qrCard = document.querySelector('.insta-qr-card');
  section.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20; // max 20deg tilt
    const y = (e.clientY / window.innerHeight - 0.5) * -20;
    
    gsap.to(qrCard, {
      rotateX: y,
      rotateY: x,
      duration: 0.5,
      ease: 'power1.out'
    });

    gsap.to('.insta-emoji', {
      x: (i, target) => {
        const depth = parseFloat(target.style.fontSize || 3) * 5; // deeper = moves more
        return x * depth * 0.1;
      },
      y: (i, target) => {
         const depth = parseFloat(target.style.fontSize || 3) * 5;
         return -y * depth * 0.1;
      },
      duration: 1,
      ease: 'power1.out'
    });
  });

  section.addEventListener('mouseleave', () => {
    gsap.to(qrCard, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'back.out(1.2)' });
    gsap.to('.insta-emoji', { x: 0, y: 0, duration: 0.8, ease: 'power1.out' });
  });
}

// Ensure it runs after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initInstagramSection();
});

// Custom Datepicker Logic
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('b-date');
  const datepicker = document.getElementById('custom-datepicker');
  if(!dateInput || !datepicker) return;

  const monthYearDisplay = datepicker.querySelector('.cdp-month-year');
  const daysContainer = datepicker.querySelector('.cdp-days');
  const prevBtn = datepicker.querySelector('.cdp-prev');
  const nextBtn = datepicker.querySelector('.cdp-next');

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let selectedDate = null;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function renderCalendar(month, year) {
    daysContainer.innerHTML = '';
    monthYearDisplay.textContent = monthNames[month] + ' ' + year;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      daysContainer.appendChild(emptyCell);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayCell = document.createElement('div');
      dayCell.classList.add('cdp-day');
      dayCell.textContent = i;

      const cellDate = new Date(year, month, i);
      
      if (cellDate < today) {
        dayCell.classList.add('disabled');
      } else {
        dayCell.addEventListener('click', () => {
          selectedDate = cellDate;
          dateInput.value = i.toString().padStart(2, '0') + ' ' + monthNames[month] + ' ' + year;
          datepicker.classList.remove('active');
          renderCalendar(currentMonth, currentYear); // Re-render to show selection
        });
      }

      if (selectedDate && cellDate.getTime() === selectedDate.getTime()) {
        dayCell.classList.add('selected');
      }

      daysContainer.appendChild(dayCell);
    }
  }

  dateInput.addEventListener('click', (e) => {
    e.stopPropagation();
    datepicker.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!datepicker.contains(e.target) && e.target !== dateInput) {
      datepicker.classList.remove('active');
    }
  });

  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });

  renderCalendar(currentMonth, currentYear);
});

// ==========================================================================
//    MOBILE INFINITE SPACES CAROUSEL
// ==========================================================================
function initMobileSpacesCarousel() {
  if (window.innerWidth >= 768) return; // Mobile only

  const gridWrap = document.querySelector('.spaces-grid-wrap');
  const grid = document.querySelector('.spaces-grid');
  if (!gridWrap || !grid) return;

  const originalCards = Array.from(grid.querySelectorAll('.space-card'));
  if (originalCards.length === 0) return;

  // Duplicate cards for infinite effect
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    grid.appendChild(clone);
  });

  // Also duplicate again to be super safe if the screen is wide on mobile
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    grid.appendChild(clone);
  });

  let isAutoScrolling = true;
  let rafId = null;
  let scrollSpeed = 0.8; // px per frame
  let resumeTimeout = null;

  // Calculate the scroll width of exactly one original set
  const calculateOriginalWidth = () => {
    const cardWidth = originalCards[0].offsetWidth;
    const gap = 15; // gap: 15px on mobile
    return (cardWidth + gap) * originalCards.length;
  };

  const autoScroll = () => {
    if (isAutoScrolling) {
      gridWrap.scrollLeft += scrollSpeed;
      
      const singleSetWidth = calculateOriginalWidth();
      if (gridWrap.scrollLeft >= singleSetWidth) {
        // Seamless jump back
        gridWrap.scrollLeft -= singleSetWidth;
      }
    }
    rafId = requestAnimationFrame(autoScroll);
  };

  const pauseAutoScroll = () => {
    isAutoScrolling = false;
    clearTimeout(resumeTimeout);
    
    resumeTimeout = setTimeout(() => {
      isAutoScrolling = true;
    }, 2500); // 2.5s resume delay
  };

  // Listeners for interaction
  gridWrap.addEventListener('touchstart', pauseAutoScroll, { passive: true });
  gridWrap.addEventListener('touchmove', pauseAutoScroll, { passive: true });
  gridWrap.addEventListener('scroll', () => {
    if (!isAutoScrolling) pauseAutoScroll(); // keep delaying if manually scrolling
    
    // Handle manual loop jump
    const singleSetWidth = calculateOriginalWidth();
    if (gridWrap.scrollLeft >= singleSetWidth * 2) {
      gridWrap.scrollLeft -= singleSetWidth;
    } else if (gridWrap.scrollLeft <= 0) {
      gridWrap.scrollLeft += singleSetWidth;
    }
  }, { passive: true });

  // Start the engine
  rafId = requestAnimationFrame(autoScroll);
}

// ==========================================================================
//    MOBILE INFINITE FUN CARDS MARQUEE
// ==========================================================================
function initMobileFunCardsCarousel() {
  if (window.innerWidth >= 768) return; // Mobile only

  const gridWrap = document.querySelector('.fun-cards-wrapper');
  if (!gridWrap) return;

  const originalCards = Array.from(gridWrap.querySelectorAll('.fun-card'));
  if (originalCards.length === 0) return;

  // Duplicate cards for infinite effect
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    gridWrap.appendChild(clone);
  });

  // Also duplicate again to be super safe
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    gridWrap.appendChild(clone);
  });

  let isAutoScrolling = true;
  let rafId = null;
  let scrollSpeed = 0.6; // px per frame
  let resumeTimeout = null;

  // Calculate the scroll width of exactly one original set
  const calculateOriginalWidth = () => {
    const cardWidth = originalCards[0].offsetWidth;
    const gap = 20; // gap on mobile is 20px
    return (cardWidth + gap) * originalCards.length;
  };

  const autoScroll = () => {
    if (isAutoScrolling) {
      gridWrap.scrollLeft += scrollSpeed;
      
      const singleSetWidth = calculateOriginalWidth();
      if (gridWrap.scrollLeft >= singleSetWidth) {
        // Seamless jump back
        gridWrap.scrollLeft -= singleSetWidth;
      }
    }
    rafId = requestAnimationFrame(autoScroll);
  };

  const pauseAutoScroll = () => {
    isAutoScrolling = false;
    clearTimeout(resumeTimeout);
    
    resumeTimeout = setTimeout(() => {
      isAutoScrolling = true;
    }, 2500); // 2.5s resume delay
  };

  // Listeners for interaction
  gridWrap.addEventListener('touchstart', pauseAutoScroll, { passive: true });
  gridWrap.addEventListener('touchmove', pauseAutoScroll, { passive: true });
  gridWrap.addEventListener('scroll', () => {
    if (!isAutoScrolling) pauseAutoScroll(); // keep delaying if manually scrolling
    
    // Handle manual loop jump
    const singleSetWidth = calculateOriginalWidth();
    if (gridWrap.scrollLeft >= singleSetWidth * 2) {
      gridWrap.scrollLeft -= singleSetWidth;
    } else if (gridWrap.scrollLeft <= 0) {
      gridWrap.scrollLeft += singleSetWidth;
    }
  }, { passive: true });

  // Start the engine
  rafId = requestAnimationFrame(autoScroll);
}
