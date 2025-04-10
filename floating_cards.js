// https://smoothiecommunicate.com/wp-content/uploads/2025/03/de-rigo-home.mp4

// ! GLOBALS
var vw = window.innerWidth; //view port width
var vh = window.innerHeight; //view port height
let windowX = window.innerWidth;
let windowY = window.innerHeight;
let mouseX = 0,
  mouseY = 0;

// const floating_cards = gsap.utils.toArray(".floating-card");

init();
onWindowResize();

// ! INIT
function init() {
  if (!document.querySelector("#floating-cards-section")) {
    return null;
  }

  vw = window.innerWidth;
  gsap.registerPlugin(ScrollTrigger);
  const header_split = new SplitType("#floating-cards-section h1");

  // ! INIT FLOATING CARDS
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".floating-cards-container",
      start: "top bottom",
      end: "+=" + window.innerHeight * 1.5,
      scrub: 1,
      // toggleActions: "play reverse play reverse",
    },
    defaults: {
      ease: "power2",
      // stagger: 0.25,
    },
  });

  tl.from(".floating-card", {
    z: "-5vw",
    opacity: 0,
    stagger: 0.01,
  })
    .from(
      ".floating-cards-scene",
      {
        y: "50vh",
      },
      "<"
    )
    .from(
      "#floating-cards-section h1",
      {
        y: "25vh",
      },
      "<+=75%"
    )
    .from(
      "#floating-cards-section h1 .word",
      {
        opacity: 0,
        yPercent: 100,
        stagger: 0.05,
      },
      "<"
    )
    .from(
      "#floating-cards-section .gsap-btn",
      {
        opacity: 0,
        yPercent: 100,
        stagger: 0.01,
      },
      ">-0.25"
    );

  // ! FLOATING CARDS SCROLL TRIGGER
  let st = gsap.timeline({
    scrollTrigger: {
      trigger: ".floating-cards-container",
      start: "top top",
      end: "+=" + window.innerWidth * 1,
      scrub: true,
      pin: "#floating-cards-section",
      // markers: true,
      // toggleActions: "play reverse play reverse",
    },
  });

  st.set(".scrolling-floating-card-endpoint .text-container", {
    y: "100vh",
  })
    .to(".floating-card:not(.floating-card-sticky)", {
      opacity: 0.5,
    })
    .to(
      ".floating-card-sticky",
      {
        scale: 1.1,
        opacity: 1,
      },
      "<"
    );

  window.addEventListener("resize", onWindowResize, false);
  window.addEventListener("mousemove", onMouseMove);
  gsapAnimate();
}

// ! MOUSE TRIGGER
function onMouseMove(e) {
  const disp = 40;
  const disp_sm = disp;
  const disp_lg = disp * 1.2;
  let dispX = vw > vh ? disp_sm : disp_lg * 1.5;
  let dispY = vw > vh ? disp_lg : disp_sm;
  // let dis = (windowX * windowY) / 2500;
  let dis = 80;
  // mouseX = (e.clientX / windowX) * (windowX / windowY) * dispX - 1;
  // mouseY = (e.clientY / windowY) * (windowX / windowY) * dispY + 1;

  mouseX = (e.clientX / windowX) * dis - dis / 2;
  mouseY = (e.clientY / windowY) * dis - dis / 2;

  console.log("🚀 ~ onMouseMove ~ e.clientX:", e.clientX);
  console.log("🚀 ~ onMouseMove ~ mouseX:", mouseX);

  gsap.to(".fc-near", {
    duration: 1,
    x: mouseX * 1,
    y: mouseY * 1,
    ease: "power2.out",
  });

  gsap.to(".fc-far", {
    duration: 1,
    x: mouseX * 0.75,
    y: mouseY * 0.75,
    ease: "power2.out",
  });
}

// ! WINDOW RESIZE
function onWindowResize() {
  vw = window.innerWidth;
  vh = window.innerHeight;
}

function gsapAnimate() {
  console.log("GSAP");
}
