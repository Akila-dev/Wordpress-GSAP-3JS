// import Letterize from "https://cdn.skypack.dev/letterizejs@2.0.0";
// const test = new Letterize({
//   targets: "#animateMe",
// });

// var animation = anime.timeline({
//   targets: test.listAll,
//   delay: anime.stagger(50),
//   loop: true,
// });

// animation
//   .add({
//     translateY: -40,
//   })
//   .add({
//     translateY: 0,
//   });

const textHaeader = new SplitType("h1");

// * Home Hero Header
const heroHeaders = gsap.utils.toArray("h1");

heroHeaders.forEach((heroHeader) => {
  let lines = heroHeader.querySelectorAll(".line");
  lines.forEach((line, i) => {
    let letters = line.querySelectorAll(".char");
    gsap.from(letters, {
      opacity: 0,
      y: 100,
      duration: 0.5,
      delay: i / 10,
    });
  });
});

// * ARROWS
const arrow_containers = gsap.utils.toArray(".arrow-container");

if (arrow_containers) {
  arrow_containers.forEach((arrow_container) => {
    let arrow = arrow_container.querySelectorAll(".arrow-single");
    gsap.fromTo(
      arrow,
      {
        y: (i) => -1 + "em",
      },
      {
        y: (i) => i / 3 + "em",
        duration: 0.5,
        stagger: 0.1,
        repeat: -1,
        yoyo: true,
      }
    );
  });
}

// * ALL GSAP INTRO ANIMATIONS
const textH1 = new SplitType("h1");
const textH2 = new SplitType("h2");

const sections = gsap.utils.toArray(".gsap-section");

sections.forEach((section) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top+=" + window.innerHeight * 0.7,
      // markers: true,
    },
  });
  let hero_headers = section.querySelectorAll("h1");
  let headers = section.querySelectorAll("h2");
  let paragraphs = section.querySelectorAll(".p");
  let slide_in_ups = section.querySelectorAll(".slide-in-up");
  let slide_in_lefts = section.querySelectorAll(".slide-in-left");
  let buttons = section.querySelectorAll("a");

  if (hero_headers.length > 0) {
    hero_headers.forEach((hero_header) => {
      let lines = hero_header.querySelectorAll(".line");
      lines.forEach((line, i) => {
        let letters = line.querySelectorAll(".char");
        tl.from(
          letters,
          {
            opacity: 0,
            y: "1.5em",
            duration: 0.85,
            ease: "power2.out",
            delay: i * 0.2,
          },
          "<"
        );
      });
    });
  }

  if (headers.length > 0) {
    headers.forEach((header) => {
      let lines = header.querySelectorAll(".line");
      lines.forEach((line, i) => {
        let letters = line.querySelectorAll(".char");
        tl.from(
          letters,
          {
            opacity: 0,
            y: "1.5em",
            duration: 0.85,
            ease: "power2.out",
            delay: i * 0.2,
          },
          "<"
        );
      });
    });
  }

  if (slide_in_lefts.length > 0) {
    tl.from(
      slide_in_lefts,
      {
        opacity: 0,
        x: "15em",
        duration: 1,
        ease: "power2.out",
        stagger: 0.5,
      },
      "<"
    );
  }

  if (paragraphs.length > 0) {
    tl.from(
      paragraphs,
      {
        opacity: 0,
        // x: "0.5em",
        duration: 2,
        ease: "power2",
        stagger: 0.2,
      },
      ">-0.2"
    );
  }

  if (buttons.length > 0) {
    tl.from(
      buttons,
      {
        opacity: 0,
        x: "-3em",
        duration: 1,
        ease: "power2",
        stagger: 0.2,
      },
      "<+=0.5"
    );
  }

  if (slide_in_ups.length > 0) {
    tl.from(
      slide_in_ups,
      {
        opacity: 0,
        y: "5em",
        duration: 1,
        ease: "power4",
        stagger: 0.35,
      },
      "<+=0.5"
    );
  }
});

// * SCROLL SLIDE CARDS
const slide_sections = gsap.utils.toArray(".scroll-slider-container");
gsap.registerPlugin(ScrollTrigger);

if (slide_sections.length > 0) {
  slide_sections.forEach((section) => {
    let slider = section.querySelector(".scroll-slider");
    let ammount_to_scroll = slider.clientWidth - section.clientWidth;
    console.log(
      "🚀 ~ slide_sections.forEach ~ slider.clientWidth:",
      slider.clientWidth
    );
    console.log(
      "🚀 ~ slide_sections.forEach ~ section.clientWidth:",
      section.clientWidth
    );
    console.log(
      "🚀 ~ slide_sections.forEach ~ ammount_to_scroll:",
      ammount_to_scroll
    );
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 20%",
        end: "+=" + ammount_to_scroll,
        pin: true,
        markers: true,
        once: false,
        scrub: true,
      },
    });
    if (slider) {
      tl.from(slider, {
        x: -ammount_to_scroll,
      });
    }
  });
}
