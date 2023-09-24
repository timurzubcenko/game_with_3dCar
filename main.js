import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from "three/examples/jsm/libs/stats.module.js";
import gsap from "gsap"

const keys = {
    KeyW: false,
    KeyA: false,
    KeyD: false,
    KeyS: false,
}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 0;
camera.position.y = 8;
camera.position.x = 13;
camera.rotation.y = 1.57;

// camera.position.x = 2;
// camera.rotation.x = .1;
// camera.rotation.x = 1;

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const stats = new Stats()
document.body.appendChild(stats.dom)



const controls = new OrbitControls(camera, renderer.domElement)

// const light = new THREE.SpotLight()
// light.position.set(5, 5, 5)
// scene.background = new THREE.Color(0xcee0e8)
// scene.add(light)

// light.shadow.camera.visible = true

const fonLight = new THREE.AmbientLight(0xffffff, 0.4)
//каждый объект в сцене освещается одинаково без учета его ориентации или расположения
// const fonLight = new THREE.HemisphereLight(0xffffff, 0x002244, 0.5) 
//приятное освещение внешних сцен, таких как ландшафты, пляжи или города. 
fonLight.position.set(0, 10, 0);
scene.add(fonLight)

var light = new THREE.DirectionalLight("#ffffff", 1.5);
light.position.set(5, 10, 5);
light.castShadow = true;
light.shadow.mapSize.width = 16300; // default
light.shadow.mapSize.height = 16300; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 100; // луч
light.shadow.camera.top = 100; // луч
light.shadow.camera.bottom = -100; // луч
light.shadow.camera.left = -100; // луч
light.shadow.camera.right = 100; // луч

scene.add(light);

// const helperFon = new THREE.PointLightHelper(fonLight);
// scene.add(helperFon);
const helper = new THREE.PointLightHelper(light);
scene.add(helper);

// const geometryCube = new THREE.BoxGeometry(1, 1, 1);
// const materialCube = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometryCube, materialCube);
// cube.castShadow = true;
// scene.add(cube);


// const geometry = new THREE.PlaneGeometry(20, 20);
// const material = new THREE.MeshBasicMaterial({ color: 0xa2a2aa, side: THREE.DoubleSide });
// const plane = new THREE.Mesh(geometry, material);
// plane.rotation.x = 1.57

// plane.castShadow = true;
// plane.receiveShadow = true;
// scene.add(plane);

const geometryPlane = new THREE.PlaneGeometry(50, 50);
const materialPlane = new THREE.MeshStandardMaterial({ color: 0x323255 }); // side: THREE.DoubleSide
const plane = new THREE.Mesh(geometryPlane, materialPlane);
plane.castShadow = false;
plane.receiveShadow = true;
plane.position.set(0, 0.6, 0)
plane.rotation.set(3 * Math.PI / 2, 0, 0)
scene.add(plane);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// const car = new THREE.Mesh(geometry, material);
let loader = new GLTFLoader();
let car = null;
let wheelLeft = null;
let wheelRight = null;

loader.load('./car.glb', function (gltf) {
    car = gltf.scene;


    car.traverse(function (object) {
        console.log(object)

        if (object.isMesh) {
            if (object.name === 'Cylinder002') {
                wheelLeft = object
                // object.rotation.z = Math.PI / 6
            }
            if (object.name === 'Cylinder003') {
                wheelRight = object
                // object.rotation.z = Math.PI / 6
            }
            object.castShadow = true;
        }
    })
    // car.rotation.y = 2.4;
    // car.add(camera)
    // car.add(light)


    scene.add(car);

});

// window.addEventListener('keydown', moveCar)
// function moveCar(e) {
//     if (e.key === 'w') {
//         car.position.x -= 0.1
//     }
// }

function wheelsrotation(coal) {
    gsap.to(wheelLeft.rotation, { z: coal, duration: .3 });
    gsap.to(wheelRight.rotation, { z: coal, duration: 1 });
}

function animate() {
    requestAnimationFrame(animate);

    if (car) {
        const moveSpeed = 0.1; // Adjust this value to control the movement speed
        const rotationSpeed = 0.1; // Adjust this value to control the rotation speed

        // Move the car based on the keys pressed
        if (keys.KeyW === true) {
            car.translateX(-moveSpeed); // Move backward
            wheelsrotation(0)
        }
        if (keys.KeyS === true) {
            car.translateX(moveSpeed); // Move forward
            wheelsrotation(0)
        }

        // Rotate the car based on the keys pressed
        if (keys.KeyA === true) {
            if (keys.KeyW || keys.KeyS) {
                car.rotateY(rotationSpeed); // Rotate left
            }
            wheelsrotation(Math.PI / 6)
        }
        if (keys.KeyD === true) {
            if (keys.KeyW || keys.KeyS) {
                car.rotateY(-rotationSpeed); // Rotate right
            }
            wheelsrotation(-Math.PI / 6)
        }
    }

    stats.update();
    renderer.render(scene, camera);
}

document.addEventListener("keydown", function (e) {
    if (e.code == "KeyW" || e.code == "ArrowUp") {
        keys.KeyW = true;
    }
    if (e.code == "KeyA" || e.code == "ArrowLeft") {
        keys.KeyA = true;
    }
    if (e.code == "KeyD" || e.code == "ArrowRight") {
        keys.KeyD = true;
    }
    if (e.code == "KeyS" || e.code == "ArrowDown") {
        keys.KeyS = true;
    }
});

document.addEventListener("keyup", function (e) {
    if (e.code == "KeyW" || e.code == "ArrowUp") {
        keys.KeyW = false;
    }
    if (e.code == "KeyA" || e.code == "ArrowLeft") {
        keys.KeyA = false;
    }
    if (e.code == "KeyD" || e.code == "ArrowRight") {
        keys.KeyD = false;
    }
    if (e.code == "KeyS" || e.code == "ArrowDown") {
        keys.KeyS = false;
    }
});

animate();