// 导入 Three.js 相关库
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

// 创建场景
const scene = new THREE.Scene();
let selectedObjects = [];
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// 添加控制
const controls = new OrbitControls( camera, renderer.domElement );
controls.minDistance = 5;
controls.maxDistance = 20;
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
 
// 添加灯光

scene.add( new THREE.AmbientLight( 0xaaaaaa, 0.6 ) );

const light = new THREE.DirectionalLight( 0xddffdd, 2 );
light.position.set( 1, 1, 1 );
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;

const d = 10;

light.shadow.camera.left = - d;
light.shadow.camera.right = d;
light.shadow.camera.top = d;
light.shadow.camera.bottom = - d;
light.shadow.camera.far = 1000;

scene.add( light )
const loader1 = new OBJLoader();
loader1.load( 'models/obj/tree.obj', function ( object ) {

let scale = 1.0;

object.traverse( function ( child ) {

  if ( child instanceof THREE.Mesh ) {

    child.geometry.center();
    child.geometry.computeBoundingSphere();
    scale = 0.2 * child.geometry.boundingSphere.radius;

    const phongMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shininess: 5 } );
    child.material = phongMaterial;
    child.receiveShadow = true;
    child.castShadow = true;

  }

} );

object.position.y = 1;
object.scale.divideScalar( scale );
scene.add( object );

} );
// 添加立方体
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
const loader = new GLTFLoader();

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
const Mesh = new THREE.Mesh(mergedGeometries2, matArr)
scene.add( Mesh ); // 在场景中添加合并后的mesh(模型)
console.log(Mesh)
// scene.add( singleMergeMesh, singleMergeMesh1 ); // 在场景中添加合并后的mesh(模型)
console.log(scene)

} )

// 创建 EffectComposer
const composer = new EffectComposer(renderer);

// 添加 RenderPass
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// 添加 OutlinePass
const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
outlinePass.visibleEdgeColor.set('#35f2d1'); // 轮廓可见时的颜色
outlinePass.hiddenEdgeColor.set('#00ffff'); // 轮廓不可见时的颜色
outlinePass.edgeStrength = 5; // 轮廓强度
outlinePass.edgeGlow = 1; // 轮廓发光
outlinePass.pulsePeriod = 2; // 轮廓脉冲周期
composer.addPass(outlinePass);
const outputPass = new OutputPass();
composer.addPass( outputPass );
// 添加 FXAA Pass 以提高渲染效果
const effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
composer.addPass(effectFXAA);

// 监听鼠标移动事件，用于拾取模型
document.addEventListener('mousemove', onDocumentMouseMove);

// 渲染循环
function animate() {
  requestAnimationFrame(animate);
  composer.render();
}

// 启动渲染循环
animate();
function addSelectedObject( object ) {

  selectedObjects = [];
  selectedObjects.push( object );
  
  }
// 鼠标移动事件处理函数
function onDocumentMouseMove(event) {
  // 根据鼠标位置更新拾取对象
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  // 创建 Raycaster
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);

  // 获取与射线相交的物体数组
  const intersects = raycaster.intersectObjects([cube, scene.children[4]]);
  if ( intersects.length > 0 ) {
    const selectedObject = intersects[ 0 ].object;
    addSelectedObject( selectedObject );
    console.log(selectedObjects)
    outlinePass.selectedObjects = selectedObjects;
  
  } else {
  
    // outlinePass.selectedObjects = [];
  
  }
  // console.log(intersects.map(intersect => intersect.object))

  // // 更新 OutlinePass 的拾取对象
  // outlinePass.selectedObjects = intersects.map(intersect => intersect.object);
}
