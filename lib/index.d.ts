import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
declare type Options = {
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
export declare type GMM = {
    gltf: GLTF;
    model: THREE.Group;
    mixers: THREE.AnimationMixer[];
};
declare const GlbLoader: (url: string, options: Options) => Promise<GMM>;
export default GlbLoader;
