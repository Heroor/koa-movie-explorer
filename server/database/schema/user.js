const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000

const userSchema = new Schema({
  username: {
    unique: true, // 设置字段名是唯一的
    required: true,
    type: String
  },
  email: {
    unique: true, // 设置字段名是唯一的
    required: true,
    type: String
  },
  password: {
    unique: true, // 设置字段名是唯一的
    type: String
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  },
})

try {

  // 虚拟字段
  userSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now())
  })

  // 保存前
  userSchema.pre('save', function (next) {
    // 实体数据是否是新创建的数据
    if (this.isNew) {
      this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
      this.meta.createdAt = Date.now()
    }
      next()
  })

  userSchema.pre('save', function (next) {
    // 字段是否更改
    if (!user.isModified('password')) return next()
    // 加盐处理
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) return next(err)
      // 字段加密
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err)
        this.password = hash // 加密后的密码
        next()
      })
    })
    next()
  })

  // 实例方法
  userSchema.methods = {
    comparePassword: (_password, password) => {
      return new Promise((resolve, reject) => {
        // 比较
        bcrypt.compare(_password, password, (err, isMatch) => {
          err ? reject(err) : resolve(isMatch)
        })
      })
    },
    incLoginAttepts: function (user) {
      return new Promise((resolve, reject) => {
        if (this.lockUntil && this.lockUntil < Date.now()) {
          this.update({
            $set: {
              loginAttempts: 1
            },
            $unset: {
              lockUntil: 1
            }
          }, err => {
            err ? reject(err) : resolve(true)
          })
        } else {
          let updates = {
            $inc: {
              loginAttempts: 1
            }
          }
          if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
            updates.$set = {
              lockUntil: Date.now() + LOCK_TIME
            }
          }
          this.update(updates, err => {
            err ? reject(err) : resolve(true)
          })
        }
      })
    }
  }

  mongoose.model('User', userSchema)
} catch (err) {
  console.log('err', err)
}
