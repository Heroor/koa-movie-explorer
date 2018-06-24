const mongoose = require('mongoose')
const { resolve } = require('path')
const db = 'mongodb://localhost/douban-test'
const glob = require('glob')
mongoose.Promise = global.Promise

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}

exports.connect = () => {
  let maxConnectTimes = 0
  return new Promise((resolve, rejct) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
    mongoose.connect(db)
    // 断开连接时
    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('MongoDB is dead!')
      }
    })
    mongoose.connection.on('error', err => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('MongoDB is dead!')
      }
    })
    mongoose.connection.once('open', () => {
      // 写入数据
      const Dog = mongoose.model('Dog', {
        name: String
      })
      const dogTom = new Dog({
        name: 'tom'
      })
      dogTom.save().then(() => {
        console.log('save successfully')
      })
      resolve()
      console.log('MongoDB Connected successfully!')
    })
  })
}
