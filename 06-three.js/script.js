// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// Light
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(2, 4, 2);
scene.add(dirLight);

// Animation-related variables
let model, mixer, actions = {}, activeAction;

// Load Model
const loader = new THREE.GLTFLoader();
loader.load(
  'models/chevalier_sword.glb', 
  (gltf) => {
    model = gltf.scene;
    model.scale.set(1.5, 1.5, 1.5); // make model bigger
    model.position.y = 0; // move it to the ground
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      actions[clip.name] = mixer.clipAction(clip);
    });

    // Play default animation
    if (actions["Idle"]) {
      activeAction = actions["Idle"];
      activeAction.play();
    } else {
      console.warn("No animation named 'Idle' found.");
    }
  },
  undefined,
  (error) => {
    console.error("Error loading model:", error);
  }
);

// Click to trigger 'Jump' animation
window.addEventListener('click', () => {
  if (!mixer || !actions["Jump"]) return;

  activeAction.fadeOut(0.3);

  const jumpAction = actions["Jump"];
  jumpAction.reset().fadeIn(0.3).play();

  mixer.addEventListener("finished", () => {
    jumpAction.fadeOut(0.3);
    activeAction.reset().fadeIn(0.3).play();
  });
});

// Animate loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}
animate();

// Handle Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
