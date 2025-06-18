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
  const p_split = new SplitType("#floating-cards-section p");

  // ! INIT FLOATING CARDS
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#floating-cards-section",
      start: "top bottom",
      end: "bottom bottom-=50%",
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
    onStart: function () {
      document.getElementById("floating-card-sticky").classList.add("fc-far");
    },
  })
    .from(
      ".floating-cards-scene",
      {
        y: "50vh",
      },
      "<"
    )
    .from(
      ".floating-cards-text-container-1 h1 .word",
      {
        opacity: 0,
        yPercent: 100,
        stagger: 0.05,
      },
      "<+=75%"
    )
    .from(
      ".floating-cards-text-container-1 .btn-grad",
      {
        opacity: 0,
        yPercent: 100,
      },
      ">"
    )
    .to(".floating-cards-text-container-1 h1 .word", {
      opacity: 0,
      yPercent: -100,
      stagger: 0.05,
      delay: 1,
    })
    .to(
      ".floating-cards-text-container-1 .btn-grad",
      {
        opacity: 0,
        yPercent: -100,
      },
      ">"
    );

  // ! FLOATING CARDS SCROLL TRIGGER
  let st = gsap.timeline({
    scrollTrigger: {
      trigger: "#floating-cards-section",
      start: "top top",
      end: "top top-=250%",
      scrub: 1,
      // pin: true,
      pin: "#floating-cards-section",
    },
  });

  st.set(".floating-card", {
    opacity: 1,
    onUpdate: function () {
      document.getElementById("floating-card-sticky").classList.add("fc-far");
    },
  })
    .to(".floating-card", {
      opacity: 0.1,
      duration: 3,
    })
    .to(
      ".floating-card-sticky",
      {
        scale: 1.1,
        opacity: 1,
        duration: 1,
        onStart: function () {
          document
            .getElementById("floating-card-sticky")
            .classList.remove("fc-far");
        },
      },
      "<"
    )
    .to(".floating-card", {
      opacity: 0,
      y: "-50vh",
      duration: 1,
    })
    .to(".floating-card-sticky", {
      scale: 2,
      x: window.innerWidth > window.innerHeight ? "-55vw" : "-20%",
      y: window.innerWidth > window.innerHeight ? "25vh" : "2vh",
      duration: 1,
    })
    .to(".floating-cards-text-container-2 h1 .word", {
      opacity: 1,
      yPercent: 0,
      stagger: 0.05,
    })
    .to(".floating-cards-text-container-2 p .line", {
      opacity: 1,
      yPercent: 0,
      stagger: 0.05,
    });

  window.addEventListener("resize", onWindowResize, false);
  window.addEventListener("mousemove", onMouseMove);
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
