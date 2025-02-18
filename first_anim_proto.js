import * as THREE from "three";
import * as dat from "dat";
import ThreeGlobe from "https://esm.sh/three-globe?external=three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

import countries from "./assets/custom.geo.json" with { type: "json" };

const logo_full = "./assets/logo_full.png";
const canvas = document.querySelector("#globe-canvas");
var renderer, camera, scene, controls, texture_loader;
var myTween;
var Globe, globeMesh;


let mouseX = 0;
let mouseY = 0;
let camera_aspect = canvas.clientWidth / canvas.clientHeight;
let windowHalfX = canvas.clientWidth / 2;
let windowHalfY = canvas.clientHeight / 2;

var particlesMesh, particlesGroup, particlesScale;
var logoMesh;
var ship, ship_thrusters, thrustBlasts, centerThrust, asteroids,rocket_ship, rocket_ship_container;

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

init();
initGlobe()
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

  var dLight = new THREE.DirectionalLight(0xffffff, 1);
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
function initGlobe() {
  Globe = new ThreeGlobe({
    waitForGlobeReady: true,
    animate: true,
  })
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.5)
    .hexPolygonColor(()=>"#050218")
    .showAtmosphere(true)
    .atmosphereColor("#1d1375")
    .atmosphereAltitude(0.25)  

  //  * GLOBE MATERIAL
  const globeMaterial = Globe.globeMaterial();
  globeMaterial.color = new THREE.Color(0x1d1375);
  globeMaterial.emissive = new THREE.Color(0x1d1375);
  globeMaterial.emissiveIntensity = 0.5;
  globeMaterial.shininess = 0.7;
  globeMaterial.transparent = true;
  globeMaterial.opacity = 1;

  globeMesh = new THREE.Group()
  globeMesh.add(Globe);

  scene.add(globeMesh);
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
    "models/scene2.glb",
    // called when the resource is loaded
    function (gltf) {
      const scale = 0.2;
      let xPos = 0;
      let yPos = -100;
      let zPos = 0;
      const moon = gltf.scene.getObjectByName("Moon");
      const hull = gltf.scene.getObjectByName("Hull");
      const middleBlast = gltf.scene.getObjectByName("Blast1");
      const middleBlast2 = gltf.scene.getObjectByName("Blast2");
      const frontStrut = gltf.scene.getObjectByName("Strut1");
      const rightStrut = gltf.scene.getObjectByName("Strut2");
      const backStrut = gltf.scene.getObjectByName("Strut3");
      const leftStrut = gltf.scene.getObjectByName("Strut4");
      const asteroids1 = gltf.scene.getObjectByName("Asteroids");
      const asteroids2 = gltf.scene.getObjectByName("Asteroids1");
      const strutBlast1 = gltf.scene.getObjectByName("StrutBlast1");
      const strutBlast2 = gltf.scene.getObjectByName("StrutBlast2");
      const strutBlast3 = gltf.scene.getObjectByName("StrutBlast3");
      const strutBlast4 = gltf.scene.getObjectByName("StrutBlast4");

      rocket_ship = new THREE.Group();
      rocket_ship_container = new THREE.Group();

      ship = new THREE.Group();
      ship_thrusters = new THREE.Group();
      centerThrust = new THREE.Group();
      thrustBlasts = new THREE.Group();
      asteroids = new THREE.Group();

      // ! CREATE GROUPS
      // * HULL GROUP
      ship.add(hull);
      ship.position.set(xPos, yPos, zPos);
      ship.scale.set(scale, scale, scale);
      ship.name = "Ship";
      // scene.add(ship);

      // * THRUSTERS GROUP
      ship_thrusters.add(frontStrut);
      ship_thrusters.add(rightStrut);
      ship_thrusters.add(backStrut);
      ship_thrusters.add(leftStrut);
      ship_thrusters.position.set(xPos, yPos, zPos);
      ship_thrusters.scale.set(scale, scale, scale);
      ship_thrusters.name = "Thrusters";
      // scene.add(ship_thrusters);

      // * CENTER BLAST GROUP
      centerThrust.add(middleBlast);
      centerThrust.add(middleBlast2);
      centerThrust.position.set(xPos, yPos, zPos);
      centerThrust.scale.set(scale, scale, scale);
      centerThrust.name = "Main Blaster";
      // scene.add(centerThrust);

      // * SIDE BLAST GROUP
      thrustBlasts.add(strutBlast1);
      thrustBlasts.add(strutBlast2);
      thrustBlasts.add(strutBlast3);
      thrustBlasts.add(strutBlast4);
      thrustBlasts.position.set(xPos, yPos, zPos);
      thrustBlasts.scale.set(scale, scale, scale);
      thrustBlasts.name = "Side Blasters";
      // scene.add(thrustBlasts);

      // * ASTEROIDS GROUP
      asteroids.add(asteroids1);
      asteroids.add(asteroids2);
      asteroids.position.set(xPos, yPos, zPos);
      asteroids.scale.set(scale, scale, scale);
      asteroids.name = "Asteroids";
      // scene.add(asteroids);

      // ! ADJUST GROUP MESHES
      console.log(
        "🚀 ~ initModel ~ centerThrust:",
        centerThrust.getObjectByName("Blast1_Blast_0")
      );
      const shipMeshes = [
        {
          group: ship,
          object: ["Hull_Hull1_0"],
        },
        {
          group: ship_thrusters,
          object: [
            "Strut1_Strut_0",
            "Strut2_Strut_0",
            "Strut3_Strut_0",
            "Strut4_Strut_0",
          ],
        },
        {
          group: centerThrust,
          object: ["Blast1_Blast_0", "Blast2_Blast_0"],
        },
      ];

      shipMeshes.forEach((element) => {
        element.object.forEach((object) => {
          // element.group.getObjectByName(object).material.wireframe = true;
          // element.group.getObjectByName(object).material.color = 0xd6f246;
          // element.group.getObjectByName(object).material.map = null;
        });
      });

      // ! ADD COMPONENTS TO FULL SHIP
      rocket_ship.add(ship);
      rocket_ship.add(ship_thrusters);
      rocket_ship.add(centerThrust);
      rocket_ship.add(thrustBlasts);
      rocket_ship.position.set(0, -100, -300);
      rocket_ship.scale.set(0.1, 0.1, 0.1);
      rocket_ship.name = "Rocket_ship";
      
      rocket_ship_container.add(rocket_ship);
      scene.add(rocket_ship_container);

      // const model = gltf.scene;
      // model.scale.set(scale, scale, scale);
      // // model.position.set(0, -300, 0);
      // model.position.set(x,y,z);
      // scene.add(model);

      // console.log(gltf.scene);
      // console.log(gltf.scene.getObjectByName("Strut1"));
    },
    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      const logo_texture = texture_loader.load(logo_full);

      // * GEOMETRY
      const geometry = new THREE.PlaneGeometry(
        canvas.clientWidth >= 700
          ? canvas.clientWidth / 3
          : canvas.clientWidth / 1.5,
        canvas.clientWidth >= 700
          ? canvas.clientWidth / 11
          : canvas.clientWidth / 5,
        64,
        64
      );

      // * MATERIAL
      const material = new THREE.MeshStandardMaterial({
        map: logo_texture,
        transparent: true,
        opacity: 0.9,
        depthTest: false,
      });

      // * OBJECTS/MESH
      logoMesh = new THREE.Mesh(geometry, material);

      let loading = true;
      let showingLogoMesh = false;

      // function checkLoading() {
      //   if (!showingLogoMesh) {
      //     showingLogoMesh = true;
      //     scene.add(logoMesh);
      //     console.log(xhr);
      //   } else {
      //     console.log("not showing");
      //     if (loading) {
      //       if (xhr.loaded === xhr.total) {
      //         console.log("loaded");
      //         scene.remove(logoMesh);
      //         loading = false;
      //       }
      //     }
      //   }
      // }

      function checkLoading() {
        if (xhr.loaded === xhr.total) {
          console.log(xhr);
          scene.remove(logoMesh);
          logoMesh.geometry.dispose();
          logoMesh.material.dispose();
        } else {
          // scene.add(logoMesh);
        }
      }
      checkLoading();

      // * RENDER
      // if (xhr.loaded !== xhr.total) {
      //   scene.add(logoMesh);
      // } else {
      //   scene.remove(logoMesh);
      // }

      // Animate Opacity
      gsap.from(logoMesh.material, {
        duration: 1.5,
        opacity: 0.3,
        repeat: -1,
        yoyo: true,
        ease: "circ.in",
      });
    },
    // called when loading has errors
    function (error) {
      console.log("An error happened");
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

  // for (var i = 0; i < no_of_partices * 3; i += 3) {
  //   var theta = THREE.MathUtils.randFloatSpread(360);
  //   var phi = THREE.MathUtils.randFloatSpread(360);

  //   posArray[i] = distance * Math.sin(theta) * Math.cos(phi) * 4;
  //   posArray[i + 1] = distance * Math.sin(theta) * Math.sin(phi) * 4;
  //   posArray[i + 2] = distance * (Math.random() - 0.5) * 5;
  // }

  for (var i = 0; i < no_of_partices * 3; i++) {
    posArray[i] = distance * (Math.random() - 0.5) * 15;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

  // * MATERIAL
  const material = new THREE.PointsMaterial({
    color: "white",
    size: 8,
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
}

// ! MOUSE TRIGGER
function onMouseMove(e) {
  mouseX = (e.clientX / windowHalfX) * 0.2 - 1;
  mouseY = (e.clientY / windowHalfY) * 0.2 + 1;

  // gsap.to(particlesMesh.rotation, {
  //   duration: 1.5,
  //   x: mouseY * -1,
  //   y: mouseX,
  //   ease: "power.in",
  // });
}

// ! ANIMATION WITH GSAP
function gsapAnimate() {
  var props = {
    scale: 1,
    xRot: 0,
    yRot: 0,
    zRot: 0,
  };

  // gsap.to(props, {
  //   duration: 10,
  //   scale: 1.3,
  //   repeat: -1,
  //   yoyo: true,
  //   ease: "sine",
  //   onUpdate: function () {
  //     particlesGroup.scale.set(props.scale, props.scale, props.scale);
  //   },
  // });

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
  
  // * GLOBE
  const globeMeshProps = {scale:1, rotation:degToRad(360),z:0}
  var shipProps = {
    xRot: 0,
    yRot:degToRad(0),
    zRot:-degToRad(45),
    xPos:0,
    yPos:-100,
    zPos:-500,
    scale:0.1,
    containerRot:-degToRad(0),

  }
  tl.from(globeMeshProps, {
    scale:0,
    rotation: 0,
    duration: 1,
    ease:"power.out",
    onUpdate: function () {
      globeMesh.scale.set(globeMeshProps.scale, globeMeshProps.scale, globeMeshProps.scale);
      globeMesh.rotation.set(0, globeMeshProps.rotation, 0);
    },
  })
  .to(globeMeshProps, {
    z:-200,
    scale:0,
    rotation: 0,
    duration: 10,
    ease:"power.out",
    onUpdate: function () {
      globeMesh.scale.set(globeMeshProps.scale, globeMeshProps.scale, globeMeshProps.scale);
      globeMesh.position.set(0, 0, globeMeshProps.z);
    },
  })
  .to(shipProps, {
    scale:1,
    xRot: 0,
    yRot:0,
    zRot:-degToRad(45),
    xPos:0,
    yPos:-100,
    zPos:-100,
    containerRot:-degToRad(180),
    duration: 10,
    ease:"power.out",
    onUpdate: function () {
      rocket_ship.scale.set(shipProps.scale, shipProps.scale, shipProps.scale);
      rocket_ship.position.set(shipProps.xPos, shipProps.yPos, shipProps.zPos);
      rocket_ship.rotation.set(shipProps.xRot, shipProps.yRot, shipProps.zRot);
      rocket_ship_container.rotation.set(0, shipProps.containerRot, 0);
    },
  },"<")
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
  camera.lookAt(scene.position);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
