// ! SCROLL DISPLAY CARDS
function sdc_func() {
  const sdc_container = gsap.utils.toArray(".scroll_display_cards-container");

  if (!sdc_container || sdc_container.length < 1) {
    return;
  }

  sdc_container.forEach((sdc) => {
    const cards = sdc.querySelectorAll(".sdc-card");
    const text = sdc.querySelectorAll(".sdc-text");

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

    text.forEach((txt, i) => {
      tl.from(
        txt,
        {
          opacity: 0,
        },
        "<"
      );
    });
  });
}

// 	! TEXT ANIMATION FUNCTION
function animateText(element, target, type) {
  // SHARED ANIMATION
  const duration = 1;
  const ease = "power2";
  const stagger = 0.05;

  // SCROLL TRIGGER CONSTANTS
  const start = "top bottom";
  const end = "top top";
  const scrub = 1;

  // 		ANIMATION
  if (type === "h") {
    gsap.from(target, {
      scrollTrigger: {
        trigger: element,
        start: start,
        end: end,
        scrub: scrub,
      },
      opacity: 0,
      y: "10vh",
      duration: duration,
      ease: ease,
      stagger: stagger,
    });
  } else {
    gsap.from(target, {
      scrollTrigger: {
        trigger: element,
        start: start,
        end: end,
        scrub: scrub,
      },
      opacity: 0,
      y: "15vh",
      duration: duration,
      ease: ease,
      stagger: stagger,
    });
  }
}

// ! TEXT FUNCTION
function text_func() {
  const gt_container = gsap.utils.toArray(".gsap_text-container");

  if (!gt_container || gt_container.length < 1) {
    return;
  }

  const textH1 = new SplitType(".gsap_text-container h1");
  const textH2 = new SplitType(".gsap_text-container h2");
  const textH3 = new SplitType(".gsap_text-container h3");
  const textH4 = new SplitType(".gsap_text-container h4");
  const textP = new SplitType(".gsap_text-container p");

  gt_container.forEach((gt) => {
    var h1 = gt.querySelectorAll("h1");
    var h2 = gt.querySelectorAll("h2");
    var h3 = gt.querySelectorAll("h3");
    var h4 = gt.querySelectorAll("h4");
    var p = gt.querySelectorAll("p");

    if (h1.length > 0) {
      h1.forEach((element) => {
        let target = element.querySelectorAll(".word");
        animateText(element, target, "h");
      });
    }

    if (h2.length > 0) {
      h2.forEach((element) => {
        let target = element.querySelectorAll(".word");
        animateText(element, target, "h");
      });
    }

    if (h3.length > 0) {
      h3.forEach((element) => {
        let target = element.querySelectorAll(".word");
        animateText(element, target, "h");
      });
    }

    if (h4.length > 0) {
      h4.forEach((element) => {
        let target = element.querySelectorAll(".word");
        animateText(element, target, "h");
      });
    }

    if (p.length > 0) {
      p.forEach((element) => {
        let target = element.querySelectorAll(".line");
        animateText(element, target, "p");
      });
    }
  });
}

// ! CALL THE FUNCTIONS
sdc_func();
text_func();
