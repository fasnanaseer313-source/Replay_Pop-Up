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

// â•â•â•â•â•â•â•â• HERO VIDEO INTERACTION â•â•â•â•â•â•â•â•
function initHeroVideo() {
    const card = document.getElementById('heroVideoCard');
    const video = document.getElementById('heroVideo');
    const backdrop = document.getElementById('video-backdrop');
    const closeBtn = document.getElementById('heroVideoCloseBtn');
    
    if (!card || !video || !backdrop) return;

    let isExpanded = false;

    card.addEventListener('click', () => {
        if (isExpanded) return;
        
        // Expand
        isExpanded = true;
        
        // FLIP Animation: Get current position
        const rect = card.getBoundingClientRect();
        
        // Create a spacer so the layout doesn't collapse
        const spacer = document.createElement('div');
        spacer.id = 'heroVideoSpacer';
        spacer.style.width = rect.width + 'px';
        spacer.style.height = rect.height + 'px';
        card.parentNode.insertBefore(spacer, card);
        
        // Set card to fixed at exactly its current layout position
        gsap.set(card, {
            position: 'fixed',
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
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
            ease: "power3.inOut"
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
            if (isExpanded) shrinkVideo();
        });
    }

    // Shrink when video ends
    video.addEventListener('ended', () => {
        if (!isExpanded) return;
        shrinkVideo();
    });

    // Also shrink if backdrop is clicked
    backdrop.addEventListener('click', () => {
        if (isExpanded) shrinkVideo();
    });

    function shrinkVideo() {
        if (!isExpanded) return;
        isExpanded = false;
        
        const spacer = document.getElementById('heroVideoSpacer');
        const rect = spacer ? spacer.getBoundingClientRect() : { top: 0, left: 0, width: 300, height: 200 };
        
        card.classList.remove('is-expanded');
        backdrop.classList.remove('active');
        
        // Animate back to original position
        gsap.to(card, {
            top: rect.top,
            left: rect.left,
            xPercent: 0,
            yPercent: 0,
            width: rect.width,
            height: rect.height,
            duration: 0.6,
            ease: "power3.inOut",
            onComplete: () => {
                gsap.set(card, { clearProps: "position,top,left,width,height,margin,zIndex,transform" });
                if (spacer) spacer.remove();
            }
        });
        
        video.pause();
    }
}

// Attach to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initHeroVideo();
});

// -------- WAYS TO REPLAY: CARD STACK --------
function initCardStack() {
  const cards = gsap.utils.toArray('.challenge-card');
  if (cards.length === 0) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".stack-section",
      scroller: "#main-wrapper",
      start: "top top",
      end: "+=3000",
      pin: true,
      scrub: 1,
      anticipatePin: 1
    }
  });

  // Initial state: first card visible, others offset and hidden
  gsap.set(cards, { 
    transformOrigin: "bottom center",
    zIndex: (i) => i
  });
  
  gsap.set(cards.slice(1), { 
    yPercent: 100, 
    scale: 0.92, 
    opacity: 0 
  });

  // Animate each card in
  cards.forEach((card, index) => {
    if (index === 0) return; // First card is already visible
    
    tl.to(card, {
      yPercent: 0,
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    }, index - 0.5); // Stagger timing slightly
    
    // Slight zoom out of the previous card to create depth
    tl.to(cards[index - 1], {
      scale: 0.92,
      opacity: 1 - ((cards.length - index) * 0.3),
      duration: 1,
      ease: "power2.out"
    }, index - 0.5);
  });
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

  // Fade in elements
  gsap.utils.toArray('.gs-how-reveal').forEach(el => {
    gsap.fromTo(el, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, scroller: "#main-wrapper", start: "top 85%" }}
    );
  });

  // Steps staggering and highlight animation
  const steps = gsap.utils.toArray('.gs-how-step');
  steps.forEach((step, index) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: step,
        scroller: "#main-wrapper",
        start: "top 85%"
      }
    });

    // Fade and slide step
    tl.fromTo(step, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    // Draw line
    const line = step.querySelector('.how-step-line');
    if (line) {
      tl.fromTo(line, 
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "expo.out" },
        "-=0.4"
      );
    }

    // Number counter animation
    const numEl = step.querySelector('.how-step-num');
    if (numEl) {
      const finalNum = parseInt(numEl.innerText, 10);
      const counter = { val: 0 };
      tl.to(counter, {
        val: finalNum,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => {
          numEl.innerText = counter.val < 10 ? '0' + Math.round(counter.val) : Math.round(counter.val);
        }
      }, "-=0.6");
    }

    // Highlight bar expansion
    const highlight = step.querySelector('.how-highlight-bg');
    if (highlight) {
      tl.fromTo(highlight,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "expo.out" },
        "-=0.6"
      );
    }
  });



  // Gentle Parallax effect
  gsap.fromTo(howWrap.querySelector('.how-steps-list'),
    { y: 50 },
    { y: -50, ease: "none", scrollTrigger: { trigger: howWrap, scroller: "#main-wrapper", scrub: true, start: "top bottom", end: "bottom top" }}
  );
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
  const h = scrollEl.offsetHeight || 5000;
  const w = window.innerWidth;
  
  const svg = document.getElementById("master-track-svg");
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 " + w + " " + h);
  svg.style.width = w + "px";
  svg.style.height = h + "px";
  svg.removeAttribute("preserveAspectRatio");
  
  let d = "M " + (w * 0.85) + " 0 ";
  const segments = 8;
  const stepY = h / segments;
  
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

