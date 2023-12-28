import { Player } from './Player.js';


const parent = document.getElementById("render");

const bgColor = '#4682B4';
const color = '#696969';            
const width = parent.clientWidth;
const height = parent.clientHeight;
const player = new Player();

player.CreateScene();
player.CreateCamera(width, height, 100);
player.CreateRenderer(width, height, bgColor, 1);
player.CreateControls(false, false, true);
player.SetParent(parent);
player.AttachRendererToParent();
player.AddAmbientLight(0x000000);
player.AddDirectionalLight(0xffffff, 3, 1, 1, 1);
player.AddDirectionalLight(0xffffff, 3, -1, -1, -1);

const path = './my_object.stl';

const modelMaterial = {
      roughness: 0.3,
      color: color,
}

player.CreateStats();
player.CreateGui();

player.LoadSTLModel(path, color, modelMaterial);
player.AddListeners(false, true);

player.AddObjectToGui('Camera', player._camera);

// const cameraFolder = gui.addFolder('Camera');
// cameraFolder.add(camera.position, 'z', 0, 10);
// cameraFolder.open();

player.Animate();
