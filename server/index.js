const { resolve } = require('path')
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const static = require('koa-static')

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
