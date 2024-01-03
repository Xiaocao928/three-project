// Simple three.js example

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';


var mesh, renderer, scene, camera, controls, composer, outlinePass;
var selectedObjects = [];
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();

init();
animate();

function init() {
    // scene
    scene = new THREE.Scene();
    
    // camera
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 20, 20, 20 );
    
    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild( renderer.domElement );
    
  	composer = new EffectComposer(renderer);
		
  	let renderPass = new RenderPass(scene, camera);
  	composer.addPass(renderPass);
    
    outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    composer.addPass(outlinePass);

    // controls
    controls = new OrbitControls( camera, renderer.domElement );
    
    // ambient
    scene.add( new THREE.AmbientLight( 0x222222 ) );
    
    // light
    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 20,20, 0 );
    scene.add( light );
    
    // axes
    scene.add( new THREE.AxesHelper( 20 ) );

    // geometry
    var geometry = new THREE.SphereGeometry( 2, 12, 8 );
    var boxGeo = new THREE.BoxGeometry(4, 4, 4);
    
    // material
    var material = new THREE.MeshPhongMaterial( {
        color: 0x00ffff, 
        flatShading: true,
        transparent: true,
        opacity: 0.7,
    } );
    var boxMat = new THREE.MeshNormalMaterial();
    
    // mesh
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    var instancedMesh = new THREE.InstancedMesh(boxGeo, boxMat, 4);
    scene.add(instancedMesh);
    instancedMesh.position.set(6, 0, 0);
    instancedMesh.setMatrixAt(0, new THREE.Matrix4().makeTranslation(12, 0, 0));
    instancedMesh.setMatrixAt(1, new THREE.Matrix4().makeTranslation(6, 0, 0));
    instancedMesh.setMatrixAt(2, new THREE.Matrix4().makeTranslation(0, 0, 6));
    instancedMesh.setMatrixAt(3, new THREE.Matrix4().makeTranslation(6, 0, 6));
    instancedMesh.instanceMatrix.needsUpdate = true;
    
}

function animate() {

    requestAnimationFrame( animate );
    
    //controls.update();

    //renderer.render( scene, camera );
    composer.render();

}

/**
 * handle outlining on interaction
 */
function onTouchMove(event) {
  let x, y;

  if (event.changedTouches) {
    x = event.changedTouches[0].pageX;
    y = event.changedTouches[0].pageY;
  } else {
    x = event.clientX;
    y = event.clientY;
  }

  mouse.x = (x / window.innerWidth) * 2 - 1;
  mouse.y = -(y / window.innerHeight) * 2 + 1;

  checkIntersection();
}

// OutlinePass example implementatiion
function addSelectedObject(object) {
  selectedObjects = [];
  selectedObjects.push(object);
}

function checkIntersection() {
  raycaster.setFromCamera(mouse, camera);

  let intersects = raycaster.intersectObjects([scene], true);

  if (intersects.length > 0) {
    let selectedObject = intersects[0].object;
    addSelectedObject(selectedObject);
    outlinePass.selectedObjects = selectedObjects;
  } else {
    outlinePass.selectedObjects = [];
  }
}

window.addEventListener('mousemove', onTouchMove);
window.addEventListener('touchmove', onTouchMove);
