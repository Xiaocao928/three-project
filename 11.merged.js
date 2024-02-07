import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';


let scene, renderer, camera, controls, geometry, material, position, quaternion, scale, mesh
const geometries = []
const materials = []
const mouse = new THREE.Vector2();
let prevIntersectedObject

 position = new THREE.Vector3();
 quaternion = new THREE.Quaternion();
 scale = new THREE.Vector3();
init()
initLight()
initMesh()
animate()


function init() {
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000)
  camera.position.set(0, 0, 10)
  controls = new OrbitControls(camera,renderer.domElement)
}

function initLight() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)
}

function initMesh() {
			const matrix = new THREE.Matrix4();
      geometry = new THREE.SphereGeometry(1, 32, 32)
      material = new THREE.MeshPhongMaterial({ color: 0xff0000 })

			for ( let i = 0; i < 500; i ++ ) {

				randomizeMatrix( matrix );

				const instanceGeometry = geometry.clone();
				instanceGeometry.applyMatrix4( matrix );

				geometries.push(    
          {
            geometry: instanceGeometry,
            matrix: matrix,
            position: new THREE.Vector3(matrix.elements[12], matrix.elements[13], matrix.elements[14]), // 通过矩阵元素获取位置信息
          });
          materials.push(material.clone())

			}

			const mergedGeometry = BufferGeometryUtils.mergeGeometries( geometries.map(item => item.geometry), true );
      mesh = new THREE.Mesh( mergedGeometry, materials)

			scene.add( mesh )
      console.log(scene)
}

function randomizeMatrix (matrix) {


    position.x = Math.random() * 40 - 20;
    position.y = Math.random() * 40 - 20;
    position.z = Math.random() * 40 - 20;

    quaternion.random();

    scale.x = scale.y = scale.z = Math.random() * 1;

    matrix.compose( position, quaternion, scale );
 
}
document.addEventListener('mousemove', onMouseMove, false)
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
function render() {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    // 获取相交的第一个对象
    const intersectedObject = intersects[0].object;
        // 判断相交的对象是否是小球
        if (intersectedObject === mesh) {
            // 判断哪个小球被相交
            for (let i = 0; i < 500; i++) {
                const position = geometries[i].position;
                // console.log(position.distanceTo(intersects[0].point))
                if (position.distanceTo(intersects[0].point) < 1) {
                  if(prevIntersectedObject && prevIntersectedObject !== i) materials[prevIntersectedObject].color.set(0xff0000)
                    // 修改相交小球的颜色
                    // console.log(geometries[i])
                    materials[i].color.set(0x269645); // 设置为绿色
                    const position = new THREE.Vector3();
                    const quaternion = new THREE.Quaternion();
                    const scale = new THREE.Vector3();
                    geometries[i].matrix.decompose(position, quaternion, scale)
                    position.x += 1
                    geometries[i].matrix.compose(position, quaternion, scale)
                    const mergedGeometry = BufferGeometryUtils.mergeGeometries(
                      geometries.map(item => item.geometry),
                      true
                    );
                    mesh.geometry = mergedGeometry;
          
                    // 更新模型的矩阵
                    mesh.updateMatrix();
                    mesh.updateMatrixWorld(true);
                    prevIntersectedObject = i; // 记录当前相交小球
                    break;
                }
            }
        }
}
renderer.render(scene, camera)
}

function animate() {
  requestAnimationFrame(animate)
  render()
  controls.update()
}
  