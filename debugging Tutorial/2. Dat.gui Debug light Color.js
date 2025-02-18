import * as THREE from "three";
import * as dat from "dat";

function main() {
  // * TEXTURE LOADER
  const loader = new THREE.TextureLoader();
  const texture = loader.load("./assets/mountain_texture.jpg");

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
  camera.position.z = 3;

  const scene = new THREE.Scene();

  // * LIGHT
  const color = 0xffffff;
  const intensity = 2;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(2, 3, 4);
  scene.add(light);

  // * GEOMETRY
  const geometry = new THREE.PlaneGeometry(3, 3, 64, 64); // * (w, h, widthSegment, heightSegment)

  // * MATERIAL
  const material = new THREE.MeshStandardMaterial({
    color: "gray",
    map: texture,
  });

  // * OBJECTS/MESH
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = 181;
  scene.add(plane);

  // * GUI/DEBUG
  const gui = new dat.GUI();

  // Plane GUI
  const planeGUI = gui.addFolder("Plane");
  planeGUI.add(plane.rotation, "x").min(0).max(360);
  planeGUI.open();

  // Light GUI
  const lightGUI = gui.addFolder("Light");
  lightGUI.add(light.position, "x").min(0).max(50);
  lightGUI.add(light.position, "y").min(0).max(50);
  lightGUI.add(light.position, "z").min(0).max(50);

  const cus = { color: "#ffffff", intensity: 3 };
  lightGUI.addColor(cus, "color").onChange(() => {
    light.color.set(cus.color);
  });

  lightGUI.open();

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

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
