import Webgl from 'lesca-webgl-threejs';
import { useEffect, useRef } from 'react';
import glbLoader from '../../lib';
import Avatar from './Athlete.glb';

const config = {
  camera: { fov: 40, far: 200 },
  sky: {
    enabled: true,
    turbidity: 0,
    rayleigh: 0.079,
    mieCoefficient: 0.023,
    mieDirectionalG: 0.226,
    inclination: 70,
    azimuth: -102.7,
  },
  controls: {
    distance: { min: 30, max: 30 },
    polar: { min: 0, max: 0 },
    azimuth: { min: -Infinity, max: Infinity },
    offsetAzimuth: 0,
    enabled: true,
    panEasing: 100,
  },
  light: { color: 14737632, intensity: 1.5, position: { x: 0, y: 15, z: 0 }, shadowMapSize: 512 },
  renderer: { alpha: false, shadowType: 0, exposure: 0.5 },
  physics: false,
};

let webglRef;

const Demo = () => {
  const container = useRef();

  useEffect(() => {
    if (!webglRef) {
      const webgl = new Webgl(config);

      const { scene, enterframe, clock } = webgl;

      new glbLoader(Avatar).then((e) => {
        const { model, mixers } = e;
        const mesh = model;

        const scale = 120;
        mesh.scale.set(scale, scale, scale);
        mesh.position.y = -3;
        scene.add(mesh);

        enterframe.add(() => {
          const delta = clock.getDelta();
          mixers[0].update(delta);
        });
      });

      webglRef = webgl;
    }

    const { render } = webglRef;
    container.current.appendChild(render.domElement);
  }, []);

  return <div ref={container} className='Demo' />;
};
export default Demo;
