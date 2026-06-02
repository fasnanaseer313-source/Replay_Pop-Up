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

    // 1. Reveal animations for content
    const revealElements = gsap.utils.toArray('.gs-reveal');
    revealElements.forEach(elem => {
      ScrollTrigger.create({
        trigger: elem,
        start: "top 85%",
        onEnter: () => {
          gsap.to(elem, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
          });
        },
        once: true
      });
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
    
    baseTrack.setAttribute("d", d);
    activeTrack.setAttribute("d", d);

    // 4. Track Draw Animation
    const pathLength = activeTrack.getTotalLength();
    activeTrack.style.strokeDasharray = pathLength;
    activeTrack.style.strokeDashoffset = pathLength;

    gsap.to(activeTrack, {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: "#scroll-content",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
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

    console.log("Crawler animation setup complete. Path Length:", pathLength);

  } catch (error) {
    console.error("GSAP Initialization Error:", error);
  }
}
