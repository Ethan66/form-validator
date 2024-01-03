import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from "rollup-plugin-terser"
import serve from 'rollup-plugin-serve'
const path = require('path')
const getPath = _path => path.resolve(__dirname, _path)

const env = process.env.NODE_ENV
let commonPlugins = [
  resolve(),
  commonjs(),
  typescript({ tsconfig: getPath('./tsconfig.json'), useTsconfigDeclarationDir: env?.trim() === 'production', extensions: ['.js', '.ts', '.tsx'] })
];

let format = 'es'
let prefixFile = 'es'

if (env && env.trim() === 'production') {
  commonPlugins.push(terser())
  format = 'umd'
  prefixFile = 'lib'
}
if (process.env.TARGET === 'dev') {
  commonPlugins.push(serve({
    port: 3000,
    contentBase: "",
    openPage: "/public/index.html",
    open: true
  }))
}
const config = [
  {
    input: './src/validator.ts',
    output: [{
      format,
      name: 'validator',
      file: `${prefixFile}/validator.js`
    }],
    plugins: commonPlugins
  }, 
  {
    input: './src/methods.ts',
    output: [{
      format,
      name: 'methods',
      file: `${prefixFile}/methods.js`
    }],
    plugins: commonPlugins
  },
  {
    input: './src/rules.ts',
    output: [{
      format,
      name: 'rules',
      file: `${prefixFile}/rules.js`
    }],
    plugins: commonPlugins
  }
]

export default config
