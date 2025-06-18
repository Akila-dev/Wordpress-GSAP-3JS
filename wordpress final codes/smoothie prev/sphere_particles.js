import * as THREE from "three";

document.addEventListener("DOMContentLoaded", sphere_animation());

function sphere_animation() {
  const particle_shape = "./assets/circle.png";
  // const particle_shape = "https://smoothiecommunicate.com/wp-content/uploads/2025/05/circle.png";
  var particles_color = "#000000";
  const no_of_sphere_instance = 30;

  const canvas = document.getElementById("particle_sphere_canvas");
  var renderer, camera, scene;
  var dLight;

  // var camera_aspect = canvas.clientWidth / canvas.clientHeight;

  var particlesMesh, particlesGroup, particlesWrapper;

  function degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  if (canvas) {
    init();
    initParticles();
    onWindowResize();
    animate();

    // ! INIT
    function init() {
      // * RENDERER
      renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);

      //   * SCENE
      scene = new THREE.Scene();

      //  * CAMERA
      camera = new THREE.PerspectiveCamera(
        75,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        2000
      );
      camera.updateProjectionMatrix();

      camera.position.z = 300;

      scene.add(camera);
      scene.fog = new THREE.Fog(0xeff8fb, 405, 2000);

      //   * LIGHT
      var ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);

      dLight = new THREE.DirectionalLight(0xffffff, 1000);
      dLight.position.set(-1, 2, 200);
      camera.add(dLight);

      window.addEventListener("resize", onWindowResize, false);
    }

    // ! INITIATE 3D MESHES AND GROUPS START
    // ! INITIATE 3D MESHES AND GROUPS START
    // ! INITIATE 3D MESHES AND GROUPS START
    function initParticles() {
      particlesGroup = new THREE.Group();

      // * WRAPPER
      particlesWrapper = new THREE.Group();
      particlesWrapper.position.set(0, 20, 0);
      particlesWrapper.add(particlesGroup);

      scene.add(particlesWrapper);

      // ! INSTANCE OF A PARTICLE SPHERE
      function makeSphereInstance(particles_length, delay = 0, duration = 1.5) {
        const no_of_partices = particles_length * 3;
        var distance = Math.min(160, canvas.clientWidth / 1);

        const posArray = new Float32Array(no_of_partices);

        for (var i = 0; i < no_of_partices; i += 3) {
          var theta = THREE.MathUtils.randFloatSpread(360);
          var phi = THREE.MathUtils.randFloatSpread(360);

          posArray[i] = distance * Math.sin(theta) * Math.sin(phi);
          posArray[i + 1] = distance * Math.sin(theta) * Math.cos(phi);
          posArray[i + 2] = distance * Math.cos(theta);
        }

        // *GEOMETRY
        var geometry = new THREE.BufferGeometry();

        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(posArray, 3)
        );

        // * MATERIAL
        const loader = new THREE.TextureLoader();
        const particleTexture = loader.load(particle_shape);

        const material = new THREE.PointsMaterial({
          color: particles_color,
          size: 0.9,
          map: particleTexture,
          transparent: true,
          opacity: 0.2,
          depthTest: false,
        });

        // * MESH
        particlesMesh = new THREE.Points(geometry, material);
        particlesMesh.scale.set(1, 1, 1);
        blinkParticles(particlesMesh, delay, duration); // Animate the mesh

        // * GROUP
        particlesGroup.add(particlesMesh); // Add the mesh to the group
      }

      // ! FOR LOOP TO GENERATE INSTANCE OF SPHERES
      for (let i = 0; i < no_of_sphere_instance; i++) {
        // const num = Math.ceil(Math.random() * i);
        const num = Math.floor(Math.random() * no_of_sphere_instance);
        const delay = Math.floor((Math.random() * no_of_sphere_instance) / 10);
        const duration = 1;
        makeSphereInstance(num, delay, duration);
      }

      rotateParticles(particlesGroup, particlesWrapper);
    }
    // ! INITIATE 3D MESHES AND GROUPS END
    // ! INITIATE 3D MESHES AND GROUPS END
    // ! INITIATE 3D MESHES AND GROUPS END

    // ! ANIMATION 3D ELEMENTS START
    // ! ANIMATION 3D ELEMENTS START
    // ! ANIMATION 3D ELEMENTS START
    function blinkParticles(mesh, delay = 0, duration = 1.5) {
      var props = {
        opacity: 0.2,
      };

      gsap.to(props, {
        opacity: 1,
        duration: duration,
        delay: delay,
        repeatDelay: 0,
        repeat: -1,
        yoyo: true,
        ease: "none",
        onUpdate: function () {
          mesh.material.opacity = props.opacity;
        },
      });
    }

    function rotateParticles(group, wrapper) {
      var props = {
        xRot: 0,
        yRot: 0,
        zRot: 0,
        wrapperRot: 0,
      };

      gsap.to(props, {
        duration: 200,
        xRot: Math.PI * 0.5,
        yRot: -Math.PI * 3,
        zRot: -Math.PI * 1,
        repeat: -1,
        yoyo: true,
        ease: "none",
        onUpdate: function () {
          group.rotation.set(0, props.yRot, 0);
        },
      });

      // ! SCROLL TRIGGER
      gsap.registerPlugin(ScrollTrigger);
      const st = gsap.timeline({
        // yes, we can add it to an entire timeline!
        scrollTrigger: {
          trigger: "#particle_sphere_canvas",
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
          // markers: true,
        },
      });

      st.to(props, {
        wrapperRot: degToRad(-180),
        onUpdate: function () {
          wrapper.rotation.set(props.wrapperRot, 0, 0);
        },
      });
    }
    // ! ANIMATION 3D ELEMENTS END
    // ! ANIMATION 3D ELEMENTS END
    // ! ANIMATION 3D ELEMENTS END

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }

      return needResize;
    }

    // ! WINDOW RESIZE
    function onWindowResize() {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // ! ANIMATE
    function animate() {
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
  }
}
