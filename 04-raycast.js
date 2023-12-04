import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let scene, camera, renderer, light, meshes
let axesHelper
let controls

initRenderer()
initCamera()
scene = new THREE.Scene()
initLight()
initAxesHelper()
controls = new OrbitControls(camera, renderer.domElement)
render()
window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / this.window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, this.window.innerHeight)
})

function initCamera () {
  camera = new THREE.PerspectiveCamera(40, window.innerWidth/ window.innerHeight, 1, 1000)
  camera.position.set(10, 10, 10)
}

function initRenderer () {
  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
}

function initAxesHelper() {
  axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
}

function initLight() {
  light = new THREE.HemisphereLight(0xffffff, 0x888888)
  light.position.set(0, 1, 0)
  scene.add(light)
}

function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}