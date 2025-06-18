import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

document.addEventListener("DOMContentLoaded", glass_sphere_animation());

function glass_sphere_animation() {
  // const texture_img = "./assets/sph.png";
  const texture_img = "./assets/tex4.png";
  const noise_img = "./assets/noise.png";
  // const env_img = "./assets/tex4.png";
  const env_img = "./assets/env.jpg";
  const canvas = document.getElementById("hero_glass_sphere_canvas");

  // ! HERO SPHERE CONSTANTS
  const hero_sphere_section = document.getElementById(
    "gsap-hero_sphere_section"
  );

  // ! SPHERE CONSTANTS
  const sphere_color = "#8765d9";
  const sphere_emmisive = "#8765d9";
  const sphere_lg = 200;
  const sphere_sm = 150;

  const sphere_props = {
    scale: 1,
    opacity: 1,
    yPos: 0,
  };

  // ! THREE.JS VARIABLES
  var renderer, camera, scene, controls;
  var dLight;

  // var camera_aspect = canvas.clientWidth / canvas.clientHeight;

  var geometry, sphereMesh, sphereGroup, sphereWrapper;

  function degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  if (canvas) {
    init();
    initSphere();
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
      camera = new THREE.OrthographicCamera(
        canvas.clientWidth / -2,
        canvas.clientWidth / 2,
        canvas.clientHeight / 2,
        canvas.clientHeight / -2,
        1,
        1000
      );
      camera.updateProjectionMatrix();

      camera.position.z = 500;

      scene.add(camera);
      scene.fog = new THREE.Fog(0xeff8fb, 405, 2000);

      // const envMap = new THREE.CubeTextureLoader().load(env_imgs);
      // scene.environment = envMap;
      const loader = new THREE.TextureLoader();
      loader.load(env_img, function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.environment = texture;
        scene.background = texture;
      });

      //   * CONTROLS
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dynamicDampingFactor = 0.01;
      controls.enablePan = false;
      controls.minDistance = 200;
      controls.maxDistance = 500;
      controls.rotateSpeed = 0.8;
      controls.zoomSpeed = 1;
      controls.autoRotate = true;

      controls.minPolarAngle = Math.PI / 3.5;
      controls.maxPolarAngle = (Math.PI * Math.PI) / 3;

      //   * LIGHT
      var ambientLight = new THREE.AmbientLight(0x8765d9, 1);
      scene.add(ambientLight);

      dLight = new THREE.DirectionalLight(0xffffff, 1);
      dLight.position.set(0, canvas.clientHeight, 0);
      camera.add(dLight);

      window.addEventListener("resize", onWindowResize, false);
    }

    // * INITIATE 3D MESHES AND GROUPS START
    // * INITIATE 3D MESHES AND GROUPS START
    function initSphere() {
      // ! Create a sphere geometry
      const geometry = new THREE.SphereGeometry(225, 64, 64); // Radius, widthSegments, heightSegments
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(texture_img);

      // texture.encoding = THREE.sRGBEncoding;
      // texture.anisotropy = 16;
      // texture.wrapS = THREE.ClampToEdgeWrapping;
      // texture.wrapT = THREE.ClampToEdgeWrapping;
      // texture.repeat.set(1, 1);
      // texture.magFilter = THREE.LinearFilter;
      // texture.minFilter = THREE.LinearMipMapLinearFilter;
      // texture.flipY = true;
      // texture.flipX = true;

      // Material using the PNG texture
      const material = new THREE.MeshPhysicalMaterial({
        // map: texture, // Your image mapped onto the sphere
        color: sphere_color,
        roughness: 0.5,
        transmission: 0.5, // glass effect
        thickness: 1.0,
        transparent: true,
        opacity: 0.99,
        metalness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 0.5,
      });

      sphereMesh = new THREE.Mesh(geometry, material);

      // * GROUP
      sphereGroup = new THREE.Group();
      sphereGroup.add(sphereMesh); // Add the mesh to the group

      // * WRAPPER
      sphereWrapper = new THREE.Group();
      sphereWrapper.position.set(0, 0, 0);
      sphereWrapper.add(sphereGroup);

      scene.add(sphereWrapper);

      animateHeroSphere(sphereMesh, sphereGroup, sphereWrapper);
    }
    // *  INITIATE 3D MESHES AND GROUPS END
    // *  INITIATE 3D MESHES AND GROUPS END

    // * ANIMATE HERO SPHERE START
    // * ANIMATE HERO SPHERE START
    function animateHeroSphere(mesh, group, wrapper) {
      const rotDuration = 15;
      // gsap
      //   .timeline()
      //   .to(group.rotation, {
      //     duration: rotDuration,
      //     y: degToRad(360),
      //     // z: degToRad(360),
      //     repeat: -1,
      //     ease: "none",
      //   })
      //   .to(
      //     group.rotation,
      //     {
      //       duration: rotDuration * 3,
      //       z: degToRad(360),
      //       repeat: -1,
      //       ease: "none",
      //     },
      //     "<"
      //   );

      // ! SCROLLTRIGGER
      gsap.registerPlugin(ScrollTrigger);

      // gsap.to(mesh.material.uniforms.uDissolve, {
      //   value: 1.0,
      //   ease: "power2.out",
      //   scrollTrigger: {
      //     trigger: hero_sphere_section,
      //     start: "center top",
      //     end: "bottom top",
      //     scrub: true,
      //   },
      // });
    }
    // * ANIMATE HERO SPHERE END
    // * ANIMATE HERO SPHERE END

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
      // camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.left = canvas.clientWidth / -2;
      camera.right = canvas.clientWidth / 2;
      camera.top = canvas.clientHeight / 2;
      camera.bottom = canvas.clientHeight / -2;

      //   if (window.innerWidth > window.innerHeight) {
      //     sphereMesh.geometry = new THREE.IcosahedronGeometry(sphere_lg, 10);
      //   } else {
      //     sphereMesh.geometry = new THREE.IcosahedronGeometry(sphere_sm, 10);
      //   }

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
      controls.update();

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
  }
}
