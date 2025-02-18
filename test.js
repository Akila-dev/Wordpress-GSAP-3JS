import * as THREE from "three";
import * as dat from "dat";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";

const model_file = "./models/scene3.glb";
const canvas = document.querySelector("#globe-canvas");
var renderer, camera, scene, controls, texture_loader;
var dLight;

let mouseX = 0;
let mouseY = 0;
let camera_aspect = canvas.clientWidth / canvas.clientHeight;
let windowX = canvas.clientWidth;
let windowY = canvas.clientHeight;

var particlesMesh, particlesGroup, particlesScale;
var morphingMesh, morphingGroup;
var shipPosArray, shipPosArray2, spherePosArray, flatSpherePosArray;

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

init();
initModel();
initParticles();
initGUI();
onWindowResize();
animate();
gsapAnimate();

// ! INIT
function init() {
  texture_loader = new THREE.TextureLoader();

  // * RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);

  //   * SCENE
  scene = new THREE.Scene();

  //  * CAMERA
  camera = new THREE.PerspectiveCamera(75, camera_aspect, 0.1, 2000);
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

// ! MODEL
function initModel() {
  // Instantiate a loader
  const loader = new GLTFLoader();
  // Optional: Provide a DRACOLoader instance to decode compressed mesh data
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
  loader.setDRACOLoader(dracoLoader);
  // Load a glTF resource
  loader.load(
    // resource URL
    model_file,
    // called when the resource is loaded
    function (gltf) {
      const model = gltf.scene;
      model.position.set(0, -150, 0);
      model.name = "Ship";
      // scene.add(model);
      console.log("🚀 ~ initModel ~ model:", model);

      var ship_array = [];

      // GET POSITIONS FROM THE MODEL
      gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
          const vertices = obj.geometry.attributes.position;
          var sampler = new MeshSurfaceSampler(obj).build();
          for (let i = 0; i < vertices.count; i++) {
            const sample = new THREE.Vector3();
            sampler.sample(sample);

            ship_array.push(sample.x);
            ship_array.push(sample.y);
            ship_array.push(sample.z);
          }
        }
      });

      initMorphingParticles(ship_array);
    },
    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      console.log("An error happened", error);
    }
  );
}

// ! PARTICLES
function initParticles() {
  var distance =
    window.innerHeight > window.innerWidth
      ? Math.min(200, canvas.clientHeight / 2)
      : Math.min(200, canvas.clientWidth / 4);

  // * GEOMETRY
  var geometry = new THREE.BufferGeometry();
  const no_of_partices = 300;
  const posArray = new Float32Array(no_of_partices * 3);

  for (var i = 0; i < no_of_partices * 3; i++) {
    posArray[i] = distance * (Math.random() - 0.5) * 15;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

  // * MATERIAL
  const material = new THREE.PointsMaterial({
    color: "white",
    size: 8,
    side: THREE.DoubleSide,
    // depthTest: false,
  });

  // * MESH
  particlesMesh = new THREE.Points(geometry, material);
  // particlesMesh.boundingSphere = 50;

  // * GROUP
  particlesGroup = new THREE.Group();
  particlesGroup.add(particlesMesh);

  particlesScale = new THREE.Group();
  particlesScale.add(particlesGroup);

  scene.add(particlesScale);
}

function initMorphingParticles(model_array) {
  // * GEOMETRY POINTS FOR MODEL
  var no_of_partices = model_array.length;
  var distance = Math.min(140, canvas.clientWidth / 3);

  shipPosArray = new Float32Array(no_of_partices);
  shipPosArray2 = new Float32Array(no_of_partices);
  spherePosArray = new Float32Array(no_of_partices);
  flatSpherePosArray = new Float32Array(no_of_partices);

  for (let i = 0; i < no_of_partices; i++) {
    shipPosArray[i] = model_array[i];
  }

  for (var i = 0; i < no_of_partices; i += 3) {
    var theta = THREE.MathUtils.randFloatSpread(360);
    var phi = THREE.MathUtils.randFloatSpread(360);

    spherePosArray[i] = distance * Math.sin(theta) * Math.sin(phi);
    spherePosArray[i + 1] = distance * Math.sin(theta) * Math.cos(phi);
    spherePosArray[i + 2] = distance * Math.cos(theta);
  }

  for (var i = 0; i < no_of_partices; i += 3) {
    var theta = THREE.MathUtils.randFloatSpread(360);
    var phi = THREE.MathUtils.randFloatSpread(360);

    flatSpherePosArray[i] = distance * Math.sin(theta) * Math.cos(phi * 5);
    flatSpherePosArray[i + 1] = distance * Math.sin(theta) * Math.sin(phi) * 5;
    flatSpherePosArray[i + 2] = distance * Math.cos(theta) * 5;
  }

  // *GEOMETRY
  var geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.BufferAttribute(shipPosArray, 3));

  // * MATERIAL
  const material = new THREE.PointsMaterial({
    color: "white",
    size: 2,
    // depthTest: false,
  });

  // * MESH
  morphingMesh = new THREE.Points(geometry, material);
  morphingMesh.rotation.set(degToRad(-90), 0, degToRad(0));
  morphingMesh.position.set(0, 50, -50);
  morphingMesh.scale.set(1, 1, 1);
  morphingMesh.name = "Morphing Mesh";

  // * GROUP
  morphingGroup = new THREE.Group();
  morphingGroup.add(morphingMesh);
  morphingGroup.name = "Morphing Group";

  scene.add(morphingGroup);
  gsapAnimate();
}

function initGUI() {
  const gui = new dat.GUI();

  if (camera) {
    // Plane GUI
    const cameraGUI = gui.addFolder("Camera Position");
    cameraGUI.add(camera.position, "x").min(0).max(1000);
    cameraGUI.add(camera.position, "y").min(0).max(1000);
    cameraGUI.add(camera.position, "z").min(0).max(1000);
    cameraGUI.open();
  }

  // Light GUI
  const lightGUI = gui.addFolder("DLight");
  lightGUI.add(dLight.position, "x").min(-500).max(500);
  lightGUI.add(dLight.position, "y").min(-500).max(500);
  lightGUI.add(dLight.position, "z").min(-500).max(500);

  // Light GUI
  // const slightGUI = gui.addFolder("SpotLight");
  // slightGUI.add(sLight.position, "x").min(-500).max(500);
  // slightGUI.add(sLight.position, "y").min(-500).max(500);
  // slightGUI.add(sLight.position, "z").min(-500).max(500);
}

// ! MOUSE TRIGGER
function onMouseMove(e) {
  mouseX = (e.clientX / windowX) * 0.4 - 1;
  mouseY = (e.clientY / windowY) * 0.4 + 1;

  gsap.to(particlesMesh.rotation, {
    duration: 1.5,
    x: mouseY * -1,
    y: mouseX,
    ease: "power.in",
  });
}

// ! ANIMATION WITH GSAP
function gsapAnimate() {
  var props = {
    scale: 1,
    xRot: 0,
    yRot: 0,
    zRot: 0,
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

  const tl = gsap.timeline();

  let morphingProps = {
    scale: 0,
    xPos: 0,
    yPos: 0,
    zPos: 0,
    xRot: 0,
    yRot: 0,
    zRot: 0,
  };

  tl.to(
    morphingProps,
    {
      zRot: degToRad(360),
      duration: 8,
      repeat: -1,
      ease: "none",
      onUpdate: function () {
        morphingMesh.rotation.set(degToRad(-90), 0, morphingProps.zRot);
      },
    },
    ">-1"
  );
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
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
