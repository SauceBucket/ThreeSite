import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';

console.log('Three.js Loaded:', THREE);
const container = document.getElementById('scene-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const pivot = new THREE.Mesh(geometry, material);
const cube = new THREE.Mesh(geometry, material);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;

export function setup_osrs_scene(){
    // Scene setup

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    camera.position.z = 10;
    
    scene.addEventListener()

    
    window.addEventListener('resize', resizeRenderer);
    resizeRenderer();
    createcubes()

}


// Animation loop
export function animate_osrs_scene() {
    
    requestAnimationFrame(animate_osrs_scene);
    const intersects = raycaster.intersectObjects(scene.children);

    renderer.render(scene, camera);

}
