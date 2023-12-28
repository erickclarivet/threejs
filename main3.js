import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import fs from 'fs'
import { VRMLLoader } from 'three/addons/loaders/VRMLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create a new scene
const scene = new THREE.Scene();

// Create a new camera
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
// Create a window renderer
const renderer = new THREE.WebGLRenderer();
// Set la taille du rendu
renderer.setSize(window.innerWidth, window.innerHeight);
// Attached renderer to body
document.body.appendChild(renderer.domElement);

// const loader = new STLLoader();

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// // Create a material
// const material = new THREE.MeshBasicMaterial( {color: 0x00ff00 });
// // Create a cube from the geometry and put the material on it
// const cube = new THREE.Mesh(geometry, material);
// // Add to the scene 
// scene.add(cube);

// load binary stl works but without Material
// loader.load( './A812_A.stl', function ( geometry ) {
//         var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//         var mesh = new THREE.Mesh(geometry, material);
//         // mesh.rotation.x += 7;
//         // mesh.rotation.y += 8;
//         scene.add(mesh);
// },
// // called when loading is in progresses
// function ( xhr ) {

//     console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// },
// // called when loading has errors
// function ( error ) {

//     console.log( 'An error happened' );

// });

// Allows camera to orbit around a target
const controls = new OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 20, 100 );
controls.update();

var mtlLoader = new MTLLoader();
mtlLoader.load("./a812_a.mtl", function (materials) {
    materials.preload();
    const objloader = new OBJLoader();
    objloader.setMaterials(materials);
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

            console.log((xhr.loaded / xhr.total * 100) + '% loaded material');

        },
        // called when loading has errors
        function (error) {

            console.log(error);

        }
    );
},
    // called when loading is in progresses
    function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded obj');

    },
    // called when loading has errors
    function (error) {

        console.log(error);

    });

// instantiate a loader



// const vrmlloader = new VRMLLoader();
// vrmlloader.load( './conrod.wrl', function ( geometry ) {
//     // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//     // var mesh = new THREE.Mesh(geometry, material);
//     // mesh.rotation.x += 7;
//     // mesh.rotation.y += 8;
//     scene.add(geometry);

// },
// // called when loading is in progresses
// function ( xhr ) {

// console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// },
// // called when loading has errors
// function ( error ) {

// console.log( error );

// });

// const objloader = new OBJLoader();

// // load a resource
// objloader.load(
// 	// resource URL
// 	'./conrod.obj',
// 	// called when resource is loaded
// 	function ( object ) {

// 		scene.add( object );

// 	},
// 	// called when loading is in progresses
// 	function ( xhr ) {

// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// 	},
// 	// called when loading has errors
// 	function ( error ) {

// 		console.log( 'An error happened' );

// 	}
// );


// const objloader = new OBJLoader();

// // load a resource
// objloader.load(
// 	// resource URL
// 	'./conrod.obj',
// 	// called when resource is loaded
// 	function ( object ) {

// 		scene.add( object );

// 	},
// 	// called when loading is in progresses
// 	function ( xhr ) {

// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// 	},
// 	// called when loading has errors
// 	function ( error ) {

// 		console.log( 'An error happened' );

// 	}
// );


renderer.setClearColor(0x00ffff, 1);
camera.position.z = 100;
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