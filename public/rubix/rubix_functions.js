import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';

console.log('Three.js Loaded:', THREE);
const container = document.getElementById('scene-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const opaque_material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF,wireframe:true});
const pivot = new THREE.Mesh(geometry, opaque_material);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;
const x_axis = new THREE.Vector3(1,0,0);
const y_axis = new THREE.Vector3(0,1,0);
const z_axis = new THREE.Vector3(0,0,1);

const starting_positions = {
    "Right Center":new THREE.Vector3(2,0,0),
    "Up Center":new THREE.Vector3(0,2,0),
    "Left Center":new THREE.Vector3(0,0,2),
    "Front Center":new THREE.Vector3(-2,0,0),
    "Down Center":new THREE.Vector3(0,-2,0),
    "Back Center":new THREE.Vector3(0,0,-2),
};


let axis_selected = y_axis;

let cubecollection = [];
export function setup_rubix_scene(){
    // Scene setup

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    camera.position.z = 10;
    scene.add(pivot);
    initialize_cubes()
    scene.addEventListener()
    document.getElementById("scene-container").addEventListener("click", function(event) {
        

        const intersects = raycaster.intersectObjects(cubecollection);
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


}

function initialize_cubes(){
    const red_material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });   
    const blue_material = new THREE.MeshBasicMaterial({ color: 0x0000FF });  
    const green_material = new THREE.MeshBasicMaterial({ color: 0x00FF00 }); 
    const orange_material = new THREE.MeshBasicMaterial({ color: 0xFFA500 }); 
    const white_material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF }); 
    const yellow_material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 }); 

    const cube1 = new THREE.Mesh(geometry, red_material);
    const cube2 = new THREE.Mesh(geometry, green_material);
    const cube3 = new THREE.Mesh(geometry, white_material);
    const cube4 = new THREE.Mesh(geometry, yellow_material);
    const cube5 = new THREE.Mesh(geometry, blue_material);
    const cube6 = new THREE.Mesh(geometry, orange_material);

    cube1.position.copy(starting_positions["Left Center"]);
    cube2.position.copy(starting_positions["Right Center"]);
    cube3.position.copy(starting_positions["Up Center"]);
    cube4.position.copy(starting_positions["Down Center"]);
    cube5.position.copy(starting_positions["Front Center"]);
    cube6.position.copy(starting_positions["Back Center"]);

    cubecollection = [
        cube1,
        cube2,
        cube3,
        cube4,
        cube5,
        cube6,
    ]
    scene.add(...cubecollection);
}
function rotate_section(intersects){

    if (intersects.length > 0) {
        rotate_all_cubes_along_axis(axis_selected,intersects[0].object);     
    }

}

function rotate_all_cubes_along_axis(axis,selected_cube){

    switch(axis){
        case x_axis:
            rotate_all_cubes_sharing_x_val(selected_cube.position.x)
            break;
        case y_axis:
            rotate_all_cubes_sharing_y_val(selected_cube.position.y)
            break;
        case z_axis:
            rotate_all_cubes_sharing_z_val(selected_cube.position.z)
            break;
        default:
            break;

    }

}
function rotate_all_cubes_sharing_x_val(x_val){

    cubecollection.forEach(cube => {

        if(cube.position.x == x_val){

            rotate_around_point(cube,pivot.position,Math.PI/2,x_axis);
            cube.updateMatrixWorld(true);
        }

    });

}
function rotate_all_cubes_sharing_y_val(y_val){

    cubecollection.forEach(cube => {

        if(cube.position.y == y_val){

            rotate_around_point(cube,pivot.position,Math.PI/2,y_axis);
            cube.updateMatrixWorld(true);
        }

    });

}
function rotate_all_cubes_sharing_z_val(z_val){

    cubecollection.forEach(cube => {

        if(cube.position.z == z_val){

            rotate_around_point(cube,pivot.position,Math.PI/2,z_axis);
            cube.updateMatrixWorld(true);
        }

    });

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
    const intersects = raycaster.intersectObjects(cubecollection);
    
    //paint_collided_objects(intersects);

    renderer.render(scene, camera);

}

function rotate_around_point(object, point, angle, axis) {

    object.position.sub(point);

    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(axis, angle);

    object.position.applyQuaternion(quaternion);

    object.position.add(point);

}

export function SetRotationAxis(axis){

    switch(axis){
        case 'x':
            axis_selected = x_axis;
            break;
        case 'y':
            axis_selected = y_axis;
            break;
        case 'z':
            axis_selected = z_axis;
            break;
        default:
            break;

    }

}