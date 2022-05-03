var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
define(["require", "exports", "three", "three/examples/jsm/loaders/DRACOLoader", "three/examples/jsm/loaders/GLTFLoader"], function (require, exports, THREE, DRACOLoader_1, GLTFLoader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    THREE = __importStar(THREE);
    var defaultOptions = {
        onProcess: function (loaded, total) { return "".concat((loaded / total) * 100, "% loaded"); },
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
    var GlbLoader = function (url, options) {
        var opt = __assign(__assign({}, defaultOptions), options);
        var onProcess = opt.onProcess, loop = opt.loop, castShadow = opt.castShadow, receiveShadow = opt.receiveShadow, mat = opt.material;
        var loader = new GLTFLoader_1.GLTFLoader();
        var dracoLoader = new DRACOLoader_1.DRACOLoader();
        dracoLoader.setDecoderConfig({ type: 'js' });
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        loader.setDRACOLoader(dracoLoader);
        return new Promise(function (res, rej) {
            loader.load(url, function (eventTarget) {
                var mixers = [];
                var model = eventTarget.scene;
                eventTarget.animations.forEach(function (clip) {
                    var ani = new THREE.AnimationMixer(model);
                    if (loop) {
                        ani.clipAction(clip).play().setLoop(THREE.LoopRepeat, Infinity);
                    }
                    else {
                        var actions = ani.clipAction(clip).play().setLoop(THREE.LoopOnce, 1);
                        actions.clampWhenFinished = true;
                    }
                    mixers.push(ani);
                });
                eventTarget.scene.traverse(function (node) {
                    var mesh = node;
                    if (node instanceof THREE.Mesh) {
                        var name_1 = mesh.name;
                        if (typeof castShadow === 'boolean') {
                            mesh.castShadow = castShadow;
                        }
                        else {
                            castShadow.forEach(function (e) {
                                if (e === name_1)
                                    mesh.castShadow = true;
                            });
                        }
                        if (typeof receiveShadow === 'boolean') {
                            mesh.receiveShadow = receiveShadow;
                        }
                        else {
                            receiveShadow.forEach(function (e) {
                                if (e === name_1)
                                    mesh.receiveShadow = true;
                            });
                        }
                        // ? => https://threejs.org/manual/#en/materials
                        // @ts-ignore
                        var material = mesh.material;
                        if (material) {
                            material.metalness = mat.metalness;
                            material.roughness = mat.roughness;
                            material.clearcoat = mat.clearcoat;
                            material.clearcoatRoughness = mat.clearcoatRoughness;
                        }
                    }
                });
                res({ model: model, mixers: mixers, eventTarget: eventTarget });
            }, function (xhr) {
                var loaded = xhr.loaded, total = xhr.total;
                onProcess(loaded, total);
            }, function () {
                rej(new Error("[lesca-glb-loader] load ".concat(url, " error")));
            });
        });
    };
    exports.default = GlbLoader;
});
