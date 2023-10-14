import { createEffect, createSignal, onCleanup } from "solid-js";
import { Canvas } from "../src";
import { Box } from "./Box";

import * as THREE from "three";
import { LinearEncoding, sRGBEncoding } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial';
import { LineBasicMaterial, MeshPhysicalMaterial, Vector2 } from 'three';


export function App() {
  let [
    bodyTexture,
    eyesTexture,
    teethTexture,
    bodySpecularTexture,
    bodyRoughnessTexture,
    bodyNormalTexture,
    teethNormalTexture,
    hairTexture,
    tshirtDiffuseTexture,
    tshirtNormalTexture,
    tshirtRoughnessTexture,
    hairAlphaTexture,
    hairNormalTexture,
    hairRoughnessTexture,
  ]: any = [];
  const texture_urls = [
    "/playground/assets/images/body.webp",
    "/playground/assets/images/eyes.webp",
    "/playground/assets/images/teeth_diffuse.webp",
    "/playground/assets/images/body_specular.webp",
    "/playground/assets/images/body_roughness.webp",
    "/playground/assets/images/body_normal.webp",
    "/playground/assets/images/teeth_normal.webp",
    "/playground/assets/images/h_color.webp",
    "/playground/assets/images/tshirt_diffuse.webp",
    "/playground/assets/images/tshirt_normal.webp",
    "/playground/assets/images/tshirt_roughness.webp",
    "/playground/assets/images/h_alpha.webp",
    "/playground/assets/images/h_normal.webp",
    "/playground/assets/images/h_roughness.webp",
  ];
  const [scene, setScene]:any = createSignal(undefined);
  const [camera, setCamera]:any = createSignal(undefined);
  const [renderer, setRenderer]:any = createSignal(undefined);
  const [texturesLoaded, setTexturesLoaded]:any = createSignal(false);
  const [gltf, setGltf]:any = createSignal(undefined);

  let morphTargetDictionaryBody = null;
  let morphTargetDictionaryLowerTeeth = null;

  const loadTextures = (textureLoader: any) => {
    bodyTexture = textureLoader.load(texture_urls[0]);
    bodyTexture.encoding = sRGBEncoding;
    bodyTexture.flipY = false;

    eyesTexture = textureLoader.load(texture_urls[1]);
    eyesTexture.encoding = sRGBEncoding;
    eyesTexture.flipY = false;

    teethTexture = textureLoader.load(texture_urls[2]);
    teethTexture.encoding = sRGBEncoding;
    teethTexture.flipY = false;

    bodySpecularTexture = textureLoader.load(texture_urls[3]);
    bodySpecularTexture.encoding = sRGBEncoding;
    bodySpecularTexture.flipY = false;

    bodyRoughnessTexture = textureLoader.load(texture_urls[4]);
    bodyRoughnessTexture.encoding = sRGBEncoding;
    bodyRoughnessTexture.flipY = false;

    bodyNormalTexture = textureLoader.load(texture_urls[5]);
    bodyNormalTexture.encoding = LinearEncoding;
    bodyNormalTexture.flipY = false;

    teethNormalTexture = textureLoader.load(texture_urls[6]);
    teethNormalTexture.encoding = LinearEncoding;
    teethNormalTexture.flipY = false;

    hairTexture = textureLoader.load(texture_urls[7]);
    hairTexture.encoding = sRGBEncoding;
    hairTexture.flipY = false;

    tshirtDiffuseTexture = textureLoader.load(texture_urls[8]);
    tshirtDiffuseTexture.encoding = sRGBEncoding;
    tshirtDiffuseTexture.flipY = false;

    tshirtNormalTexture = textureLoader.load(texture_urls[9]);
    tshirtNormalTexture.encoding = LinearEncoding;
    tshirtNormalTexture.flipY = false;

    tshirtRoughnessTexture = textureLoader.load(texture_urls[10]);
    tshirtRoughnessTexture.encoding = sRGBEncoding;
    tshirtRoughnessTexture.flipY = false;

    hairAlphaTexture = textureLoader.load(texture_urls[11]);
    hairAlphaTexture.encoding = sRGBEncoding;
    hairAlphaTexture.flipY = false;

    hairNormalTexture = textureLoader.load(texture_urls[12]);
    hairNormalTexture.encoding = LinearEncoding;
    hairNormalTexture.flipY = false;

    hairRoughnessTexture = textureLoader.load(texture_urls[13]);
    hairRoughnessTexture.encoding = sRGBEncoding;
    hairRoughnessTexture.flipY = false;

    setTexturesLoaded(true);
  }

  createEffect(() => {
    const scene = new THREE.Scene();
    setScene(scene);

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    setCamera(camera);

    // Create a renderer
    let r = new THREE.WebGLRenderer();
    r.setSize(window.innerWidth, window.innerHeight);

    document.getElementById('canvas-container')?.appendChild(r.domElement);
    setRenderer(r);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/playground/assets/images/bg.webp', function (texture) {
      // Create a material using the loaded texture
      const material = new THREE.MeshBasicMaterial({ map: texture });

      // Create a geometry for the mesh
      const geometry = new THREE.BoxGeometry(10, 10, 1);

      // Create a mesh using the geometry and material
      const mesh = new THREE.Mesh(geometry, material);

      // Add the mesh to the scene
      scene.add(mesh);

      // Render the scene
      r.render(scene, camera);

    });

    // Loading textures
    loadTextures(textureLoader);

  });

  createEffect(() => {
    if (scene() && camera() && renderer() && texturesLoaded()) {
      console.log("scene, camera, renderer, textures loaded");

      const gltfLoader = new GLTFLoader();
      gltfLoader.load('/playground/assets/model.glb', function (g: any) {
        console.log(g);
        const model = g.scene;
        model.position.x = 0;
        model.position.y = -6.5;
        model.position.z = 3;
        model.scale.x = 4;
        model.scale.y = 4;
        model.scale.z = 4;
        setGltf(g);
      });
    }
  });

  createEffect(() => {
    if (!gltf()) return;
    console.log("gltf loaded");
    gltf().scene.traverse((node: any) => {
      if(node.type === 'Mesh' || node.type === 'LineSegments' || node.type === 'SkinnedMesh') {
  
        node.castShadow = true;
        node.receiveShadow = true;
        node.frustumCulled = false;
  
        if (node.name.includes("Body")) {
  
          node.castShadow = true;
          node.receiveShadow = true;
  
          node.material = new MeshPhysicalMaterial();
          node.material.map = bodyTexture;
          // node.material.shininess = 60;
          node.material.roughness = 1.7;
  
          // node.material.specularMap = bodySpecularTexture;
          node.material.roughnessMap = bodyRoughnessTexture;
          node.material.normalMap = bodyNormalTexture;
          node.material.normalScale = new Vector2(0.6, 0.6);
  
          morphTargetDictionaryBody = node.morphTargetDictionary;
  
          node.material.envMapIntensity = 0.8;
          // node.material.visible = false;
  
        }
  
        if (node.name.includes("Eyes")) {
          node.material = new MeshStandardMaterial();
          node.material.map = eyesTexture;
          // node.material.shininess = 100;
          node.material.roughness = 0.1;
          node.material.envMapIntensity = 0.5;
  
  
        }
  
        if (node.name.includes("Brows")) {
          node.material = new LineBasicMaterial({color: 0xff0000});
          node.material.linewidth = 1;
          node.material.opacity = 0.5;
          node.material.transparent = true;
          node.visible = false;
        }
  
        if (node.name.includes("Teeth")) {
  
          node.receiveShadow = true;
          node.castShadow = true;
          node.material = new MeshStandardMaterial();
          node.material.roughness = 0.1;
          node.material.map = teethTexture;
          node.material.normalMap = teethNormalTexture;
  
          node.material.envMapIntensity = 0.7;
  
  
        }
  
        if (node.name.includes("Hair")) {
          node.material = new MeshStandardMaterial();
          node.material.map = hairTexture;
          node.material.alphaMap = hairAlphaTexture;
          node.material.normalMap = hairNormalTexture;
          node.material.roughnessMap = hairRoughnessTexture;
          
          node.material.transparent = true;
          node.material.depthWrite = false;
          node.material.side = 2;
          node.material.color.setHex(0x000000);
          
          node.material.envMapIntensity = 0.3;
  
        
        }
  
        if (node.name.includes("TSHIRT")) {
          node.material = new MeshStandardMaterial();
  
          node.material.map = tshirtDiffuseTexture;
          node.material.roughnessMap = tshirtRoughnessTexture;
          node.material.normalMap = tshirtNormalTexture;
          node.material.color.setHex(0xffffff);
  
          node.material.envMapIntensity = 0.5;
  
        }
  
        if (node.name.includes("TeethLower")) {
          morphTargetDictionaryLowerTeeth = node.morphTargetDictionary;
        }
  
      }
    });
    
    console.log(gltf().scene)
    console.log("printed");

    scene().add(gltf().scene);
    renderer().render(scene(), camera());
  }, [gltf]);

  return (
    <div id="canvas-container" style="position: absolute; top: 0; left: 0;"></div>
  );
}