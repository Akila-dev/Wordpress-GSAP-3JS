import * as THREE from "three";
import ThreeGlobe from "https://esm.sh/three-globe?external=three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import countries from "./assets/custom.geo.json" with { type: "json" };
import map from "./assets/map.json" with { type: "json" };
// import lines from "./assets/lines.json" with { type: "json" };

const canvas = document.querySelector("#globe-canvas");
var renderer, camera, scene, controls;

var Globe;

const N = 12
const lines = [...Array(N).keys()].map((i) => {
  const from = Math.round(Math.random() * (map.points.length-1))
  const initTo = Math.round(Math.random() * (map.points.length-1))
  const to = from !== initTo ? initTo : Math.round(Math.random() * (map.points.length-1))

  const p1 = [map.points[from].lat, map.points[from].lng]
  const p2 = [map.points[to].lat, map.points[to].lng]

  const p1Int = [Number(map.points[from].lat), Number(map.points[from].lng)]
  const p2Int = [Number(map.points[to].lat), Number(map.points[to].lng)]

  return ({
      type: "infoFlow",
      order: 1,
      from: map.points[from].text,
      to: map.points[to].text,
      startLat: p1[0],
      startLng: p1[1],
      endLat: p2[0],
      endLng: p2[1],
      arcDashInitialGap: (Math.random()*15),
      arcDashGap: (Math.random()*15) + 2,
      arcColor: ["#70BB40","#70BB40","#70BB40","#70BB40"][Math.round(Math.random() * 3)]
      // distance: Math.acos(Math.sin(p1Int[0])*Math.sin(p2Int[0]) + Math.cos(p1Int[0])*Math.cos(p2Int[0])*Math.cos(Math.abs(p1Int[1]-p2Int[1]))),
      // arcAlt: String(Math.sin(Math.acos(Math.sin(p1Int[0])*Math.sin(p2Int[0]) + Math.cos(p1Int[0])*Math.cos(p2Int[0])*Math.cos(Math.abs(p1Int[1]-p2Int[1]))))/5)
  })
});
console.log(lines)

const gData = [...Array(map.points.length).keys()].map((i) => ({
  lat: map.points[i].lat,
  lng: map.points[i].lng,
  maxR: 2,
  propagationSpeed: (Math.random() - 0.5) * 20 + 1,
  repeatPeriod: Math.random() * 2000 + 200,
}));



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

  camera.position.z = 300;
  camera.position.x = 0;
  camera.position.y = 0;

  scene.add(camera);
  scene.fog = new THREE.Fog(0xeff8fb, 405, 2000);

  //   * LIGHT
  var ambientLight = new THREE.AmbientLight(0xeff8fb);
  scene.add(ambientLight);
  scene.background = new THREE.Color(0xffffff);

  var dLight = new THREE.DirectionalLight(0xeff8fb, 0.8);
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
  controls.minDistance = 280;
  controls.maxDistance = 300;
  controls.rotateSpeed = 0.8;
  controls.autoRotateSpeed = 0.4;
  controls.zoomSpeed = 0.1;
  controls.autoRotate = true;

  controls.minPolarAngle = Math.PI / 3.5;
  controls.maxPolarAngle = (Math.PI * Math.PI) / 3;

  window.addEventListener("resize", onWindowResize, false);
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

      // .ringsData(gData)
      // .ringColor(() => "#fff000")
      // .ringMaxRadius("maxR")
      // .ringPropagationSpeed("propagationSpeed")
      // .ringRepeatPeriod("repeatPeriod");

    setTimeout(() => {
      Globe.arcsData(lines)
      .arcColor((e)=>{
        return e.arcColor
      })
      .arcStroke((e)=>{
        return 0.3
      })
      .arcAltitudeAutoScale(0.4)
      .arcDashLength(1.5)
      .arcDashGap((e)=>{
        return e.arcDashGap
      })
      .arcDashInitialGap((e)=>{
        return e.arcDashInitialGap
      })
      .arcDashAnimateTime(2000)
      .arcsTransitionDuration(0)

      // .labelsData(map.points)
      // .labelColor((e)=>{
      //   return e.status ? "#009FD6":"#70BB40"
      // })
      .labelDotRadius(0.3)
      // .labelSize((e)=>e.size)
      // .labelResolution(6)
      // .labelAltitude(0.01)
      // .pointsData(map.points)
      // .pointColor((e)=>{
      //   return e.status ? "#009FD6":"#70BB40"
      // })
      // .pointsMerge(true)
      // .pointAltitude(0.07)
      // .pointRadius(0.05)
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
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
