const { resolve } = require('path')
const Koa = require('koa')
const mongoose = require('mongoose')
const views = require('koa-views')
const static = require('koa-static')
const { connect, initSchemas } = require('./database/init')
try {
  ;(async () => {
    // 连接数据库
    await connect()
    // 初始化数据库schema
    initSchemas()
    // const Movie = mongoose.model('Movie')
    // const movies = await Movie.find({})
    // console.log(movies)
    // require('./tasks/movie.js')
    require('./tasks/api')
  })()

  const app = new Koa()
  app.use(static(resolve(__dirname, './public')))

  app.use(views(resolve(__dirname, './views'), {
    extension: 'pug'
  }))

  app.use(async(ctx, next) => {
    await ctx.render('index', {
      name: 'Tom'
    })
  })

  app.listen(8080, console.log.bind(null, 'running in 8080...'))
} catch (err) {
  console.log('err', err)
}
