import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
let scene, camera, renderer, controls, axesHelper, ambientLight, plane, cylinder, spotLight, cube
let composer,outlinePass,outputPass,effectFXAA,renderPass,singleMergeMesh2

initRenderer()
initCamera()
initScene()
initAxesHelper()
initControls()
initAmbientLight()
initMesh()
initSpotLight()
initShadow()
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
 const loader = new GLTFLoader()
 loader.load( 'http://10.7.0.194:8080/data/gltfModel/archive.gltf', function ( gltf ) {
  const model = gltf.scene
  // scene.add(model)
  const model1 = model.children.find( (item) => item.name === '外柜1')
  const model2 = model.children.find( (item) => item.name === '内柜1')
  const model3 = model.children.find( (item) => item.name === '外柜2')
  const model4 = model.children.find( (item) => item.name === '内柜2')
  const meshArr = []
  const meshArr1 = []
  let geometryArray = []; // 将你的要合并的多个geometry放入到该数组
  let materialArray = []; // 将你的要赋值的多个material放入到该数组
  let geometryArray1 = []; // 将你的要合并的多个geometry放入到该数组
  let materialArray1 = []; // 将你的要赋值的多个material放入到该数组
  function traverseMeshes(obj, meshArr) {
    // 记录已经处理过的对象，避免重复处理
    const processedObjects = new Set();

    function traverse(child) {
      if (!processedObjects.has(child)) {
        processedObjects.add(child);

        child.updateMatrixWorld(true)
        if (child.isMesh) {
          child.geometry.applyMatrix4(child.matrixWorld);
          meshArr.push(child);
        } else if (child.isGroup) {
          child.children.forEach(traverse); // 使用 forEach 遍历子对象
        }
      }
    }

    obj.traverse(traverse);
  }
  traverseMeshes(model1, meshArr)
  traverseMeshes(model2, meshArr)
  meshArr.forEach(mesh => {
    geometryArray.push(mesh.geometry)
    materialArray.push(mesh.material)
  })
  traverseMeshes(model3, meshArr1)
  traverseMeshes(model4, meshArr1)

  meshArr.forEach(mesh => {
    geometryArray1.push(mesh.geometry)
    materialArray1.push(mesh.material)
  })
  console.log(materialArray)
  const mergedGeometries = BufferGeometryUtils.mergeGeometries(geometryArray, true);
  const singleMergeMesh = new THREE.Mesh(mergedGeometries, materialArray)
  const mergedGeometries1 = BufferGeometryUtils.mergeGeometries(geometryArray1, true);
  const singleMergeMesh1 = new THREE.Mesh(mergedGeometries1, materialArray1)
  singleMergeMesh.position.set(0, 1, 0)
  singleMergeMesh1.position.set(1, 1, 0)
  singleMergeMesh.updateMatrixWorld(true);
  singleMergeMesh1.updateMatrixWorld(true);
  singleMergeMesh.geometry.applyMatrix4(singleMergeMesh.matrixWorld)
  singleMergeMesh1.geometry.applyMatrix4(singleMergeMesh1.matrixWorld)
  console.log(singleMergeMesh)
  // 将singleMergeMesh 与 singleMergeMesh1 合并
  const geoArr = []
  geoArr.push(singleMergeMesh.geometry)
  const matArr = singleMergeMesh.material.concat(singleMergeMesh1.material)
  geoArr.push(singleMergeMesh1.geometry)
  // matArr.push(singleMergeMesh1.material)
  console.log(matArr)
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
  const mergedGeometries2 = BufferGeometryUtils.mergeGeometries(geoArr, true);
  singleMergeMesh2 = new THREE.Mesh(mergedGeometries2, matArr)
  scene.add( singleMergeMesh2 ); // 在场景中添加合并后的mesh(模型)
  console.log(singleMergeMesh2)
  // scene.add( singleMergeMesh, singleMergeMesh1 ); // 在场景中添加合并后的mesh(模型)
  console.log(scene)

  render();
  initOutline()

} );
}

function initSpotLight() {
  spotLight = new THREE.SpotLight(0xffffff, 100000)
  spotLight.position.set(-50, 80, 0)
  spotLight.angle = Math.PI / 3
  spotLight.penumbra = 0.2 //该属性设置照明区域在边缘附近的平滑衰减速度，取值范围在 0 到 1 之间。默认值为 0.0。
  scene.add(spotLight)
}
function initOutline() {
  composer = new EffectComposer( renderer );

  const renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );

  outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
  outlinePass.edgeStrength=3.0,
  outlinePass.edgeGlow=0.0,
  outlinePass.edgeThickness= 1.0,
  outlinePass.pulsePeriod= 0,
  outlinePass.visibleEdgeColor.set('#ffffff');
  outlinePass.hiddenEdgeColor.set( '#190a05');
  composer.addPass( outlinePass );


  const outputPass = new OutputPass();
  composer.addPass( outputPass );

  effectFXAA = new ShaderPass( FXAAShader );
  effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
  composer.addPass( effectFXAA );
  outlinePass.selectedObjects = [singleMergeMesh2]
  console.log(composer)

}
function initShadow() {
  // plane.receiveShadow = true
  // cylinder.castShadow = true
  spotLight.castShadow = true
  renderer.shadowMap.enabled = true
}
function render() {
  renderer.render(scene, camera)
  // requestAnimationFrame(render)
}