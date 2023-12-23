// 导入 Three.js 相关库
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建倒圆角的平面几何体
const shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.lineTo(0, 50);
shape.lineTo(50, 50);
shape.lineTo(50, 0);
shape.lineTo(10, 0);
shape.quadraticCurveTo(0, 0, 0, 10); // 添加圆角

const geometry1 = new THREE.ShapeGeometry(shape);

// 创建材质
const material1 = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0, // 设置透明度为零
});

// 创建倒圆角的网格
const mesh = new THREE.Mesh(geometry1, material1);

// 将网格添加到场景中
scene.add(mesh);
// 添加立方体
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

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

// 鼠标移动事件处理函数
function onDocumentMouseMove(event) {
  // 根据鼠标位置更新拾取对象
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  // 创建 Raycaster
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);

  // 获取与射线相交的物体数组
  const intersects = raycaster.intersectObjects([cube]);

  // 更新 OutlinePass 的拾取对象
  outlinePass.selectedObjects = intersects.map(intersect => intersect.object);
}
