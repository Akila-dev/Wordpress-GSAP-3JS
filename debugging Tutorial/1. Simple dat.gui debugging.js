import * as THREE from "three";
import * as dat from "dat";

function main() {
  // * TEXTURE LOADER
  const loader = new THREE.TextureLoader();
  const particleTexture = loader.load("./assets/logo.png");

  const gui = new dat.GUI();

  // * CANVAS AND RENDERER INIT
  const canvas = document.querySelector("#globe-canvas");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setPixelRatio(window.devicePixelRatio);

  // * CAMERA AND SCENE INIT
  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  // * LIGHT
  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  // * GEOMETRY
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 5000;

  // gui.add(particlesCount, "No of Particles").min(1000).max(50000);

  // ? Create Array of Points for the particles
  const posArray = new Float32Array(particlesCount * 3); // * Multiply by 3 cos its to be vec 3
  for (let i = 0; i < particlesCount * 3; i++) {
    // posArray[i] = Math.random() - 0.5; // * Subtract 0.5 so you can get both positive and negative values, making the particles centered.
    posArray[i] = (Math.random() - 0.5) * 5; // * Multiply by 5 ro disperse the particles
  }

  // ? Use the Array of particles to set the position of points in the particles geometry
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );

  // * MATERIAL
  const pointMaterial = new THREE.PointsMaterial({
    size: 0.01,
    map: particleTexture,
    transparent: true,
    color: "red",
    // blending: THREE.AdditiveBlending, // * You can also add blending to the material e.g: SubtractiveBlending, MultiplyBlending, AdditiveBlending
  });

  // * OBJECTS/MESH
  // const sphere = new THREE.Points(particlesGeometry, pointMaterial )
  const particlesMesh = new THREE.Points(particlesGeometry, pointMaterial);
  scene.add(particlesMesh);

  // * GUI/DEBUG
  const particlesFolder = gui.addFolder("Particles");
  particlesFolder.add(particlesMesh.rotation, "x").min(-10).max(10);
  particlesFolder.add(particlesMesh.rotation, "y").min(-10).max(10);
  particlesFolder.add(particlesMesh.rotation, "z").min(-10).max(10);
  particlesFolder.open();

  const cameraFolder = gui.addFolder("camera");
  cameraFolder.add(camera.rotation, "x").min(-10).max(10);
  cameraFolder.add(camera.rotation, "y").min(-10).max(10);
  cameraFolder.add(camera.rotation, "z").min(-10).max(10);
  cameraFolder.open();

  // * RESIZE RENDERER TO DEVICE/DISPLAY SIZE
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

  document.addEventListener("mousemove", getMouseMovement);

  let mouseX = 0;
  let mouseY = 0;

  function getMouseMovement(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  // * ANIMATE RENDERER
  function render(time) {
    // time *= 0.0001;

    // * UPDATE ASPECT TO FIT DISPLAY SIZE
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // if (mouseX > 0) {
    //   particlesMesh.rotation.y = mouseX * time * 0.0000001;
    // } else {
    //   particlesMesh.rotation.y = time * 0.00001;
    // }

    // particlesMesh.rotation.z = (mouseX * -time) / 10;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
