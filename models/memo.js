const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/p2w1_porto');
const Schema = mongoose.Schema;
const memoSchema = new Schema({
    title : {
      type : String,
      required : [true, '{PATH} must be filled'],
      minlength : [3, `{PATH}'s must be longer than 2 character`]
    },
    descr : {
      type : String,
      required : [true, '{PATH} must be filled'],
      validate : {
        validator: function(descr) {
          return /.{10,200}/.test(descr);
        },
        message : `{PATH}'s length must be between 10 and 200`
      }
    },
    created_date : Date,
    _user_id : {
      type:Schema.Types.ObjectId,
      ref:'User'
    }
});

let Memo = mongoose.model('Memo',memoSchema);

module.exports = Memo;

