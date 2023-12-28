import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Create a new scene
const scene = new THREE.Scene();
// Create a new camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Create a window renderer
const renderer = new THREE.WebGLRenderer();
// Set la taille du rendu
renderer.setSize(window.innerWidth, window.innerHeight);
// Attached renderer to body
document.body.appendChild(renderer.domElement);

// Create an object that contains vertices (sommets) and faces 
const geometry = new THREE.BoxGeometry(1, 1, 1);
// Create a material
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00 });
// Create a cube from the geometry and put the material on it
const cube = new THREE.Mesh(geometry, material);
// Add to the scene 
scene.add(cube);
// Put the camera to a position
camera.position.z = 5

function animate() {
    // call render every 60sec
	requestAnimationFrame( animate );

    // Rotate cube
cube.rotation.x += 0.01;
cube.rotation.y += 0.01;
    // to render to the screen
    renderer.render( scene, camera );
}

animate();




// var scene = new THREE.Scene();
//     var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     var renderer = new THREE.WebGLRenderer();

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.getElementById('threejs-container').appendChild(renderer.domElement);

//     var loader = new THREE.STLLoader();
//     loader.load('./A812.stl', function (geometry) {
//         var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
//         var mesh = new THREE.Mesh(geometry, material);
//         scene.add(mesh);
//     });

//     camera.position.z = 5;

//     var animate = function () {
//         requestAnimationFrame(animate);
//         renderer.render(scene, camera);
//     };

//     animate();