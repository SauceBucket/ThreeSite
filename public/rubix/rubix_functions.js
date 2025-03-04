import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';

console.log('Three.js Loaded:', THREE);
const container = document.getElementById('scene-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const opaque_material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF,wireframe:true});
const pivot = new THREE.Mesh(geometry, material);
const cube1 = new THREE.Mesh(geometry, material);
cube1.userData.type = "cube"
const cube2 = new THREE.Mesh(geometry, material);
cube2.userData.type = "cube"
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;
const cubecollection = [
    cube1,
    cube2
]
export function setup_rubix_scene(){
    // Scene setup

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    camera.position.z = 10;
    scene.add(pivot);
    scene.add(...cubecollection);
    scene.addEventListener()
    document.getElementById("scene-container").addEventListener("click", function(event) {
        

        const intersects = raycaster.intersectObjects(scene.children);
        rotate_section(intersects);

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

    cube1.position.set(2,0,0);
    cube2.position.set(-2,0,0);
}
function rotate_section(intersects){

    if (intersects.length > 0) {
        
        if(intersects[0].object.userData.type == "cube"){

            rotate_all_cubes_sharing_z_val(intersects[0].object.position.z);
        }
            
        
    }

}
function rotate_all_cubes_sharing_z_val(z_val){

    cubecollection.forEach(cube => {
        if(cube.position.z == z_val){

                pivot.add(cube)

        }

    });
    pivot.rotation.z += Math.PI/4;
    // Ensure that the pivot and its children update their world matrices
    pivot.updateMatrixWorld(true); // Updates the world matrix of the pivot and its children

    let objects_to_remove = [...pivot.children];
    pivot.children = [];
    // Update the world position of the cubes
    objects_to_remove.forEach(cube => {
        // Update the cube's position relative to the world, considering the pivot's rotation
        cube.updateMatrixWorld(true); // Ensure the world matrix is updated
        let worldPosition = new THREE.Vector3();
        cube.getWorldPosition(worldPosition); // Get the world position of the cube

        // Update the cube's position directly
        cube.position.copy(worldPosition);
        scene.add(cube); // Add the cube back to the scene
    });
}
function rotate_cube(intersects){


    cube.parent.rotation.z += Math.PI/2;
    console.log('Object clicked:', cube);

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