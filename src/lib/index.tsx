import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type Options = {
  onProcess: (loaded: number, totle: number) => {};
  loop: boolean;
  castShadow: boolean | string[];
  receiveShadow: boolean | string[];
  material: {
    metalness: number;
    roughness: number;
    clearcoat: number;
    clearcoatRoughness: number;
  };
};

const defaultOptions: Options = {
  onProcess: (loaded, total) => `${(loaded / total) * 100}% loaded`,
  loop: true,
  castShadow: true,
  receiveShadow: false,
  material: {
    metalness: 0,
    roughness: 1,
    clearcoat: 0,
    clearcoatRoughness: 0.5,
  },
};

const GlbLoader = (url: string, options: Options) => {
  const opt = { ...defaultOptions, ...options };
  const { onProcess, loop, castShadow, receiveShadow, material: mat } = opt;

  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderConfig({ type: 'js' });
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  loader.setDRACOLoader(dracoLoader);

  return new Promise((res, rej) => {
    loader.load(
      url,
      (eventTarget: GLTF) => {
        const mixers: THREE.AnimationMixer[] = [];
        const model: THREE.Group = eventTarget.scene;

        eventTarget.animations.forEach((clip) => {
          const ani = new THREE.AnimationMixer(model);
          if (loop) {
            ani.clipAction(clip).play().setLoop(THREE.LoopRepeat, Infinity);
          } else {
            const actions = ani.clipAction(clip).play().setLoop(THREE.LoopOnce, 1);
            actions.clampWhenFinished = true;
          }
          mixers.push(ani);
        });

        eventTarget.scene.traverse((node) => {
          const mesh = node;
          if (node instanceof THREE.Mesh) {
            const { name } = mesh;

            if (typeof castShadow === 'boolean') {
              mesh.castShadow = castShadow;
            } else {
              castShadow.forEach((e) => {
                if (e === name) mesh.castShadow = true;
              });
            }

            if (typeof receiveShadow === 'boolean') {
              mesh.receiveShadow = receiveShadow;
            } else {
              receiveShadow.forEach((e) => {
                if (e === name) mesh.receiveShadow = true;
              });
            }

            // ? => https://threejs.org/manual/#en/materials
            // @ts-ignore
            const { material } = mesh;
            if (material) {
              material.metalness = mat.metalness;
              material.roughness = mat.roughness;
              material.clearcoat = mat.clearcoat;
              material.clearcoatRoughness = mat.clearcoatRoughness;
            }
          }
        });

        res({ model, mixers, eventTarget });
      },
      (xhr) => {
        const { loaded, total } = xhr;
        onProcess(loaded, total);
      },
      () => {
        rej(new Error(`[lesca-glb-loader] load ${url} error`));
      },
    );
  });
};

export default GlbLoader;
