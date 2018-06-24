// const process = require('process')
const puppeteer = require('puppeteer')
const base = 'https://movie.douban.com/subject/'
const doubanId = '1292052'
const videoBase = 'https://movie.douban.com/trailer/108756/'

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async() => {
  console.log('start visit the target page')
  try {
    // 启动无头浏览器
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'], // 非沙箱模式
      dumpio: false
    })
    const page = await browser.newPage() // 打开新页面
    // 打开网页
    await page.goto(base + doubanId, {
      waitUntil: 'networkidle2'
    })
    await sleep(1000)

    // 获取页面数据
    const result = await page.evaluate(() => {
      var it = $('.related-pic-video')
      if (it && it.length) {
        var link = it[0].getAttribute('href')
        var cover = it[0].style.backgroundImage
        return {
          link,
          cover
        }
      }
      return {}
    })

    let video
    if (result.link) {
      await page.goto(result.link, {
        waitUntil: 'networkidle2'
      })
      await sleep(2000)
      video = await page.evaluate(() => {
        var $ = window.$
        var it = $('source')
        if (it && it.length) {
          return it.attr('src')
        }
        return ''
      })
    }
    const data = {
      video,
      doubanId,
      cover: result.cover
    }
    // 关闭浏览器
    browser.close()
    // 子进程传输数据
    process.send(data)
    // 退出子进程
    process.exit(0)
  } catch (e) {
    console.log('error==>', e)
  }
})()
