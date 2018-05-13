const Koa = require('koa')
const app = new Koa()
const { htmlTpl, ejsTpl, pugTpl } = require('./tpl')
const ejs = require('ejs')
const pug = require('pug')

app.use(async(ctx, next) => {
  ctx.type = 'text/html; chartset=utf-8'
  // html
  // ctx.body = htmlTpl

  // ejs
  // ctx.body = ejs.render(ejsTpl, {
  //   name: 'Tom2'
  // })

  // pug
  ctx.body = pug.render(pugTpl, {
    name: 'Tom'
  })
})
app.listen(8080, console.log.bind(null, 'running in 8080...'))
