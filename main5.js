import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create a new scene
const scene = new THREE.Scene();

// Create a new camera
const camera = new THREE.PerspectiveCamera(70, 400 / 400, 0.1, 1000);
// Create a window renderer
const renderer = new THREE.WebGLRenderer();
// Set la taille du rendu
renderer.setSize(400, 400);
// set background color
renderer.setClearColor(0x808080, 1);
// Attached renderer to body
// document.body.appendChild(renderer.domElement);
document.getElementById("render").appendChild(renderer.domElement);
// Allows camera to orbit around a target
const controls = new OrbitControls(camera, renderer.domElement);
//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(0, 0, 500);
controls.update();
// Allows to make dampling inertia (amortie l'inertie lors de rotation)
controls.enableDamping = true;

var loader = new STLLoader();
loader.load('./conrod_binary.stl', function (geometry) {
    var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded obj');
}, function (error) {
    console.log(error);
});

function animate() {
    // call render every 60sec
    requestAnimationFrame(animate);

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    // to render to the screen
    renderer.render(scene, camera);
}

animate();



//     var animate = function () {
//         requestAnimationFrame(animate);
//         renderer.render(scene, camera);
//     };

//     animate();