module.exports = `
doctype html
html
  head(lang='en')
    meta(chartset='utf-8')
    meta(name='viewport' content='width=device-width, initial-scale=1')
    title koa page
    link(href='https://cdn.bootcss.com/bootstrap/4.1.0/css/bootstrap.min.css' rel='stylesheet')
    script(src='https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js')
    script(src='https://cdn.bootcss.com/bootstrap/4.1.0/js/bootstrap.bundle.min.js')
  body
    .container
      .row
        .col-md-8
          h1 Hi #{name}
          p This is a pug page
        .col-md-4
          p Welcome to this page!
`
