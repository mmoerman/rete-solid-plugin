import { ReteOptions } from 'rete-cli';

export default <ReteOptions>{
  input: 'src/index.tsx',
  name: 'SolidJSPlugin',
  globals: {
      'rete': 'Rete',
      'rete-area-plugin': 'ReteAreaPlugin',
      'rete-render-utils': 'ReteRenderUtils',
  },
  babel: {
    presets: ['@babel/preset-env', '@babel/preset-typescript', 'solid'],
  },
}
