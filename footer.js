document.addEventListener("DOMContentLoaded", footer_sphere_animation());

function footer_sphere_animation() {
  // ! FOOTER SECTION CONSTANTS
  const footer_trigger = document.getElementById("gsap-footer-trigger");
  const footer_sphere = document.getElementById("gsap-footer-sphere");
  const footer_list_section_container = document.getElementById(
    "gsap-footer-list-texts"
  );

  const footer_list_text = footer_list_section_container.querySelectorAll(
    ".gsap-footer-list-texts h1"
  );

  const footer_sphere_section = document.getElementById(
    "gsap-footer_sphere_section"
  );
  const footer_our_mission = footer_sphere_section.querySelectorAll(
    ".gsap-footer-our-mission"
  );
  const text_stagger = 0.1;
  const text_ease = "circ.out";

  //   TEST LIST CONSTANTS
  const tl_scroll_length_1 = 2200;
  const tl_min_opactiy = 0.2;

  // ! INIT VALUES OF TEXT SECTIONS
  const splitText = new SplitType(".gsap-footer-our-mission h1");
  const om_dis = "10vh";

  if (footer_sphere) {
    animateFooterSection();

    // * LIST TEXT ANIMATION START
    // * LIST TEXT ANIMATION START
    function animateFooterSection() {
      gsap.registerPlugin(ScrollTrigger);

      // ! LIST TEXT ANIMATION
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: footer_trigger,
          start: "top top",
          end: "top bottom-=" + tl_scroll_length_1,
          scrub: 1,
          pin: footer_trigger,
          //   markers: true,
        },
        defaults: { duration: 1, ease: "power2.out" },
      });

      gsap.set(footer_list_text, { opacity: tl_min_opactiy });
      gsap.set(".gsap-footer-our-mission h1 .word", {
        opacity: 0,
        y: om_dis,
      });
      gsap.set(".gsap-footer-our-mission .elementor-widget-button", {
        opacity: 0,
        y: om_dis,
      });
      gsap.set(footer_sphere, { yPercent: 100 });

      tl.to(footer_sphere, { yPercent: 95, scale: 1.5 });

      if (footer_list_text && footer_list_text.length > 0) {
        footer_list_text.forEach((text, index) => {
          // if (index === 0) {
          //   tl.set(text, { opacity: 1 }, "<");
          // } else {
          tl.to(
            text,
            {
              opacity: 1,
              // stagger: 0.1,
              ease: text_ease,
            },
            "<"
          );
          // }

          if (index !== footer_list_text.length - 1) {
            tl.to(text, {
              opacity: tl_min_opactiy,
              ease: "power2.in",
            });
          } else {
            tl.to(text, { opacity: 1 });
          }
        });
      }
      tl.to(footer_list_section_container, { yPercent: -100 }).to(
        footer_sphere,
        { yPercent: 0, scale: 2.5 },
        "<"
      );
      if (footer_our_mission && footer_our_mission.length > 0) {
        footer_our_mission.forEach((single, index) => {
          let text = single.querySelectorAll("h1 .word");
          let btn = single.querySelector(".elementor-widget-button");

          tl.to(btn, {
            opacity: 1,
            y: 0,
          })
            .to(text, {
              opacity: 1,
              y: 0,
              stagger: text_stagger,
            })
            .to(btn, {
              opacity: 0,
              y: "-10vh",
            })
            .to(
              text,
              {
                opacity: 0,
                y: "-10vh",
              },
              "<"
            );
        });
      }
      tl.to(footer_sphere, { scale: 1 });
    }
  }
}
