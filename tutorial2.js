import * as THREE from "three";
import ThreeGlobe from "https://esm.sh/three-globe?external=three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import countries from "./assets/custom.geo.json" with { type: "json" };
import lines from "./assets/lines.json" with { type: "json" };
import map from "./assets/map.json" with { type: "json" };

const canvas = document.querySelector("#globe-canvas");
var renderer, camera, scene, controls;

let mouseX = 0;
let mouseY = 0;
let windowHalfX = canvas.clientWidth / 2;
let windowHalfY = canvas.clientHeight / 2;
var Globe;

init();
initGlobe();
onWindowResize();
animate();

// ! INIT
function init() {
  // * RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setPixelRatio(window.devicePixelRatio);

  //   * SCENE
  scene = new THREE.Scene();

  //  * CAMERA
  camera = new THREE.PerspectiveCamera();
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  camera.position.z = 400;
  camera.position.x = 0;
  camera.position.y = 0;

  scene.add(camera);
  scene.fog = new THREE.Fog(0xeff8fb, 405, 2000);

  //   * LIGHT
  var ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);
  scene.background = new THREE.Color(0xffffff);

  var dLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dLight.position.set(-800, 1000, 400);
  camera.add(dLight);

  var dLight2 = new THREE.DirectionalLight(0x7582f6, 1);
  dLight2.position.set(-200, 500, 200);
  camera.add(dLight2);

  var dLight3 = new THREE.PointLight(0xeff8fb, 0.5);
  dLight3.position.set(-200, 500, 200);
  camera.add(dLight3);

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
function initGlobe() {
  Globe = new ThreeGlobe({
    waitForGlobeReady: true,
    animate: true,
  })
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.5)
    .hexPolygonColor(()=>"#23485C")
    .showAtmosphere(true)
    .atmosphereColor("#eff8fb")
    .atmosphereAltitude(0.25)

    setTimeout(() => {
      Globe.arcsData(lines.infoPath)
      .arcColor((e)=>{
        return e.status ? "#9cff3c":"#ff4000"
      })
      .arcAltitude((e)=>{
        return e.arcAlt
      })
      .arcStroke((e)=>{
        return e.status ? 0.5:0.3
      })
      .arcDashLength(0.9)
      .arcDashGap(4)
      .arcDashAnimateTime(1000)
      .arcsTransitionDuration(1000)
      .arcDashInitialGap((e)=>e.order * 1)

      .labelsData(map.points)
      .labelColor(()=>"#ff0000")
      .labelDotRadius(0.3)
      .labelSize((e)=>e.size)
      .labelResolution(6)
      .labelAltitude(0.01)
      .pointsData(map.points)
      .pointColor(()=>"#ff0000")
      .pointsMerge(true)
      .pointAltitude(0.07)
      .pointRadius(0.05)
    }, 1000)

  //  * GLOBE ROTATION
  Globe.rotateY(-Math.PI * (5 / 9));
  Globe.rotateZ(-Math.PI / 6);

  //  * GLOBE MATERIAL
  const globeMaterial = Globe.globeMaterial();
  globeMaterial.color = new THREE.Color(0xe6e9eb);
  globeMaterial.emissive = new THREE.Color(0xeff8fb);
  globeMaterial.emissiveIntensity = 0.5;
  globeMaterial.shininess = 0.7;

  scene.add(Globe);
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

  camera.position.x +=
    Math.abs(mouseX) <= windowHalfX / 2
      ? (mouseX / 2 - camera.position.x) * 0.005
      : 0;
  camera.position.y += (-mouseY / 2 - camera.position.y) * 0.005;
  camera.lookAt(scene.position);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
