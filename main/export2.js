import * as THREE from "three";
import * as dat from "dat";

const canvas = document.querySelector("#globe-canvas");
var renderer, camera, scene, controls, texture_loader, dLight;

let mouseX = 0;
let mouseY = 0;
let camera_aspect = canvas.clientWidth / canvas.clientHeight;
let windowHalfX = canvas.clientWidth / 2;
let windowHalfY = canvas.clientHeight / 2;

var particlesMesh, particlesGroup, particlesScale;
var morphingMesh, morphingGroup;
var spherePosArray, flatSpherePosArray;

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

init();
initParticles();
initMorphingParticles();
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

  window.addEventListener("resize", onWindowResize, false);
  window.addEventListener("mousemove", onMouseMove);
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

function initMorphingParticles() {
  // * GEOMETRY POINTS FOR MODEL
  var no_of_partices = 10000 * 3;
  var distance = Math.min(140, canvas.clientWidth / 3);

  spherePosArray = new Float32Array(no_of_partices);
  flatSpherePosArray = new Float32Array(no_of_partices);

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

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(spherePosArray, 3)
  );

  // * MATERIAL
  const material = new THREE.PointsMaterial({
    color: "white",
    size: 2,
    // depthTest: false,
  });

  // * MESH
  morphingMesh = new THREE.Points(geometry, material);
  morphingMesh.rotation.set(degToRad(-45), 0, degToRad(90));
  morphingMesh.position.set(0, 0, 0);
  morphingMesh.scale.set(1, 1, 1);
  morphingMesh.name = "Morphing Mesh";

  // * GROUP
  morphingGroup = new THREE.Group();
  morphingGroup.add(morphingMesh);
  morphingGroup.name = "Morphing Group";

  scene.add(morphingGroup);
  gsapAnimate();
}

// ! MOUSE TRIGGER
function onMouseMove(e) {
  mouseX = (e.clientX / windowHalfX) * 0.2 - 1;
  mouseY = (e.clientY / windowHalfY) * 0.2 + 1;

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

  if (morphingMesh) {
    tl.to(morphingProps, {
      scale: 1,
      xRot: degToRad(0),
      yRot: degToRad(0),
      zRot: degToRad(0),
      duration: 1,
      ease: "power2",
      onUpdate: function () {
        morphingMesh.scale.set(
          morphingProps.scale,
          morphingProps.scale,
          morphingProps.scale
        );
        morphingMesh.rotation.set(
          morphingProps.xRot,
          morphingProps.yRot,
          morphingProps.zRot
        );
      },
    })
      .to(
        morphingMesh.geometry.attributes.position.array,
        {
          endArray: flatSpherePosArray,
          duration: 4,
          ease: "power2.out",
          onUpdate: () => {
            morphingMesh.geometry.attributes.position.needsUpdate = true;
            camera.lookAt(morphingMesh.position);
            renderer.render(scene, camera);
          },
        },
        "<"
      )
      .to(
        morphingProps,
        {
          scale: 1,
          xRot: degToRad(-45),
          yRot: degToRad(0),
          zRot: degToRad(0),
          xPos: 0,
          yPos: 0,
          zPos: -150,
          duration: 2,
          ease: "power2.in",
          onUpdate: function () {
            morphingMesh.rotation.set(
              morphingProps.xRot,
              morphingProps.yRot,
              morphingProps.zRot
            );
            morphingMesh.position.set(
              morphingProps.xPos,
              morphingProps.yPos,
              morphingProps.zPos
            );
          },
        },
        ">-2"
      );
  }
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
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
