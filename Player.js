import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
import Stats from 'three/examples/jsm/libs/stats.module'

export class Player {
    _parent;
    _scene;
    _camera;
    _renderer;
    _controls;
    _mesh;
    _mouseState = {
        buttonDown: false,
        startX: 0,
        startY: 0
    };
    _stats;
    _gui;
    
    CreateScene() {
        this._scene = new THREE.Scene();
    }

    CreateCamera(width, height, cameraSize) {
        const aspectRatio = width / height;
        this._camera = new THREE.OrthographicCamera(
            -cameraSize * aspectRatio, // left
            cameraSize * aspectRatio,  // right
            cameraSize,                // top
            -cameraSize,               // bottom
            1,                         // near
            1000                       // far
        );

        // Isometric angles (45 deg on Y axis)
        const angle = Math.PI / 4;
        const inclination = Math.atan(-1 / Math.sqrt(2));
        
        this._camera.position.set(
            cameraSize * Math.sin(angle),
            cameraSize * Math.cos(angle),
            cameraSize * Math.sin(angle)
        );
        
        this._camera.rotation.order = 'YXZ';
        this._camera.rotation.y = -angle;
        this._camera.rotation.x = inclination;
    }

    CreateRenderer(width, height, bgColor, alpha) {
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(width, height);
        this._renderer.setClearColor(bgColor, alpha);
    }

    CreateControls(enableDamping, enablePan, enableRotate) {
        if (!this._renderer || !this._camera) {
            console.error("Renderer or Camera need to be created.");
            return;
        }

        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.update();
        this._controls.enableDamping = enableDamping;
        this._controls.enablePan = enablePan;
        this._controls.enableRotate = enableRotate;
    }

    CreateStats() {
        this._stats = new Stats();
        this._parent.appendChild(this._stats.dom);
    }

    CreateGui() {
        this._gui = new GUI({ autoPlace: false });
        this._gui.domElement.id = 'gui';
        this._gui.width = (this._parent.clientWidth * 35) / 100;
        // const guiContainer = document.getElementById('gui_container');
        this._parent.appendChild(this._gui.domElement);

    }

    AddObjectToGui( name, object) {
        const objectFolder = this._gui.addFolder(name);
        objectFolder.add(object.rotation, 'x', 0, Math.PI * 2);
        objectFolder.add(object.rotation, 'y', 0, Math.PI * 2);
        objectFolder.add(object.rotation, 'z', 0, Math.PI * 2);
        objectFolder.open();
    }

    SetParent(parent) {
        this._parent = parent;
    }

    AttachRendererToParent() {
        if (!this._renderer) {
            console.error("Renderer has to be created before attaching it to the parent.");
            return;
        }
        this._parent.appendChild(this._renderer.domElement);
    }

    AddAmbientLight(color) {
        if (!this._scene) {
            console.error("Scene has to be created before adding ambient light");
            return;
        }
        const ambientLight = new THREE.AmbientLight(color);
        this._scene.add(ambientLight);
    }

    AddDirectionalLight(color, intensity, x, y, z) {
        if (!this._scene) {
            console.error("Scene has to be created before adding directionnal light");
            return;
        }
        const directionalLightUp = new THREE.DirectionalLight(color, intensity);
        directionalLightUp.position.set(x, y, z);
        this._scene.add(directionalLightUp);
    }

