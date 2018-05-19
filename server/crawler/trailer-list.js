// const process = require('process')
const url = 'https://movie.douban.com/tag/#/?sort=R&range=6,10&tags='
const puppeteer = require('puppeteer')

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;
(async() => {
  console.log('start visit the target page')
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'], // 非沙箱模式
      dumpio: false
    })
    const page = await browser.newPage() // 开启新页面
    // 打开网站
    await page.goto(url, {
      waitUntil: 'networkidle2'
    })
    await sleep(3000)

    // 等待'加载更多'按钮出现
    await page.waitForSelector('.more')

    for (let i = 0; i < 2; i++) {
      await sleep(3000)
      // 点击加载更多按钮
      await page.click('.more')
    }
    const result = await page.evaluate(() => {
      var $ = window.$
      var items = $('.list-wp a')
      var links = []
      if (items.length >= 1) {
        items.each((index, item) => {
          var it = $(item)
          var doubanId = it.find('div').data('id')
          var title = it.find('.title').text()
          var rate = Number(it.find('.rate').text())
          var poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')
          links.push({
            doubanId,
            title,
            rate,
            poster
          })
        })
      }
      return links
    })
    // 关闭浏览器
    browser.close()
    process.send({ result })
    process.exit(0)
  } catch (e) {
    console.log('error==>', e)
  }
})()
