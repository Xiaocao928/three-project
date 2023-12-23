import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let scene, camera, renderer, controls, axesHelper, ambientLight, plane, cylinder, spotLight

initRenderer()
initCamera()
initScene()
initAxesHelper()
initControls()
initAmbientLight()
setTimeout(() => {
  initMesh()
  initShadow()
},5000)
// initMesh()
initSpotLight()

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
  scene.background = new THREE.Color(0x444444)
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
  // scene.add(cylinder)

  // 创建shape的平面几何体
  const trackShape = new THREE.Shape()
  .moveTo( 0.05, 0.05 )
  .lineTo( 0.05, 20 )
  .absarc( 0.1, 20, 0.05, Math.PI, 0, true )
  .lineTo( 0.15, 0.05 )
  .absarc( 0.1, 0.05, 0.05, 2 * Math.PI, Math.PI, true );
  const shapeGeometry = new THREE.ShapeGeometry( trackShape );
  const shapeMaterial = new THREE.MeshPhongMaterial({color: 0x1cd66c})
  const mesh = new THREE.Mesh(shapeGeometry, shapeMaterial)
  mesh.position.set(4, 0, 0)
  mesh.scale.set (0.05, 0.1, 0.1)
  // mesh.rotation.y =  Math.PI / 2
  // 使用 ShapeGeometry 创建几何体
  const geometry = new THREE.ShapeGeometry(trackShape);

  // 创建材质
  const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

  // 创建线条
  const line = new THREE.Line(geometry, material);

  // 将线条添加到场景中
  // scene.add(line);
  scene.add(mesh)

// 创建纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('http://10.7.0.194:8080/data/texture/floorMaterial.jpeg');

// 创建精灵材质
const spriteMaterial = new THREE.SpriteMaterial({ map: texture });

// 创建精灵模型
const sprite = new THREE.Sprite(spriteMaterial);

// 设置精灵的位置
sprite.position.set(3, 3, 0);

// 将精灵添加到场景中
scene.add(sprite);
// 使用示例
const bottomColor = new THREE.Color(0xff0000); // 红色
const middleColor = new THREE.Color(0x00ff00); // 绿色
const topColor = new THREE.Color(0x0000ff); // 蓝色

drawGradientPlane(bottomColor, middleColor, topColor);

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
function render() {
  renderer.render(scene, camera)
  // requestAnimationFrame(render)
}

function drawGradientPlane(bottomColor, middleColor, topColor) {
  // 创建平面几何体
  const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);

  // 如果使用 BufferGeometry，获取顶点的方式可能会有所不同
  const vertices = planeGeometry.attributes.position.array;

  // 为每个顶点指定颜色
  const colors = [];
  const color = new THREE.Color();

  for (let i = 0; i < vertices.length; i += 3) {
    // 根据顶点的 y 坐标计算颜色
    const normalizedY = (vertices[i + 1] + 2.5) / 5; // 将 y 归一化到 [0, 1]

    // 根据 y 的位置插值计算颜色
    if (normalizedY < 0.33) {
      color.copy(bottomColor);
    } else if (normalizedY < 0.66) {
      color.lerp(bottomColor, (normalizedY - 0.33) * 3);
      color.lerp(middleColor, (normalizedY - 0.33) * 3);
    } else {
      color.copy(middleColor);
      color.lerp(topColor, (normalizedY - 0.66) * 3);
    }
    // color.lerp(bottomColor, normalizedY);
    // color.lerp(middleColor, normalizedY);
    // color.lerp(topColor, normalizedY);
    // 将颜色添加到数组中
    colors.push(color.r, color.g, color.b);
  }

  // 创建顶点颜色属性
  planeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  // 使用 Lambert 材质并开启顶点颜色
  const vertexColorMaterial = new THREE.MeshLambertMaterial({ vertexColors: true});

  // 创建平面网格
  const gradientPlane = new THREE.Mesh(planeGeometry, vertexColorMaterial);

  // 添加到场景
  scene.add(gradientPlane);

  return gradientPlane;
}

function adjustColor(hexColor, factor) {
  // 解析HEX值
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);

  // 调整亮度或对比度
  r = Math.min(255, Math.max(0, Math.round(r * factor)));
  g = Math.min(255, Math.max(0, Math.round(g * factor)));
  b = Math.min(255, Math.max(0, Math.round(b * factor)));

  // 生成新的HEX值
  const newHexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  
  return newHexColor;
}

// 示例：生成深颜色
const darkColor = adjustColor("#3498db", 0.5);
console.log("深颜色:", darkColor);

// 示例：生成浅颜色
const lightColor = adjustColor("#3498db", 1.4);
console.log("浅颜色:", lightColor);

// function rgbToHex(color) {
//    // 将 RGB 转换回十六进制
//    const r = Math.round(color.r * 255);
//    const g = Math.round(color.g * 255);
//    const b = Math.round(color.b * 255);
//    const hex = "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
//    return hex;
// }

// // 给定的颜色
// const givenColor = "#68b4ff";

// // 生成渐变颜色
// const gradientColors = generateGradientColors(givenColor);

// console.log("原始颜色:", gradientColors.original);
// console.log("深色:", gradientColors.dark);
// console.log("浅色:", gradientColors.light);
// console.log("原始颜色 (Hex):", gradientColors.originalHex);
// console.log("深色 (Hex):", gradientColors.darkHex);
// console.log("浅色 (Hex):", gradientColors.lightHex);



