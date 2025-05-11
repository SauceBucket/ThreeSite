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
let intersects = null;
let mouse = new THREE.Vector2();
let previous_mouseposition = new THREE.Vector2();
const x_axis = new THREE.Vector3(1,0,0);
const y_axis = new THREE.Vector3(0,1,0);
const z_axis = new THREE.Vector3(0,0,1);
let rotation_scalar = 2;
let axis_selected = y_axis;
let cubecollection = [];
let isDragging = false;
let cube_size = 1;
let spacing_size = .05;
let unit = cube_size + spacing_size;

const red_material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });   
const blue_material = new THREE.MeshBasicMaterial({ color: 0x0000FF });  
const green_material = new THREE.MeshBasicMaterial({ color: 0x00FF00 }); 
const orange_material = new THREE.MeshBasicMaterial({ color: 0xFFA500 }); 
const white_material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF }); 
const yellow_material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 }); 
const black_material = new THREE.MeshBasicMaterial({ color: 0x000000 }); 

const left_material = red_material;
const front_material = blue_material;
const right_material = green_material;
const back_material = orange_material;
const top_material = white_material;
const bottom_material = yellow_material;

const starting_positions = {
    // Face Centers
    "Right Center": new THREE.Vector3(unit, 0, 0),
    "Up Center": new THREE.Vector3(0, unit, 0),
    "Left Center": new THREE.Vector3(-unit, 0, 0),
    "Front Center": new THREE.Vector3(0, 0, unit),
    "Down Center": new THREE.Vector3(0, -unit, 0),
    "Back Center": new THREE.Vector3(0, 0, -unit),

    // Edge Pieces
    "Right Up": new THREE.Vector3(unit, unit, 0),
    "Right Front": new THREE.Vector3(unit, 0, unit),
    "Right Down": new THREE.Vector3(unit, -unit, 0),
    "Right Back": new THREE.Vector3(unit, 0, -unit),

    "Left Up": new THREE.Vector3(-unit, unit, 0),
    "Left Front": new THREE.Vector3(-unit, 0, unit),
    "Left Down": new THREE.Vector3(-unit, -unit, 0),
    "Left Back": new THREE.Vector3(-unit, 0, -unit),

    "Up Front": new THREE.Vector3(0, unit, unit),
    "Up Back": new THREE.Vector3(0, unit, -unit),
    "Down Front": new THREE.Vector3(0, -unit, unit),
    "Down Back": new THREE.Vector3(0, -unit, -unit),

    // Corner Pieces
    "Right Up Front": new THREE.Vector3(unit, unit, unit),
    "Right Up Back": new THREE.Vector3(unit, unit, -unit),
    "Right Down Front": new THREE.Vector3(unit, -unit, unit),
    "Right Down Back": new THREE.Vector3(unit, -unit, -unit),

    "Left Up Front": new THREE.Vector3(-unit, unit, unit),
    "Left Up Back": new THREE.Vector3(-unit, unit, -unit),
    "Left Down Front": new THREE.Vector3(-unit, -unit, unit),
    "Left Down Back": new THREE.Vector3(-unit, -unit, -unit)
};



export function setup_rubix_scene(){
    // Scene setup

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    camera.position.z = 10;
    scene.add(pivot);
    initialize_cubes()
    scene.addEventListener()

    document.addEventListener('mousedown', onMouseDown); 
    document.addEventListener('mouseup', onMouseUp);

    document.getElementById("scene-container").addEventListener("mousemove", function(event) {

        const rect = container.getBoundingClientRect();
        mouse = calculate_scene_coords_from_client_coords({
            x: event.clientX,
            y: event.clientY
        })
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);
        
        if( isDragging && intersects.length === 0){

            let angle_to_rotate_camera = (mouse.x-previous_mouseposition.x) * rotation_scalar;
            rotate_around_point(camera,pivot.position,angle_to_rotate_camera,y_axis);
            angle_to_rotate_camera = (mouse.y-previous_mouseposition.y) * rotation_scalar;
            rotate_around_point(camera,pivot.position,angle_to_rotate_camera,x_axis);
            camera.lookAt(pivot.position);
        }
        previous_mouseposition = mouse;
    });
        
    window.addEventListener('resize', resizeRenderer);
    resizeRenderer();


}
function onMouseUp(e) {
    isDragging = false;
}
function onMouseDown(e) {
    isDragging = true;
    intersects = raycaster.intersectObjects(cubecollection);
    if(intersects.length > 0)
        rotate_cubes(axis_selected,intersects[0].object.position)
}
function calculate_scene_coords_from_client_coords(client_coords){

    const rect = container.getBoundingClientRect();
    let mouseposition = {
        x:null,
        y:null
    }
    mouseposition.x = ((client_coords.x - rect.left) / rect.width) * 2 - 1;
    mouseposition.y = -((client_coords.y - rect.top) / rect.height) * 2 + 1;
    return mouseposition;
}

function getMaterialsForCube(position) {
    return [
      (position.x - pivot.position.x >= .00001) ? right_material  : black_material,  // +X
      (position.x - pivot.position.x <= -.00001) ? left_material   : black_material,  // -X
      (position.y - pivot.position.y >= .00001) ? top_material    : black_material,  // +Y
      (position.y - pivot.position.y <= -.00001) ? bottom_material : black_material,  // -Y
      (position.z - pivot.position.z >= .00001) ? front_material  : black_material,  // +Z
      (position.z - pivot.position.z <= -.00001) ? back_material   : black_material   // -Z
    ];
}

function initialize_cubes() {

    for (let key in starting_positions) {
        createCube(starting_positions[key]);
    }
    
}

function createCube(position) {

    const cube = new THREE.Mesh(geometry, getMaterialsForCube(position));
    cube.position.copy(position);

    cubecollection.push(cube);

    scene.add(cube);

}

function rotate_cubes(axis,position_to_match){
    const axisMap = new Map([
        [x_axis, 'x'],
        [y_axis, 'y'],
        [z_axis, 'z']
    ]);

    let prop = axisMap.get(axis);

    let value = position_to_match[prop];
    
    cubecollection.forEach(cube => {
        if (cube.position[prop] === value) {
            rotate_around_point(cube, pivot.position, Math.PI / 2, axis);
            align_position_after_rotation(cube.position);
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

    renderer.render(scene, camera);

}

function rotate_around_point(object, point, angle, axis) {

    object.position.sub(point);

    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(axis, angle);

    object.position.applyQuaternion(quaternion);

    object.quaternion.premultiply(quaternion);

    object.position.add(point);
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