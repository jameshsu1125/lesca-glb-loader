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

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

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
  return new Promise(function (res, rej) {
    loader.load(url, function (eventTarget) {
      var mixers = [];
      var model = eventTarget.scene;
      eventTarget.animations.forEach(function (clip) {
        var ani = new THREE.AnimationMixer(model);

        if (loop) {
          ani.clipAction(clip).play().setLoop(THREE.LoopRepeat, Infinity);
        } else {
          var actions = ani.clipAction(clip).play().setLoop(THREE.LoopOnce, 1);
          actions.clampWhenFinished = true;
        }

        mixers.push(ani);
      });
      eventTarget.scene.traverse(function (node) {
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
          } // ? => https://threejs.org/manual/#en/materials
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
      res({
        model: model,
        mixers: mixers,
        eventTarget: eventTarget
      });
    }, function (xhr) {
      var loaded = xhr.loaded,
          total = xhr.total;
      onProcess(loaded, total);
    }, function () {
      rej(new Error("[lesca-glb-loader] load ".concat(url, " error")));
    });
  });
};

var _default = GlbLoader;
exports["default"] = _default;