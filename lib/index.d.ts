import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
type Options = {
    onProcess: (loaded: number, total: number) => {};
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
export type GMM = {
    gltf: GLTF;
    model: THREE.Group;
    mixers: THREE.AnimationMixer[];
};
declare const GlbLoader: (url: string, options: Options) => Promise<GMM>;
export default GlbLoader;
