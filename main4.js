import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create a new scene
const scene = new THREE.Scene();

// Create a new camera
const camera = new THREE.PerspectiveCamera(70, 400 / 400, 0.1, 1000);
// Create a window renderer
const renderer = new THREE.WebGLRenderer();
// Set la taille du rendu
renderer.setSize(400, 400);
// Attached renderer to body
// document.body.appendChild(renderer.domElement);
document.getElementById("render").appendChild(renderer.domElement);
// Allows camera to orbit around a target
const controls = new OrbitControls(camera, renderer.domElement);
//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(0, 0, 70);
controls.update();
// Allows to make dampling inertia (amortie l'inertie lors de rotation)
controls.enableDamping = true;

// var mtlLoader = new MTLLoader();
// mtlLoader.load("./a812_a.mtl", function (materials) {
//     materials.preload();
    const objloader = new THREE.ObjectLoader();
    // objloader.setMaterials(materials);
    // load a resource
    objloader.load(
        // resource URL
        './a812_a.obj',
        // called when resource is loaded
        function (object) {
            scene.add(object);
        },
        // called when loading is in progresses
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded model material');
        },
        // called when loading has errors
        function (error) {
            console.log(error);
        }
    );
// },
//     // called when loading is in progresses
//     function (xhr) {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded obj');
//     },
//     // called when loading has errors
//     function (error) {
//         console.log(error);
//     }
// );

renderer.setClearColor(0x808080, 1);
// camera.position.z = 100;
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