const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
try {
  !(async () => {
    // 脚本
    const script = resolve(__dirname, '../crawler/trailer-list.js')
    // fork创建子进程
    const child = cp.fork(script, [])
    let invoked = false

    child.on('error', err => {
      if(invoked) return
      invoked = true
      console.log(err)
    })

    // 退出时
    child.on('exit', code => {
      if (invoked) return
        invoked = true
        let err = code === 0 ? null : new Error(code)
        console.log(err)
    })
    // 获取消息
    child.on('message', data => {
      let result = data.result
      result.forEach(async item => {
        let movie = await Movie.findOne({
          doubanId: item.doubanId
        })
        if (!movie) {
          movie = new Movie(item)
          await movie.save()
        }
      })
    })
  })()
} catch (err) {
  console.log('err', err)
}
