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
declare const GlbLoader: (url: string, options: Options) => Promise<unknown>;
export default GlbLoader;
