import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let scene, camera, renderer, cube, axesHelper, controls

init()
render()

function init() {
  scene = new THREE.Scene()

  axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
  camera.position.set(0, 2, 5)

  renderer = new THREE.WebGL1Renderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({color: 0xffffff})
  cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  controls = new OrbitControls(camera, renderer.domElement)
}

function render() {
  renderer.render(scene, camera)
  cube.rotation.y +=0.01
  requestAnimationFrame(render)
}