import * as THREE from 'three';
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
          
const path = './A812_A.stl';

const modelMaterial = {
      roughness: 0.3,
      color: color,
}
player.LoadSTLModel(path, color, modelMaterial);
player.AddListeners(false, true);
player.Animate();
