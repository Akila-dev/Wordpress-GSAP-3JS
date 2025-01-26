import * as THREE from "three";
import ThreeGlobe from "https://esm.sh/three-globe?external=three";
import { TrackballControls} from "three/addons/controls/TrackballControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import countries from "./assets/custom.geo.json" with { type: "json" };
import map from "./assets/map.json" with { type: "json" };
// import lines from "./assets/lines.json" with { type: "json" };

import vertexShader from './assets/vertex.js';
import fragmentShader from './assets/fragment.js';

const canvas = document.querySelector("#globe-canvas");
var renderer, camera, scene, controls,tbControls, isGrabbing, map_material, globeMesh;

var Globe;

const colors = ["#70BB40","#009FD6","#23495D","#23485C"]

const N = map.points.length
const lines = [...Array(N).keys()].map((i) => {
  const from = i
  // const from = Math.round(Math.random() * (map.points.length-1))
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
      arcDashGap: (Math.random()*10) + i,
      arcColor: colors[Math.round(Math.random() * (colors.length-1))],
      order: i > 1 ? i - Math.random() : i
      // distance: Math.acos(Math.sin(p1Int[0])*Math.sin(p2Int[0]) + Math.cos(p1Int[0])*Math.cos(p2Int[0])*Math.cos(Math.abs(p1Int[1]-p2Int[1]))),
      // arcAlt: String(Math.sin(Math.acos(Math.sin(p1Int[0])*Math.sin(p2Int[0]) + Math.cos(p1Int[0])*Math.cos(p2Int[0])*Math.cos(Math.abs(p1Int[1]-p2Int[1]))))/5)
  })
});
console.log(lines)

const gData = [...Array(map.points.length).keys()].map((i) => ({
  lat: map.points[i].lat,
  lng: map.points[i].lng,
  maxR: 2,
  propagationSpeed: 1,
  repeatPeriod: 1000,
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
  camera.position.y = 100;

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
  controls.autoRotateSpeed = 1;
  controls.zoomSpeed = 0.1;
  controls.autoRotate = true;

  controls.minPolarAngle = Math.PI / 3.5;
  controls.maxPolarAngle = Math.PI - Math.PI / 3;

  // tbControls = new TrackballControls(camera, renderer.domElement);
  // tbControls.minDistance = 101;
  // tbControls.rotateSpeed = 5;
  // tbControls.zoomSpeed = 0.8;

  window.addEventListener("resize", onWindowResize, false);  
  window.addEventListener("mousedown", onMouseDown);
  // window.addEventListener("mousemove", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
}

function onMouseDown(e){
  isGrabbing = true
  console.log(isGrabbing)
}

function onMouseUp(e){
  isGrabbing = false
  console.log(isGrabbing)
}



// ! GLOBE
function initGlobe() {
  // map_material = new THREE.MeshBasicMaterial({
  //   map: new THREE.TextureLoader().load(),
  //   transparent: true
  // })
  // let  map_texture = new THREE.TextureLoader().load()
  // let  bmap = new THREE.TextureLoader().load()
  // let  dmap = new THREE.TextureLoader().load()

  // map_material = new THREE.MeshBasicMaterial({
  //   bumpMap:bmap,
  //   bumpScale:1.3,
  //   displacementMap:dmap,
  //   displacementScale:5,
  //   map: map_texture,
  //     // transparent: true
  //   })

  map_material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uDisplace: { value: 2 },
      uSpread: { value: 1.2 },
      uNoise: { value: 16 },
    },
  })

 

  Globe = new ThreeGlobe({
    waitForGlobeReady: true,
    animate: true,
  })
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.5)
    .showAtmosphere(true)
    .atmosphereColor("#eff8fb")
    .atmosphereAltitude(0.25)
    .hexPolygonColor(()=> {return isGrabbing ? "#23485C" : "#23485Caa"})

    // .ringsData(gData)
    // .ringColor(() => "#23485C")
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
      .arcDashLength(2)
      .arcDashGap((e)=>{
        return e.arcDashGap
      })
      .arcDashAnimateTime(1000)
      .arcsTransitionDuration(0)
      .arcDashInitialGap((e) => e.order * 1)

      .labelsData(map.points)
      .labelColor(() => colors[Math.round(Math.random() * 3)])
      .labelDotRadius(0.4)
      .labelSize((e) => 0)
      .labelResolution(6)
      .labelAltitude(0)

      // .pointsData(map.points)
      // .pointColor(() => "#23485C")
      // .pointsMerge(true)
      // .pointAltitude(0.07)
      // .pointRadius(0.05);
    }, 3000);

  //  * GLOBE ROTATION
  Globe.rotateY(-Math.PI * (5 / 9));
  Globe.rotateZ(-Math.PI / 6);

  gsap.from(Globe.scale, { duration: 2, x: 0.7 })
  gsap.from(Globe.scale, { duration: 2, y: 0.7 })
  gsap.from(Globe.scale, { duration: 2, z: 0.7 })
  gsap.to(Globe.rotation, { duration: 2, y: 1 })
  gsap.to(Globe.rotation, { duration: 2, z: 0.2 })
  

  //  * GLOBE MATERIAL
  const globeMaterial = Globe.globeMaterial();
  // globeMaterial.bumpScale = 10;
  globeMaterial.color = new THREE.Color(0xe6e9eb);
  globeMaterial.emissive = new THREE.Color(0xeff8fb);
  globeMaterial.emissiveIntensity = 0.45;
  globeMaterial.shininess = 1;

  // globeMaterial.customDepthMaterial = map_material

  // globeMesh = new THREE.Mesh(
  //   new THREE.TorusGeometry(1, 0.3, 100, 100),
  //   new THREE.ShaderMaterial({
  //     vertexShader,
  //     fragmentShader,
  //     side: THREE.DoubleSide,
  //     uniforms: {
  //       uTime: { value: 0 },
  //       uResolution: { value: new THREE.Vector2() },
  //       uDisplace: { value: 2 },
  //       uSpread: { value: 1.2 },
  //       uNoise: { value: 16 },
  //     },
  //   })
  // );

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

  Globe.hexPolygonColor(()=> {return isGrabbing ? "#23485C" : "#23485Caa"})

  camera.lookAt(scene.position);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
