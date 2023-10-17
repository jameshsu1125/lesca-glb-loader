"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var THREE = _interopRequireWildcard(require("three"));
var _DRACOLoader = require("three/examples/jsm/loaders/DRACOLoader");
var _GLTFLoader = require("three/examples/jsm/loaders/GLTFLoader");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var defaultOptions = {
  onProcess: function onProcess(loaded, total) {
    return "".concat(loaded / total * 100, "% loaded");
  },
  loop: true,
  castShadow: true,
  receiveShadow: false,
  material: {
    metalness: 0,
    roughness: 1,
    clearcoat: 0,
    clearcoatRoughness: 0.5
  }
};
var GlbLoader = function GlbLoader(url, options) {
  var opt = _objectSpread(_objectSpread({}, defaultOptions), options);
  var onProcess = opt.onProcess,
    loop = opt.loop,
    castShadow = opt.castShadow,
    receiveShadow = opt.receiveShadow,
    mat = opt.material;
  var loader = new _GLTFLoader.GLTFLoader();
  var dracoLoader = new _DRACOLoader.DRACOLoader();
  dracoLoader.setDecoderConfig({
    type: 'js'
  });
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  loader.setDRACOLoader(dracoLoader);
  return new Promise(function (resolve, reject) {
    loader.load(url, function (gltf) {
      var mixers = [];
      var model = gltf.scene;
      gltf.animations.forEach(function (clip) {
        var ani = new THREE.AnimationMixer(model);
        if (loop) {
          ani.clipAction(clip).play().setLoop(THREE.LoopRepeat, Infinity);
        } else {
          var actions = ani.clipAction(clip).play().setLoop(THREE.LoopOnce, 1);
          actions.clampWhenFinished = true;
        }
        mixers.push(ani);
      });
      gltf.scene.traverse(function (node) {
        var mesh = node;
        if (node instanceof THREE.Mesh) {
          var name = mesh.name;
          if (typeof castShadow === 'boolean') {
            mesh.castShadow = castShadow;
          } else {
            castShadow.forEach(function (e) {
              if (e === name) mesh.castShadow = true;
            });
          }
          if (typeof receiveShadow === 'boolean') {
            mesh.receiveShadow = receiveShadow;
          } else {
            receiveShadow.forEach(function (e) {
              if (e === name) mesh.receiveShadow = true;
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
      var output = {
        gltf: gltf,
        model: model,
        mixers: mixers
      };
      resolve(output);
    }, function (xhr) {
      var loaded = xhr.loaded,
        total = xhr.total;
      onProcess(loaded, total);
    }, function () {
      reject(new Error("[lesca-glb-loader] load ".concat(url, " error")));
    });
  });
};
var _default = exports["default"] = GlbLoader;