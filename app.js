import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';
const camera = new THREE.PerspectiveCamera(
    10, 
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

camera.position.z = 30;

const scene = new THREE.Scene();


const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(0, 500, 500);
scene.add(topLight);


const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene, camera);
};

reRender3D();


const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById('progress-bar');
const sectionContainer = document.querySelector('.section');
console.log('hi');
loadingManager.onProgress = function(url, loaded, total) {
    console.log(`Started loading: ${url}`);
    progressBar.value = (loaded / total) * 100;

}

const progressBarContainer = document.querySelector('.progress-bar-container');
loadingManager.onLoad = function(){
    console.log(`Finished loading`);

    setTimeout(function() {
        //your code to be executed after 1 second
        progressBarContainer.style.display = 'none';  // Hide loading bar

    }, 1500);
    
}
let dog;


/*
loadingManager.onStart = function(url, item, total) {
    console.log(`Started loading: ${url}`);
}
loadingManager.onLoad = function(){
    console.log(`Finished loading`)
}
loadingManager.onError = function(){
    console.error(`Error occured when loading`)
}
*/


const loader = new GLTFLoader(loadingManager);


loader.load(
    'dobermann.glb',
    function (gltf) {
        dog = gltf.scene;
  

        scene.add(dog);
        dog.scale.set(30, 30, 30); // Double the size along x, y, and z axes
        dog.position.y = 500; // Set the Y position to 5 units upwards
        modelMove();
    },
    function (xhr) {},
    function (error) {}
)
;

// transition position coordinates for moving
let arrPositionModel = [
    {
        id: 'p0',
        position: {x: 0, y: 0, z: 0},
        rotation: {x: 0, y: 0, z: 0},
        cameraPositionZ: 20,
    },
    {
        id: "p1",
        position: { x: 5, y: 1, z: -5 },
        rotation: { x: 0.5, y: 0, z: 0 },
        cameraPositionZ: 35,
    },
    {
        id: "p2",
        position: { x: -4, y: 1, z: -5 },
        rotation: { x: 0, y: 5, z: 0 },
        cameraPositionZ: 60,
    },
    {
        id: "p3",
        position: { x: 8, y: 1, z:-5 },
        rotation: { x: 0, y: -5, z: 0 },
        cameraPositionZ: 50,
    },
    {
        id: "p4",
        position: { x: -6, y: 1, z: -5 },
        rotation: { x: 1, y: -1, z: 0 },
        cameraPositionZ: 35,
    },
    {
        id: 'p5',
        position: {x: 2.1, y: 1, z: -5},
        rotation: {x: 0.7, y: 0, z: 0},
        cameraPositionZ: 20,
    },
    {
        id: "p6",
        position: { x: -4, y: 1, z: -5 },
        rotation: { x: 0, y: 5, z: 0 },
        cameraPositionZ: 50,
    },
    {
        id: 'p7',
        position: {x: 7.8, y: 1, z: -5},
        rotation: {x: 0.5, y: 3.3, z: 0},
        cameraPositionZ: 50,
    },
    {
        id: "p8",
        position: { x: -5.5, y: 1, z: -5 },
        rotation: { x: 0, y: -5, z: 0 },
        cameraPositionZ: 45,
    },
];

const modelMove = () => {
    const sections = document.querySelectorAll('.section');
    let currentSection;
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 1.7) {
            currentSection = section.id;
        }
    });
    let position_active = arrPositionModel.findIndex(
        (val) => val.id == currentSection
    );
    if (position_active >= 0) {
        let new_coordinates = arrPositionModel[position_active];
        gsap.to(dog.position, {
            x: new_coordinates.position.x,
            y: new_coordinates.position.y,
            z: new_coordinates.position.z,
            duration: 1.5,
            ease: "power1.out"
        });
        gsap.to(dog.rotation, {
            x: new_coordinates.rotation.x,
            y: new_coordinates.rotation.y,
            z: new_coordinates.rotation.z,
            duration: 1.5,
            ease: "power1.out"
        });
        gsap.to(camera.position,{
            z: new_coordinates.cameraPositionZ,
            duration: 1.5,
            ease: "power1.out"
        });
    }
}


window.addEventListener('scroll', () => {
    if (dog) { // 3d loaded
        modelMove();
    }
})


window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

