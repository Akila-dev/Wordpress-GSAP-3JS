(() => {
  window.hero_sphere_animation = function hero_sphere_animation() {
    // ! HERO SECTION CONSTANTS
    const hero_trigger = "#gsap-hero_sphere_section";
    const hero_sphere = "#gsap-hero-sphere";

    // Initial mouse + position state
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    // Update mouse target on move
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Smooth follow ticker function
    const tickerFn = () => {
      pos.x += (mouse.x - pos.x) * 0.1;
      pos.y += (mouse.y - pos.y) * 0.1;

      gsap.set(hero_sphere, {
        x: pos.x - window.innerWidth / 2,
        y: pos.y - window.innerHeight / 2,
      });
    };
    gsap.ticker.add(tickerFn);

    // Scroll-based opacity animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero_trigger,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
    tl.to(hero_sphere, {
      duration: 1,
      opacity: 0,
      ease: "power3.out",
    });

    // --- Cleanup function ---
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(tickerFn);
      tl.kill();
    };
  };
})();
