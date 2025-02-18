import * as THREE from "three";

function main() {
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

  // ? Create Array of Points for the particles
  const posArray = new Float32Array(particlesCount * 3); // * Multiply by 3 cos its to be vec 3
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = Math.random() - 0.5; // * Subtract 0.5 so you can get both positive and negative values, making the particles centered.
  }

  // ? Use the Array of particles to set the position of points in the particles geometry
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );

  // * MATERIAL
  const pointMaterial = new THREE.PointsMaterial({
    size: 0.005,
  });

  // * OBJECTS/MESH
  // const sphere = new THREE.Points(particlesGeometry, pointMaterial )
  const particlesMesh = new THREE.Points(particlesGeometry, pointMaterial);
  scene.add(particlesMesh);

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

  // * ANIMATE RENDERER
  function render(time) {
    // time *= 0.001;

    // * UPDATE ASPECT TO FIT DISPLAY SIZE
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // cube.rotation.x = time;
    // cube.rotation.y = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
