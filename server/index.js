const Koa = require('koa')
const app = new Koa()
const tpl = require('./tpl/normal')

app.use(async (ctx, next) => {
  ctx.type = 'text/html; chartset=utf-8'
  ctx.body = tpl
})
app.listen(8080, console.log.bind(null, 'running in 8080...'))
