import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';
        
console.log('Three.js Loaded:', THREE);
const container = document.getElementById('scene-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
const cube = new THREE.Mesh(geometry, material);

setup_scene();

function setup_scene(){
    // Scene setup

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add a cube
    
    scene.add(cube);
    
    document.getElementById("scene-container").addEventListener("click", function(event) {
        createsquare(event.clientX, event.clientY);
    });
    camera.position.z = 3;
    window.addEventListener('resize', resizeRenderer);
    resizeRenderer();
    
}
// Resize Handler
function resizeRenderer() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}


// Animation loop
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

function createsquare(x,y) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
    const cube2 = new THREE.Mesh(geometry, material);
    cube2.position.set(Math.floor(Math.random() * 6),Math.floor(Math.random() * 6),Math.floor(Math.random() * 6));
    scene.add(cube2);
}
animate();