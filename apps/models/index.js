import path from 'path'
import mongoose from 'mongoose'
import globby from 'globby'
import { plugins } from '../../db'

const here = path.resolve(__dirname)

mongoose.plugin(plugins.DataLoader)

globby.sync([
  // Available model schema.
  `${here}/*.js`,
  `!${here}/index.js`,
  `!${here}/*.spec.js`,
  `!${here}/*.test.js`
]).forEach(abspath => {
  const module = require(abspath)
  const Model = (module.default || module)(mongoose)
  exports[Model.modelName] = Model
})
