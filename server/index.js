const Koa = require('koa')
const app = new Koa()
app.use(async (ctx, next) => {
  ctx.body = 'hello ben'
})
app.listen(8080, console.log.bind(null, 'running in 8080...'))
