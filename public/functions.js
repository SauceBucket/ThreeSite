import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';

console.log('Three.js Loaded:', THREE);
const container = document.getElementById('scene-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
const cube = new THREE.Mesh(geometry, material);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


export function setup_scene(){
    // Scene setup

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add a cube
    
    scene.add(cube);
    
    document.getElementById("scene-container").addEventListener("click", function(event) {
        createsquare(event.clientX, event.clientY);
    });
    document.getElementById("scene-container").addEventListener("mousemove", function(event) {

        // Convert mouse position to normalized device coordinates (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);

    });

    camera.position.z = 3;
    window.addEventListener('resize', resizeRenderer);
    resizeRenderer();
    

}
function paint_collided_objects(){

    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        console.log('Object hovered:', intersects[0].object);
        if(intersects[0].object.material.color.getHex() != 0xff0000){
            const original_color = intersects[0].object.material.color.getHex();
            intersects[0].object.material.color.set(0xff0000); // Change color on click
            requestAnimationFrame(() => {
                reset_color(intersects[0].object,original_color);
            });
        }
        
    }
    else{
        //console.log('Object missed!   you clicked at x: '+ mouse.x + " y: " + mouse.y);
    }


}
// Resize Handler
export function resizeRenderer() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

// Animation loop
export function animate() {
    requestAnimationFrame(animate);
    paint_collided_objects();
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

export function createsquare(x,y) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
    const cube2 = new THREE.Mesh(geometry, material);
    cube2.position.set(Math.floor(Math.random() * 6),Math.floor(Math.random() * 6),Math.floor(Math.random() * 6));
    scene.add(cube2);
}
function reset_color(object , original_color){

    if(object.material.color.getHex() == 0xff0000){

        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0 && intersects[0].object.id == object.id) {
            console.log('Object is still being hovered!');
        }
        else{
            console.log('Object missed! you clicked at x: '+ mouse.x + " y: " + mouse.y);
            //object.material.color.set(0x00FF00); //this one does not work
        }
        object.material.color.set(0x00FF00); //this one works
    }
    
    
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