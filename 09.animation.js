import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls, clock, mixer
init()
createMesh()
animate()
function init() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(25, 25, 50)
  camera.lookAt(scene.position)
  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  controls = new OrbitControls(camera, renderer.domElement)
}
function createMesh() {
  clock = new THREE.Clock();
  const geometry = new THREE.BoxGeometry(10, 10, 10)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  const scaleKF = new THREE.VectorKeyframeTrack('.scale', [0, 0.5, 1], [1, 1, 1, 2, 2, 2, 10, 3, 3])
  const clip = new THREE.AnimationClip('Action', 1, [scaleKF])
  mixer = new THREE.AnimationMixer(cube)
  // create a ClipAction and set it to play
  const clipAction = mixer.clipAction(clip)
  clipAction.play()
  animate()
}

function animate() {

  requestAnimationFrame( animate );

  const delta = clock.getDelta();

  mixer.update( delta );

  controls.update();


  renderer.render( scene, camera );

}