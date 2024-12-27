import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setSize(window.innerWidth, window.innerHeight); // Ensure canvas fits window

  const fov = 40;
  const aspect = window.innerWidth / window.innerHeight; // Use window aspect ratio
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 120;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaaaaa);

  const objects = [];
  const spread = 15;

  function addObject(x, y, obj) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;

    scene.add(obj);
    objects.push(obj);
  }

  function createMaterial() {
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    });

    const hue = Math.random();
    const saturation = 1;
    const luminance = 0.5;
    material.color.setHSL(hue, saturation, luminance);

    return material;
  }

  function addSolidGeometry(x, y, geometry) {
    const mesh = new THREE.Mesh(geometry, createMaterial());
    addObject(x, y, mesh);
  }

  {
    const width = 8;
    const height = 8;
    const depth = 8;
    addSolidGeometry(-2, -2, new THREE.BoxGeometry(width, height, depth));
  }

  // Define a polyhedron geometry
  const verticesOfCube = [
    -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
    -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
  ];
  const indicesOfFaces = [
    2, 1, 0, 0, 3, 2,
    0, 4, 7, 7, 3, 0,
    0, 1, 5, 5, 4, 0,
    1, 2, 6, 6, 5, 1,
    2, 3, 7, 7, 6, 2,
    4, 5, 6, 6, 7, 4,
  ];
  const radius = 7;
  const detail = 2;

  const polyhedronGeometry = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, radius, detail);
  addSolidGeometry(2, 2, polyhedronGeometry);

  const size = 8;
  const widthSegments = 2;
  const heightSegments = 2;
  const depthSegments = 2;
  const boxGeometry = new THREE.BoxGeometry(size, size, size, widthSegments, heightSegments, depthSegments);
  addSolidGeometry(-2, 2, boxGeometry);

  // Add a light
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  // Load and add text
  const loader = new FontLoader();
  loader.load('https://cdn.jsdelivr.net/npm/three@0.158.0/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new TextGeometry('Hello Three.js!', {
      font: font,
      size: 5,
      height: 1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    addSolidGeometry(0, 0, textGeometry);
  });

  // Render function
  function render(time) {
    time *= 0.001; // convert time to seconds

    // Resize renderer if necessary
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // Rotate all objects
    objects.forEach((obj) => {
      obj.rotation.x = time;
      obj.rotation.y = time;
    });

    // Render the scene
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  // Handle resizing
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
}

main();
