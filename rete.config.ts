import { ReteOptions } from 'rete-cli';
import commonjs from '@rollup/plugin-commonjs'

export default <ReteOptions>{
  input: 'src/index.tsx',
  name: 'SolidPlugin',
  globals: {
      'rete': 'Rete',
      'rete-area-plugin': 'ReteAreaPlugin',
      'rete-render-utils': 'ReteRenderUtils',
  },
  plugins: [
    commonjs()
  ],
  babel: {
    presets: ['@babel/preset-env', '@babel/preset-typescript', 'solid'],
  },
}
