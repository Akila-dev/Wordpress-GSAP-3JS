import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

// const model_file =
//   "https://mk09reolgs-staging.wpdns.site/wp-content/uploads/2025/02/rocket.glb";
const particle_shape = "./assets/circle.png";
var particles_color = "#000000";
var no_of_partices = 300 * 3;

const canvas = document.querySelector("#canvas_3d");
var renderer, camera, scene;
var dLight;

let camera_aspect = canvas.clientWidth / canvas.clientHeight;
let windowX = canvas.clientWidth;
let windowY = canvas.clientHeight;

var particlesMesh, particlesGroup, particlesWrapper, posArray;
var asteroidsMesh, asteroidsGroup, asteroidsWrapper;

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

init();
initParticles();
initAsteroids();
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
  camera = new THREE.PerspectiveCamera(45, camera_aspect, 1, 1000);
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
// ! INITIATE 3D MESHES AND GROUPS START
// ! INITIATE 3D MESHES AND GROUPS START

// * ASTEROIDS
// * ASTEROIDS
function initAsteroids() {
  // // Instantiate a loader
  // const loader = new GLTFLoader();
  // // Optional: Provide a DRACOLoader instance to decode compressed mesh data
  // const dracoLoader = new DRACOLoader();
  // dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
  // loader.setDRACOLoader(dracoLoader);
  // // Load a glTF resource
  // loader.load(
  //   // resource URL
  //   model_file,
  //   // called when the resource is loaded
  //   function (gltf) {
  //     const model = gltf.scene;
  //     animateAsteroids(model);
  //   },
  //   // called while loading is progressing
  //   function (xhr) {
  //     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  //   },
  //   // called when loading has errors
  //   function (error) {
  //     console.log("An error happened", error);
  //   }
  // );
}

// * PARTICLES
// * PARTICLES
function initParticles() {
  var distance = Math.min(100, canvas.clientWidth / 1);

  posArray = new Float32Array(no_of_partices);

  for (var i = 0; i < no_of_partices; i += 3) {
    var theta = THREE.MathUtils.randFloatSpread(360);
    var phi = THREE.MathUtils.randFloatSpread(360);

    posArray[i] = distance * Math.sin(theta) * Math.sin(phi);
    posArray[i + 1] = distance * Math.sin(theta) * Math.cos(phi);
    posArray[i + 2] = distance * Math.cos(theta);
  }

  // *GEOMETRY
  var geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

  // * MATERIAL
  const loader = new THREE.TextureLoader();
  const particleTexture = loader.load(particle_shape);

  const material = new THREE.PointsMaterial({
    color: particles_color,
    size: 0.75,
    map: particleTexture,
    transparent: true,
    opacity: 0.9,
    depthTest: false,
  });

  // * MESH
  particlesMesh = new THREE.Points(geometry, material);
  particlesMesh.scale.set(1, 1, 1);

  // * GROUP
  particlesGroup = new THREE.Group();
  particlesGroup.add(particlesMesh);

  // * WRAPPER
  particlesWrapper = new THREE.Group();
  particlesWrapper.position.set(0, -200, 0);
  particlesWrapper.add(particlesGroup);

  scene.add(particlesWrapper);
  animateParticles();
}
// ! INITIATE 3D MESHES AND GROUPS END
// ! INITIATE 3D MESHES AND GROUPS END
// ! INITIATE 3D MESHES AND GROUPS END
// ! INITIATE 3D MESHES AND GROUPS END
// ! INITIATE 3D MESHES AND GROUPS END
// ! INITIATE 3D MESHES AND GROUPS END

// ! ANIMATION 3D ELEMENTS START
// ! ANIMATION 3D ELEMENTS START
// ! ANIMATION 3D ELEMENTS START
// ! ANIMATION 3D ELEMENTS START
// ! ANIMATION 3D ELEMENTS START

// * ASTEROIDS ANIMATION
// * ASTEROIDS ANIMATION
function animateAsteroids(mesh) {
  console.log(mesh);

  // var props = {
  //   scale: 1,
  //   xRot: 0,
  //   yRot: 0,
  //   zRot: 0,
  //   yPos: -450,
  // };

  // gsap.registerPlugin(ScrollTrigger);

  // const st = gsap.timeline({
  //   // yes, we can add it to an entire timeline!
  //   scrollTrigger: {
  //     trigger: "#gsap_particles-trigger",
  //     start: "top bottom",
  //     end: "bottom top",
  //     scrub: true,
  //   },
  // });

  // st.to(props, {
  //   yPos: 450,

  //   onUpdate: function () {
  //     particlesWrapper.position.set(0, props.yPos, 0);
  //   },
  // });
}

// * PARTICLES ANIMATION
// * PARTICLES ANIMATION
function animateParticles() {
  var props = {
    scale: 1,
    xRot: 0,
    yRot: 0,
    zRot: 0,
    yPos: -50,
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
      particlesGroup.rotation.set(props.xRot, props.yRot, props.zRot);
    },
  });

  gsap.registerPlugin(ScrollTrigger);

  const st = gsap.timeline({
    // yes, we can add it to an entire timeline!
    scrollTrigger: {
      trigger: "#gsap_particles-trigger",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });

  // st.to(props, {
  //   yPos: 50,

  //   onUpdate: function () {
  //     particlesWrapper.position.set(0, props.yPos, 0);
  //   },
  // });
}
// ! ANIMATION 3D ELEMENTS END
// ! ANIMATION 3D ELEMENTS END
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
  windowX = canvas.clientWidth;
  windowY = canvas.clientHeight;
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
