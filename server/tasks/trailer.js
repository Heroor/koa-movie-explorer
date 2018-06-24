const cp = require('child_process')
const { resolve } = require('path')

void (async () => {
  // 脚本
  const script = resolve(__dirname, '../crawler/video.js')
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
      // console.log(code)
  })
  // 获取消息
  child.on('message', data => {
    console.log(data)
  })
})()
