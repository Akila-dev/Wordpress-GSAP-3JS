(() => {
  // ! MAKE THEME DARK ON SCROLL
  window.dark_on_scroll = function dark_on_scroll() {
    const dark_sections = gsap.utils.toArray(".gsap-scroll-dark");
    if (!dark_sections.length) return () => {};

    const dark_color = "#161616";
    const light_color = "#DEDEDE";
    const target = ".elementor-kit-4250";

    // Keep references to created triggers
    const triggers = [];

    dark_sections.forEach((dc) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: dc,
          start: "top center",
          onEnter: () => {
            gsap.set(target, {
              "--e-global-color-785b64d": dark_color,
              "--e-global-color-d3ae19d": light_color,
              "--e-global-color-primary": light_color,
              "--e-global-color-secondary": light_color,
            });
          },
          onLeaveBack: () => {
            gsap.set(target, {
              "--e-global-color-785b64d": light_color,
              "--e-global-color-d3ae19d": dark_color,
              "--e-global-color-primary": dark_color,
              "--e-global-color-secondary": dark_color,
            });
          },
        })
      );

      triggers.push(
        ScrollTrigger.create({
          trigger: dc,
          start: "bottom center",
          onEnter: () => {
            gsap.set(target, {
              "--e-global-color-785b64d": light_color,
              "--e-global-color-d3ae19d": dark_color,
              "--e-global-color-primary": dark_color,
              "--e-global-color-secondary": dark_color,
            });
          },
          onLeaveBack: () => {
            gsap.set(target, {
              "--e-global-color-785b64d": dark_color,
              "--e-global-color-d3ae19d": light_color,
              "--e-global-color-primary": light_color,
              "--e-global-color-secondary": light_color,
            });
          },
        })
      );
    });

    // Cleanup: kill all created triggers
    return () => triggers.forEach((t) => t.kill());
  };

  // ! SCROLL DISPLAY CARDS
  window.sdc_func = function sdc_func() {
    const sdc_container = gsap.utils.toArray(".scroll_display_cards-container");
    if (!sdc_container.length) return () => {};

    const triggers = [];

    sdc_container.forEach((sdc) => {
      const cards = sdc.querySelectorAll(".sdc-card");
      if (!cards.length) return;

      const p_max = 100;
      const p_min = 0;
      const start_points = [
        { x: p_max, y: p_max },
        { x: p_min, y: p_max },
        { x: -p_max, y: p_max },
      ];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sdc,
          start: "top bottom",
          end: "center center",
          scrub: 1,
        },
        defaults: {
          duration: 1,
          ease: "power2.out",
        },
      });

      triggers.push(tl.scrollTrigger);

      cards.forEach((card, i) => {
        const pos = start_points[i % start_points.length]; // cycle safely
        tl.from(
          card,
          {
            xPercent: pos.x,
            yPercent: pos.y,
            opacity: 0,
          },
          "<"
        );
      });
    });

    // Cleanup: kill all triggers
    return () => triggers.forEach((t) => t.kill());
  };
})();
