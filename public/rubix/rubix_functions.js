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
let axis_selected = y_axis;
let cubecollection = [];

const starting_positions = {
    // Face Centers
    "Right Center": new THREE.Vector3(1.1, 0, 0),
    "Up Center": new THREE.Vector3(0, 1.1, 0),
    "Left Center": new THREE.Vector3(-1.1, 0, 0),
    "Front Center": new THREE.Vector3(0, 0, 1.1),
    "Down Center": new THREE.Vector3(0, -1.1, 0),
    "Back Center": new THREE.Vector3(0, 0, -1.1),

    // Edge Pieces
    "Right Up": new THREE.Vector3(1.1, 1.1, 0),
    "Right Front": new THREE.Vector3(1.1, 0, 1.1),
    "Right Down": new THREE.Vector3(1.1, -1.1, 0),
    "Right Back": new THREE.Vector3(1.1, 0, -1.1),

    "Left Up": new THREE.Vector3(-1.1, 1.1, 0),
    "Left Front": new THREE.Vector3(-1.1, 0, 1.1),
    "Left Down": new THREE.Vector3(-1.1, -1.1, 0),
    "Left Back": new THREE.Vector3(-1.1, 0, -1.1),

    "Up Front": new THREE.Vector3(0, 1.1, 1.1),
    "Up Back": new THREE.Vector3(0, 1.1, -1.1),
    "Down Front": new THREE.Vector3(0, -1.1, 1.1),
    "Down Back": new THREE.Vector3(0, -1.1, -1.1),

    // Corner Pieces
    "Right Up Front": new THREE.Vector3(1.1, 1.1, 1.1),
    "Right Up Back": new THREE.Vector3(1.1, 1.1, -1.1),
    "Right Down Front": new THREE.Vector3(1.1, -1.1, 1.1),
    "Right Down Back": new THREE.Vector3(1.1, -1.1, -1.1),

    "Left Up Front": new THREE.Vector3(-1.1, 1.1, 1.1),
    "Left Up Back": new THREE.Vector3(-1.1, 1.1, -1.1),
    "Left Down Front": new THREE.Vector3(-1.1, -1.1, 1.1),
    "Left Down Back": new THREE.Vector3(-1.1, -1.1, -1.1)
};



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

function initialize_cubes() {
    const red_material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });   // Left
    const blue_material = new THREE.MeshBasicMaterial({ color: 0x0000FF });  // Front
    const green_material = new THREE.MeshBasicMaterial({ color: 0x00FF00 }); // Right
    const orange_material = new THREE.MeshBasicMaterial({ color: 0xFFA500 }); // Back
    const white_material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF }); // Up
    const yellow_material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 }); // Down

    // Centers
    createCube(green_material, starting_positions["Right Center"]);
    createCube(red_material, starting_positions["Left Center"]);
    createCube(white_material, starting_positions["Up Center"]);
    createCube(yellow_material, starting_positions["Down Center"]);
    createCube(blue_material, starting_positions["Front Center"]);
    createCube(orange_material, starting_positions["Back Center"]);

    // Edges
    createCube(green_material, starting_positions["Right Up"]);
    createCube(green_material, starting_positions["Right Front"]);
    createCube(green_material, starting_positions["Right Down"]);
    createCube(green_material, starting_positions["Right Back"]);

    createCube(red_material, starting_positions["Left Up"]);
    createCube(red_material, starting_positions["Left Front"]);
    createCube(red_material, starting_positions["Left Down"]);
    createCube(red_material, starting_positions["Left Back"]);

    createCube(white_material, starting_positions["Up Front"]);
    createCube(white_material, starting_positions["Up Back"]);
    createCube(yellow_material, starting_positions["Down Front"]);
    createCube(yellow_material, starting_positions["Down Back"]);

    // Corners
    createCube(green_material, starting_positions["Right Up Front"]);
    createCube(green_material, starting_positions["Right Up Back"]);
    createCube(green_material, starting_positions["Right Down Front"]);
    createCube(green_material, starting_positions["Right Down Back"]);

    createCube(red_material, starting_positions["Left Up Front"]);
    createCube(red_material, starting_positions["Left Up Back"]);
    createCube(red_material, starting_positions["Left Down Front"]);
    createCube(red_material, starting_positions["Left Down Back"]);

}


function createCube(material, position) {

    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(position);

    cubecollection.push(cube);

    const edges = new THREE.EdgesGeometry(cube.geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 10 });
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
    scene.add(edgeLines);

    scene.add(cube);

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

    align_position_after_rotation(object.position)

}

function align_position_after_rotation(currentPosition){

    let closestPosition = null;
    let minDistance = Infinity;

    for (const key in starting_positions ) {
        const position = starting_positions[key];
        const distance = currentPosition.distanceTo(position);
        if (distance < minDistance) {
            minDistance = distance;
            closestPosition = position;
        }
    }

    if (closestPosition) {
        currentPosition.copy(closestPosition);
    }

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