    LoadSTLModel(url, color, modelMaterial) {
        if (!this._scene) {
            console.error("Scene has to be created before loading the STL model");
            return;
        }
        const loader = new STLLoader();
        loader.load(url, (geometry) => {
            const material = new THREE.MeshPhysicalMaterial(modelMaterial);
            this._mesh = new THREE.Mesh(geometry, material);
            this._scene.add(this._mesh);

            // Compute the middle
            this.CenterObject(geometry, this._mesh);

            // Wireframe of the model
            const geo = new THREE.EdgesGeometry(this._mesh.geometry);
            const mat = new THREE.LineBasicMaterial({color: 0x000000});
            const wireframe = new THREE.LineSegments(geo, mat);
            this._mesh.add(wireframe);

            // Positionnate camera
            this.FitCameraToCenteredObject(this._mesh, this._camera, this._controls);

            this.AddObjectToGui('Model', this._mesh);
        }, function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded material');
        }, function (error) {
            console.error(error);
        });
    }

    Animate() {
        if (!this._renderer || !this._scene || !this._camera || !this._renderer) {
            console.error("Render, Scene, Camera and Renderer has to be created before animate.");
            return;
        }

        window.requestAnimationFrame(this.Animate.bind(this));

        this._controls.update();
        this._renderer.render(this._scene, this._camera);
        this._stats.update()
    }

    AddListeners(mouseModelInteraction, resize) {
        if (!this._parent || !this._camera || !this._renderer) {
            console.error("Parent, Camera and Render has to be created before adding listeners");
            return;
        }

        if (mouseModelInteraction) {
            this._renderer.domElement.addEventListener('mousedown', this.OnMouseDown.bind(this));
            this._renderer.domElement.addEventListener('mousemove', this.OnMouseMove.bind(this));
            this._renderer.domElement.addEventListener('mouseup', this.OnMouseUp.bind(this));
        }

        if (resize) {
            window.addEventListener('resize', this.OnWindowResize.bind(this));
        }
    }

    OnMouseDown(event) {
        if (event.button === 2) {
            this._mouseState.buttonDown = true;
            this._mouseState.startX = event.clientX;
            this._mouseState.startY = event.clientY;
        }
    }

    OnWindowResize() {
        if (!this._camera || !this._renderer || !this._parent) {
            console.error("Camera, Renderer, Parent have to be created and added to the scene before calling OnWindowResize listener")
            return;
        }

        const newWidth = this._parent.clientWidth;
        const newHeight = this._parent.clientHeight;
        this._gui.width = (newWidth * 35) / 100;

        this._camera.aspect = newWidth / newHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(newWidth, newHeight);
    }

    OnMouseMove(event) {
        if (!this._mesh) {
            console.error("Mesh/Model has to be created and added to the scene before calling OnMouseMove listener")
        }

        if (!this._mouseState.buttonDown) {
            return;
        }

        const deltaX = event.clientX - this._mouseState.startX;
        const deltaY = event.clientY - this._mouseState.startY;

        this._mesh.rotation.y += deltaX * 0.01;
        this._mesh.rotation.x += deltaY * 0.01;

        this._mouseState.startX = event.clientX;
        this._mouseState.startY = event.clientY;
    }

    OnMouseUp() {
        this._mouseState.buttonDown = false;
    }

    AddAxes(size) {
        if (!this._scene) {
            console.error("Scene has to be created before adding axes");
            return;
        }

        const axesHelper = new THREE.AxesHelper(size);
        this._scene.add(axesHelper);
    }

    AddGrid(size, divisions) {
        if (!this._scene) {
            console.error("Scene has to be created before adding grid");
            return;
        }
        const gridHelper = new THREE.GridHelper(size, divisions);
        this._scene.add(gridHelper);
    }

    FitCameraToCenteredObject(mesh, camera, controls) {
        const offset = 0.7; // Ratio to be closer or farer of model size
        const boundingBox = new THREE.Box3().setFromObject(mesh);
        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // Calc to have the camera distance from object
        let cameraDistance = maxDim * offset;

        // Setting isometric view for camera
        const angle = Math.PI / 4;
        const cameraPosition = new THREE.Vector3(
            cameraDistance * Math.sin(angle),
            cameraDistance * Math.cos(angle),
            cameraDistance * Math.sin(angle)
        );

        camera.position.copy(cameraPosition);
        camera.lookAt(mesh.position);

        // Ajust dimensions of orthographic camera
        camera.left = -maxDim * offset;
        camera.right = maxDim * offset;
        camera.top = maxDim * offset;
        camera.bottom = -maxDim * offset;

        // Ajust cut plan of the camera
        camera.near = -cameraDistance * 2;
        camera.far = cameraDistance * 2;
        camera.updateProjectionMatrix();

        // Point to the object
        if (controls) {
            controls.target.copy(mesh.position);
        }
    }

    CenterObject(geometry, mesh) {
        const middle = new THREE.Vector3();
        geometry.computeBoundingBox();
        geometry.boundingBox.getCenter(middle);
        // center it
        mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z));
    }
}