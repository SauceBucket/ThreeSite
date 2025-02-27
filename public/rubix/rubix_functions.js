import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';

console.log('Three.js Loaded:', THREE);
const container = document.getElementById('scene-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
const geometry = new THREE.BoxGeometry();
const boundingbox_geometry = new THREE.BoxGeometry(10,10,5);
const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const opaque_material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF,wireframe:true});
const pivot = new THREE.Mesh(geometry, material);
const cube = new THREE.Mesh(geometry, material);
const boundingbox = new THREE.Mesh(boundingbox_geometry, opaque_material);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;

export function setup_rubix_scene(){
    // Scene setup

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    camera.position.z = 10;
    boundingbox.material.wire
    scene.add(pivot,boundingbox);
    scene.addEventListener()
    document.getElementById("scene-container").addEventListener("click", function(event) {
        const intersects = raycaster.intersectObjects(scene.boundingbox);
        rotate_cube(intersects);
    });

    document.getElementById("scene-container").addEventListener("mousemove", function(event) {

        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);

    });

    
    window.addEventListener('resize', resizeRenderer);
    resizeRenderer();
    createcubes()

}

function createcubes(){

    
    pivot.add(cube);
    //pivot2.add(cube);
    cube.position.set(2,0,0);
    
}
function rotate_cubes_within_bounding_box(intersects){

    

}
function rotate_cube(intersects){

    
    if (intersects.length > 0) {
        
        if(intersects[0].object == cube){

            cube.parent.rotation.z += Math.PI/2;
            console.log('Object clicked:', cube);
        }
            
        
    }
}

function paint_collided_objects(intersects){
    
    
    if (intersects.length > 0) {
        
        if(hoveredObject !== intersects[0].object)
            if(hoveredObject) {
                hoveredObject.material.color.set(0x00FF00);
            }
        hoveredObject = intersects[0].object;
        console.log('Object hovered:', hoveredObject);
        hoveredObject.material.color.set(0xFF0000);
        
    }
    else{
        if(hoveredObject) {
            hoveredObject.material.color.set(0x00FF00);
            hoveredObject = null;
        }

    }


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
export function animate_rubix_scene() {
    
    requestAnimationFrame(animate_rubix_scene);
    const intersects = raycaster.intersectObjects(scene.children);
    
    //paint_collided_objects(intersects);

    renderer.render(scene, camera);

}

export function createsquare(x,y) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
    const cube2 = new THREE.Mesh(geometry, material);
    cube2.position.set(Math.floor(Math.random() * 6),Math.floor(Math.random() * 6),Math.floor(Math.random() * 6));
    scene.add(cube2);
}

function waitforxframes(numframes){

    let count = 0;
    function loop() {
        if (count >= frames) {
            callback();
        } else {
            count++;
            requestAnimationFrame(loop);
        }
    }
    loop();

}