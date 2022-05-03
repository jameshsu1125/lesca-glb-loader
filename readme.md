[![NPM](https://img.shields.io/badge/NPM-ba443f?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![React](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![React](https://img.shields.io/badge/-ReactJs-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://zh-hant.reactjs.org/)
[![React](https://img.shields.io/badge/Less-1d365d?style=for-the-badge&logo=less&logoColor=white)](https://lesscss.org/)
[![React](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://www.w3schools.com/html/)
[![React](https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3schools.com/css/)
[![NPM](https://img.shields.io/badge/DEV-Jameshsu1125-9cf?style=for-the-badge)](https://www.npmjs.com/~jameshsu1125)

# Why use it?

load glb file simplified.

#### [Live Demo](https://jameshsu1125.github.io/lesca-glb-loader/)

# Installation

```sh
npm install lesca-glb-loader --save
```

## Usage

```javascript
import GlbLoader from 'lesca-glb-loader';
import Avatar from './Athlete.glb';

new GlbLoader(Avatar).then((e) => {
  const { model, mixer, eventTarget } = e;

  const scale = 80;
  model.scale.set(scale, scale, scale);
  scene.add(model);

  // animation clip update
  enterframe.add(() => {
    // =>  same requestAnimationFrame
    const delta = clock.getDelta();
    mixer[0].update(delta);
  });
});
```

## Development

### Parameters

```js
new GlbLoader(url, options).then((e) => {
  // get module here
});
```

| Parameters           |    description     |             default |
| :------------------- | :----------------: | ------------------: |
| **url**:_string_     |    glb file url    |                     |
| **options**:_object_ | options for loader | [options](#options) |

#### Options

| key                         |      description      |               default |
| :-------------------------- | :-------------------: | --------------------: |
| **onProcess**:_function_    |  on process handler   |                       |
| **loop**:_boolean_          | animation clip loop?  |                  true |
| **castShadow**:_boolean_    |  model cast shadow?   |                  true |
| **receiveShadow**:_boolean_ | model receive shadow? |                 false |
| **material**:_object_       |      [Materials]      | [Material](#material) |

##### material

| key                             | description | default |
| :------------------------------ | :---------: | ------: |
| **metalness**:_number_          | [Materials] |       0 |
| **roughness**:_number_          | [Materials] |       1 |
| **clearcoat**:_number_          | [Materials] |       0 |
| **clearcoatRoughness**:_number_ | [Materials] |     0.5 |

### Features

- Code Linting ([eslint])
- maintain if necessary

[eslint]: https://eslint.org/
[materials]: https://threejs.org/manual/#en/materials
