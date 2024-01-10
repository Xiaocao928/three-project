import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls, axesHelper
init();
initLights();
initMesh()
render()
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 10, 10)
  camera.lookAt(0, 0, 0 )
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    // alpha: true,
    precision: 'highp',
    logarithmicDepthBuffer: false // 设置对数深度缓冲区
  })
  renderer.sortObjects = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio)

 
  document.body.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  axesHelper = new THREE.AxesHelper(200);
  scene.add(axesHelper);
}
function initMesh(){
  const height = 0.0012; // 高度
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      baseColor: { value: new THREE.Vector3(0.7681511472425808, 0.9386857284565036, 0.9911020971136257) },
      targetColor: { value: new THREE.Vector3(0.011612245176281512, 0.6724431569510133, 0.1499597898006365) },
      height: { value: height || 0.15 }
    },
    side: THREE.FrontSide,
    transparent: true,
    depthTest: true,
    depthWrite: true,
    vertexShader: [
      'varying vec3 modelPos;',
      'void main() {',
      '   modelPos = position;',
      '	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform vec3 baseColor;',
      'uniform vec3 targetColor;',
      'uniform float height;',
      'varying vec3 modelPos;',
      'void main() {',
      '  gl_FragColor = vec4(targetColor.xyz, 1);', // (0.0 - modelPos.z/height)*(0.0 - modelPos.z/height)
      '  if(modelPos.z/height > 0.333 && modelPos.z/height < 0.666) {gl_FragColor = vec4(baseColor.xyz, 1);}',
      '  if(modelPos.z/height > 0.666) {gl_FragColor = vec4(targetColor.xyz, 1);}',
      '}'
    ].join('\n')
  })
  const color = new THREE.Vector3(0.7912979403281553, 0.04970656597728775, 0.030713443727452196)
  const mat3 = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1
  })
  const squareShape = new THREE.Shape();
  squareShape.moveTo(-0.5, -0.5);
  squareShape.lineTo(0.5, -0.5);
  squareShape.lineTo(0.5, 0.5);
  squareShape.lineTo(-0.5, 0.5);
  squareShape.lineTo(-0.5, -0.5);

  // 设置 ExtrudeGeometry 的参数
  const extrudeSettings = {
    depth: 1, // 正方体的深度
    bevelEnabled: false // 禁用斜角
  };

  // 创建 ExtrudeGeometry
  const squareGeometry = new THREE.ExtrudeGeometry(squareShape, extrudeSettings);

  // 创建 Mesh
  const squareMesh = new THREE.Mesh(squareGeometry, [mat3, mat]);
  squareMesh.scale.set(1, 1, 1);
  squareMesh.renderOrder = 1;
  squareMesh.rotation.x = Math.PI / 2;
  const squareMesh1 = new THREE.Mesh(squareGeometry, [mat3, mat]);
  squareMesh1.scale.set(1, 1, 1);
  squareMesh1.position.set(1.5, -0.5, 0);
  squareMesh1.rotation.y = Math.PI / 2;
  squareMesh1.renderOrder = 1;

  // 添加到场景
  scene.add(squareMesh);
  scene.add(squareMesh1);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const mesh = new THREE.Mesh(geometry, mat);
  // scene.add(mesh);
  const geometry1 = new THREE.PlaneGeometry(5, 5);
  const mesh1 = new THREE.Mesh(geometry1, mat3);
  mesh1.position.z = 1;
  mesh1.position.y = -1;
  mesh1.rotation.x = -Math.PI / 2;
  // scene.add(mesh1);
}
function initLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(10, 10, 0);
  scene.add(directionalLight);
}
function render() {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}