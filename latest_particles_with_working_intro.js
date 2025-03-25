import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";

const model_file = "./models/scene3.glb";
var morphing_particles_color = "#3d2dc8";

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
var shipPosArray, shipPosArraySpread, spherePosArray, flatSpherePosArray;

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

if (!("hasCodeRunBefore" in sessionStorage)) {
  document.body.style.overflow = "hidden";
}

init();
initModel();
initParticles();
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
  window.addEventListener(
    "load",
    function () {
      // Check if the code has been executed before
      if (!("hasCodeRunBefore" in sessionStorage)) {
        // document.body.style.overflow = "hidden";

        setTimeout(() => {
          document.body.style.overflow = "scroll";
          sessionStorage.setItem("hasCodeRunBefore", "true");
          animateText();
        }, 7000);
      } else {
        animateText();
      }
    },
    false
  );
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
  shipPosArraySpread = new Float32Array(no_of_partices);
  spherePosArray = new Float32Array(no_of_partices);
  flatSpherePosArray = new Float32Array(no_of_partices);

  for (let i = 0; i < no_of_partices; i++) {
    shipPosArray[i] = model_array[i];
  }
  for (let i = 0; i < no_of_partices; i++) {
    shipPosArraySpread[i] = model_array[i] * 10;
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

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      sessionStorage.getItem("hasCodeRunBefore")
        ? shipPosArray
        : spherePosArray,
      3
    )
  );

  // * MATERIAL
  const material = new THREE.PointsMaterial({
    color: morphing_particles_color,
    size: 2,
    // depthTest: false,
  });

  // * MESH
  morphingMesh = new THREE.Points(geometry, material);

  if (sessionStorage.getItem("hasCodeRunBefore")) {
    morphingMesh.rotation.set(degToRad(-90), 0, degToRad(0));
    morphingMesh.position.set(0, 50, -50);
    morphingMesh.scale.set(1, 1, 1);
  } else {
    morphingMesh.rotation.set(degToRad(-45), 0, degToRad(90));
    morphingMesh.position.set(0, 0, 0);
    morphingMesh.scale.set(1, 1, 1);
  }
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

  if (morphingMesh) {
    console.log(
      '🚀 ~ gsapAnimate ~ sessionStorage .getItem("hasCodeRunBefore"):',
      sessionStorage.getItem("hasCodeRunBefore")
    );

    const morphTL = gsap.timeline();
    let morphingProps = {
      scale: 0,
      xPos: 0,
      yPos: 0,
      zPos: 0,
      xRot: 0,
      yRot: 0,
      zRot: 0,
    };

    // * LOAD INTO SCREEN
    // * LOAD INTO SCREEN
    // * LOAD INTO SCREEN
    // * LOAD INTO SCREEN
    // * LOAD INTO SCREEN
    // * LOAD INTO SCREEN
    if (sessionStorage.getItem("hasCodeRunBefore")) {
      // IF IT'S NOT THE FIST TIME THAT THE PAGE IS LOADING
      gsap.to(
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
    } else {
      // MORPH FROM SPHERE TO SHIP

      morphTL
        .to(morphingProps, {
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
        )
        .to(
          morphingProps,
          {
            scale: 1,
            xRot: degToRad(-90),
            zRot: degToRad(0),
            yPos: 50,
            duration: 2,
            ease: "power2.out",
            onUpdate: function () {
              morphingMesh.scale.set(
                morphingProps.scale,
                morphingProps.scale,
                morphingProps.scale
              );
              morphingMesh.rotation.set(
                morphingProps.xRot,
                0,
                morphingProps.zRot
              );
              morphingMesh.position.set(0, morphingProps.yPos, 0);
            },
          },
          ">"
        )
        .to(
          morphingMesh.geometry.attributes.position.array,
          {
            endArray: shipPosArray,
            duration: 3,
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

    // * SCROLL TRIGGER ANIMATION
    // * SCROLL TRIGGER ANIMATION
    // * SCROLL TRIGGER ANIMATION
    // * SCROLL TRIGGER ANIMATION
    // * SCROLL TRIGGER ANIMATION
    // * SCROLL TRIGGER ANIMATION
    gsap.registerPlugin(ScrollTrigger);
    const st = gsap.timeline({
      // yes, we can add it to an entire timeline!
      scrollTrigger: {
        trigger: ".canvas-sticky",
        start: "top top",
        end: "+=" + window.innerHeight * 1,
        pin: "#globe-canvas",
        // pin: ".canvas-sticky",
        scrub: true,
        // markers: true,
      },
    });

    let morphingGProps = {
      scale: 0,
      xPos: 0,
      yPos: 0,
      zPos: 0,
      xRot: degToRad(0),
      yRot: degToRad(0),
      zRot: degToRad(degToRad(0)),
    };

    st.set(
      morphingMesh.geometry.attributes.position.array,
      {
        endArray: shipPosArray,
        ease: "power2.out",
        onUpdate: () => {
          morphingMesh.geometry.attributes.position.needsUpdate = true;
          camera.lookAt(morphingMesh.position);
          renderer.render(scene, camera);
        },
      },
      "<"
    )
      .to(morphingGProps, {
        // xPos: 300,
        yPos: 1000,
        zPos: -800,
        // xRot: degToRad(-45),
        // zRot: degToRad(-45),
        onUpdate: function () {
          morphingGroup.position.set(
            morphingGProps.xPos,
            morphingGProps.yPos,
            morphingGProps.zPos
          );
          morphingGroup.rotation.set(
            morphingGProps.xRot,
            morphingGProps.yRot,
            morphingGProps.zRot
          );
        },
      })
      .to(
        morphingMesh.geometry.attributes.position.array,
        {
          endArray: shipPosArraySpread,
          ease: "power2.out",
          onUpdate: () => {
            morphingMesh.geometry.attributes.position.needsUpdate = true;
            camera.lookAt(morphingMesh.position);
            renderer.render(scene, camera);
          },
        },
        "<"
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

function animateText() {
  console.log("Animate Text");
}
