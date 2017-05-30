const helper = require('../helper/util.js');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/p2w1_porto');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
      type : String,
      lowercase: true,
      validate: {
        validator: function(val){ return /[a-z]{3}/gi.test(val) },
        message: `{PATH} must be alphabet with min length 3 characters`
      },
      unique: true,
      required: [true, `{PATH} must be filled`]
    },
    name: {
      type : String,
      validate: {
        validator: function(val){ return /[a-z]{3}/gi.test(val) },
        message: `{PATH} must be alphabet with min length 3 characters`
      },
      required: [true, `{PATH} must be filled`]
    },
    password: {
      type : String,
      validate: {
        validator: function(val){ return /.{10,20}/.test(val)},
        message: `{PATH}'s length must be between 10 and 20 char`
      },
      required: [true, `{PATH} must be filled`]
      // ,set: helper.hashPassword
    },
    role: {
      type : String,
      lowercase: true,
      enum : {
        values: ['admin','siswa','guru'],
        message : `{PATH} should be [admin|siswa|guru]`
      },
      required: [true, `role must be filled`]
    },
    memoList: [{type:Schema.Types.ObjectId, ref: 'Memo'}]
  });

userSchema.pre('save', function(next) {
  this._doc.password = helper.hashPassword(this._doc.password);
  next();
});

let User = mongoose.model('user',userSchema);

module.exports = User;