import * as THREE from "three";
import * as dat from "dat";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const canvas = document.querySelector("#globe-canvas");
var renderer, camera, scene, controls, rocket, planet, model;

let mouseX = 0;
let mouseY = 0;
let camera_aspect = canvas.clientWidth / canvas.clientHeight;
let windowHalfX = canvas.clientWidth / 2;
let windowHalfY = canvas.clientHeight / 2;

init();
initModel();
initGUI();
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
  camera = new THREE.PerspectiveCamera(23, camera_aspect, 0.1, 100);
  camera.updateProjectionMatrix();

  camera.position.x = 4.1;
  camera.position.y = 2.8;
  camera.position.z = 3.9;

  scene.add(camera);
  scene.fog = new THREE.Fog(0xeff8fb, 405, 2000);

  //   * LIGHT
  var ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  var dLight = new THREE.DirectionalLight(0xffffff, 1000);
  dLight.position.set(-1, 2, 4);
  camera.add(dLight);

  //   * CONTROLS
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dynamicDampingFactor = 0.01;
  controls.enablePan = false;
  controls.minDistance = 200;
  controls.maxDistance = 500;
  controls.rotateSpeed = 0.8;
  controls.zoomSpeed = 1;
  controls.autoRotate = false;

  controls.minPolarAngle = Math.PI / 3.5;
  controls.maxPolarAngle = (Math.PI * Math.PI) / 3;

  window.addEventListener("resize", onWindowResize, false);
  window.addEventListener("mousemove", onMouseMove);
}

// ! GLOBE
function initModel() {
  // Instantiate a loader
  const loader = new GLTFLoader();

  // Optional: Provide a DRACOLoader instance to decode compressed mesh data
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
  loader.setDRACOLoader(dracoLoader);

  // Load a glTF resource
  loader.load(
    "models/scene.glb",
    // called when the resource is loaded
    function (gltf) {
      console.log(gltf);
      gltf.scene.scale.set(10.0, 10.0, 10.0);
      scene.add(gltf.scene.children[0]);
    },
    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      console.log("An error happened");
    }
  );
}

function initGUI() {
  const gui = new dat.GUI();

  if (camera) {
    // Plane GUI
    const cameraGUI = gui.addFolder("Camera Position");
    cameraGUI.add(camera.position, "x").min(0).max(15);
    cameraGUI.add(camera.position, "y").min(0).max(15);
    cameraGUI.add(camera.position, "z").min(0).max(15);
    cameraGUI.open();
  }
}

// ! MOUSE TRIGGER
function onMouseMove(e) {
  mouseX = e.clientX - windowHalfX;
  mouseY = e.clientY - windowHalfY;
}

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
  windowHalfX = canvas.clientWidth / 2;
  windowHalfY = canvas.clientHeight / 2;
}

// ! ANIMATE
function animate() {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  // camera.position.x +=
  //   Math.abs(mouseX) <= windowHalfX / 2
  //     ? (mouseX / 2 - camera.position.x) * 0.005
  //     : 0;
  // camera.position.y += (-mouseY / 2 - camera.position.y) * 0.005;
  // camera.lookAt(scene.position);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
