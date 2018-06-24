const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const categorySchema = new Schema({
  name: {
    unique: true,
    type: String
  },
  movies: [{
    type: ObjectId,
    ref: 'Movie'
  }],
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
  // 保存前
  categorySchema.pre('save', function (next) {
    // 实体数据是否是新创建的数据
    if (this.isNew) {
      this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
      this.meta.createdAt = Date.now()
    }
      next()
  })

  mongoose.model('Category', categorySchema)
} catch (err) {
  console.log('err', err)
}
