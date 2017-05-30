const Memo = require('../models/memo');
const mongoose = require('mongoose');
const helper = require('../helper/util.js');
const user_controller = require('../controllers/user_controller')

const createMemo = (req,res) => {
  console.log('masuk')
  let memo_data = {};
  memo_data.title = req.body.title;
  memo_data.descr = req.body.descr;
  helper.getUserId(req.headers.token, (err,decoded) => {
    if (!err) {
      memo_data._user_id = decoded.id;

      memo_data.created_date = new Date();
      let memo = new Memo(memo_data);
      memo.save((err,memo)=> {
        if (err) {
          let err_msg = '';
          for (let error in err.errors) err_msg += err.errors[error].message+'\n';
          if (err.code == 11000) err_msg+= `Username already exist`;
          res.send(err_msg);
        } else {
          user_controller.updateUserMemo('POST',`${memo_data._user_id}`, `${memo._id}`, res);
        }
      })
    }

  });

}

const findUserMemos = (req,res) => {
  helper.getUserId(req.headers.token, (err,decoded) => {
    if (!err) {
      Memo.find({_user_id: decoded.id}, (err,memos)=>{
        console.log('findUserMemos')
        if (err) res.send(err);
        else res.send(memos);
      })
    }
  });
}

const findAllMemos = (req,res) => {
  Memo.find((err,memos)=>{
    if (err) res.send(err);
    else res.send(memos);
  })
}

const findUserMemo = (req,res) => {
  let memo_id = `${req.params.id}`;
  console.log('findusermemo')
  helper.getUserId(req.headers.token, (err,decoded) => {
    if (!err) {
      console.log('user_id: '+decoded.id)
      Memo.findOne({_id:memo_id,_user_id:decoded.id},
        (err,memo)=>{
          if (err) res.send('Invalid Memo')
          else if (memo === null) res.send('User has no access to that memo');
          else res.send(memo);
        })
    } else res.send('Invalid User')
  });

}

const updateMemo = (req,res) => {
  console.log('update memo')
  let memo_id = req.params.id;
  let title = req.body.title;
  let descr = req.body.descr;
  // let memo_dt = {title:title,descr:descr};


  helper.getUserId(req.headers.token, (err,decoded) => {
    if (!err) {
      // console.log(memo_id)
      Memo.findById(memo_id, (err,memo) => {
        // console.log(memo)
        if (err) res.send('Invalid Memo');
        else if (memo !== null) {
          if (memo._user_id != decoded.id) res.send('Invalid User Id');
          else {
            memo.title = title;
            memo.descr = descr;
            memo.save((err,memo)=> {
              if (err) {
                let err_msg = '';
                for (let error in err.errors) err_msg += err.errors[error].message+'\n';
                res.send(err_msg);
              } else res.send(`[SUCCESS][UPDATE] ${memo._id} updated`);
            });
          }
        } else res.send('Invalid Memo');

      })
      // Memo.findByIdAndUpdate(memo_id, memo_dt,
      //   { runValidators: true },
      //   (err,memo) => {
      //     if (err) {
      //       let err_msg = '';
      //       for (let error in err.errors) err_msg += err.errors[error].message+'\n';
      //       if (err.code == 11000) err_msg+= `Username exist`;
      //       res.send(err_msg);
      //     } else res.send(`[SUCCESS][UPDATE] ${memo._id} updated`);
      //
      //   }
      // );
    }
  })


  /*


  */
}

const deleteMemo = (req,res) => {
  let memo_id = req.params.id;
  helper.getUserId(req.headers.token, (err,decoded) => {
    if (!err) {
      Memo.findById(memo_id, (err,memo)=> {
        console.log(memo._user_id+'_'+decoded.id)
        if (err) { res.send(err); }
        else if (memo._user_id != decoded.id) res.send('Invalid user id');
        else {
          memo.remove();
          user_controller.updateUserMemo('DELETE',memo._user_id, memo_id,res);
        }
      })
    }
  });

}


module.exports = {
  createMemo,
  findUserMemos,
  findUserMemo,
  findAllMemos,
  updateMemo,
  deleteMemo
}