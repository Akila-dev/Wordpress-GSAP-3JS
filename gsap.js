// ! SCROLL DISPLAY CARDS
function sdc_func() {
  const sdc_container = gsap.utils.toArray(".scroll_display_cards-container");

  sdc_container.forEach((sdc) => {
    const cards = sdc.querySelectorAll(".sdc-card");

    const p_max = 100;
    const p_min = 0;
    const start_points = [
      {
        x: p_max,
        y: p_max,
      },
      {
        x: p_max,
        y: -p_max,
      },
      {
        x: p_min,
        y: p_max,
      },
      {
        x: p_min,
        y: -p_max,
      },
      {
        x: -p_max,
        y: p_max,
      },
      {
        x: -p_max,
        y: -p_max,
      },
    ];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sdc,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
      },
    });
    cards.forEach((card, i) => {
      tl.from(
        card,
        {
          xPercent: start_points[i].x,
          yPercent: start_points[i].y,
          opacity: 0,
        },
        "<"
      );
    });
  });
}

// ! TEXT FUNCTION
function text_func() {
  const gt_container = gsap.utils.toArray(".gsap_text-container");

  const textH1 = new SplitType(".gsap_text-container h1");
  const textH2 = new SplitType(".gsap_text-container h2");
  const textP = new SplitType(".gsap_text-container p");

  gt_container.forEach((gt) => {
    // let h1 = gt.querySelectorAll("h1 .line");
    // let p = gt.querySelectorAll("p .line");
    let h1 = gt.querySelectorAll("h1");
    let p = gt.querySelectorAll("p");

    // const tl = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: gt,
    //     start: "top bottom",
    //     end: "top top",
    //     scrub: 1,
    //   },
    //   defaults: {
    //     duration: 1,
    //     ease: "power2",
    //     stagger: 0.25,
    //   },
    // });

    if (h1.length > 0) {
      let line = h1.querySelectorAll(".line");
      gsap.from(h1, {
        scrollTrigger: {},
        opacity: 0,
        yPercent: 100,
      });
    }

    if (p.length > 0) {
      tl.from(p, {
        opacity: 0,
        yPercent: 100,
      });
    }
  });
}

// ! CALL THE FUNCTIONS
sdc_func();
text_func();
