const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const ObjectId = Schema.Types.ObjectId
const movieSchema = new Schema({
  doubanId: {
   unique: true,
   type: String
  },
  category: [{
    type: ObjectId,
    ref: 'Category'
  }],
  rate: Number,
  title: String,
  summary: String,
  video: String,
  poster: String,
  cover: String,

  videoKey: String,
  posterKey: String,
  coverKey: String,

  rawTitle: String,
  movieTypes: [String],
  pubdate: Mixed,
  year: Number,
  tags: [String],
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
  movieSchema.pre('save', function (next) {
    // 实体数据是否是新创建的数据
    if (this.isNew) {
      this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
      this.meta.createdAt = Date.now()
    }
      next()
  })
  mongoose.model('Movie', movieSchema)
} catch (err) {
  console.log('err', err)
}
