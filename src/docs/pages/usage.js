import { useEffect } from 'react';
import Code from '../components/code';
import { name } from '../config';

const codes = [
  {
    title: '1. Installation',
    code: `npm install ${name} --save`,
    type: 'text',
  },
  {
    title: '1. usage',
    code: `import GlbLoader from '${name}';
import Avatar from './Athlete.glb';

new GlbLoader(Avatar).then((e) => {
  const { model, mixer, eventTarget } = e;


  const scale = 80;
  model.scale.set(scale, scale, scale);
  scene.add(model);

  enterframe.add(() => {
    const delta = clock.getDelta();
    mixer[0].update(delta);
  });

});
`,
    type: 'js',
  },
];

const Usage = () => {
  useEffect(() => {}, []);
  return (
    <div className='Usage'>
      <h2>Usage</h2>
      {codes.map((e) => (
        <div key={e.title}>
          <h3>{e.title}</h3>
          <Code code={e.code} theme={e.type} />
        </div>
      ))}
    </div>
  );
};
export default Usage;
