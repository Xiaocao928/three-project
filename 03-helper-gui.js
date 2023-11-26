import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js' 

let scene, camera, renderer, controls, axesHelper, ambientLight, plane, cylinder, spotLight, gui, spotLightHelper

initRenderer()
initCamera()
initScene()
initAxesHelper()
initControls()
initAmbientLight()
initMesh()
initSpotLight()
initShadow()
initSpotLightHelper()
buildGUI()
render()

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / this.window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, this.window.innerHeight)
})
function initScene() {
  scene = new THREE.Scene()
}

function initCamera () {
  camera = new THREE.PerspectiveCamera(40, window.innerWidth/ window.innerHeight, 1, 1000)
  camera.position.set(0, 120, 100)
  camera.lookAt(0, 0, 0 )
}

function initRenderer () {
  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
}

function initAxesHelper() {
  axesHelper = new THREE.AxesHelper(50)
  scene.add(axesHelper)
}

function initControls() {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', render)
}

function initAmbientLight() {
  ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
  scene.add(ambientLight)
}

function initMesh () {
  const geometryPlane = new THREE.PlaneGeometry(2000, 2000)
  const materialPlane = new THREE.MeshPhongMaterial({color: 0x808080})
  plane = new THREE.Mesh(geometryPlane, materialPlane)
  plane.rotation.x = - Math.PI / 2
  plane.position.set(0, -5, 0)
  scene.add(plane)

  const geometryCylinder = new THREE.CylinderGeometry(5, 5, 2, 24, 1, false)
  const materialCyiner = new THREE.MeshPhongMaterial({color: 0x4080ff})
  cylinder = new THREE.Mesh(geometryCylinder, materialCyiner)
  cylinder.position.set(0, 5, 0)
  scene.add(cylinder)
}

function initSpotLight() {
  spotLight = new THREE.SpotLight(0xffffff, 100000)
  spotLight.position.set(-50, 80, 0)
  spotLight.angle = Math.PI / 6
  spotLight.penumbra = 0.2 //该属性设置照明区域在边缘附近的平滑衰减速度，取值范围在 0 到 1 之间。默认值为 0.0。
  scene.add(spotLight)
}

function initShadow() {
  plane.receiveShadow = true
  cylinder.castShadow = true
  spotLight.castShadow = true
  renderer.shadowMap.enabled = true
}

function initSpotLightHelper() {
  spotLightHelper = new THREE.SpotLightHelper(spotLight)
  scene.add(spotLightHelper)
}

function buildGUI() {
  gui = new GUI()
  const spotLightFolder = gui.addFolder('Spot Light')
  spotLightFolder.addColor(spotLight, 'color').onChange(function(val) {
    spotLight.color.set(val)
    render()
  })
  spotLightFolder.add(spotLight, 'angle', 0, Math.PI /2).onChange(function(val) {
    spotLight.angle = val
    spotLightHelper.update()
    render()
  })
  spotLightFolder.add(spotLight, 'penumbra', 0, 1).onChange(function(val) {
    spotLight.penumbra = val
    spotLightHelper.update()
    render()
  })
  spotLightFolder.close()
  const cameraFolder = gui.addFolder('Camera')
  cameraFolder.add(camera.position, 'x', -1000, 1000).step(1).onChange(function(val) {
    camera.position.x = val
    render()
  })
  cameraFolder.close()
  gui.close()
}
function render() {
  renderer.render(scene, camera)
  // requestAnimationFrame(render)
}