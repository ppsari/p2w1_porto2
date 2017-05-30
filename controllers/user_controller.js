const helper = require('../helper/util.js');
const User = require('../models/user');
const mongoose = require('mongoose');


const showCreate = (req,res) => {}

const findAllUsers = (req,res) => {
  User.find({},(err,users) => {
    res.send(err? err : users);
  })

}

const getUser = (req,res) => {
  // let token = req.headers.token;
  // helper.getUserId(token, (err,decoded)=>{
    // if (err) res.send('Wrong token');
    // else
  User.findById(req.params.id, (err,user)=> {
    res.send(err? err : user);
  })
  // });
}

const deleteUser = (req,res) => {
  let user_id = req.params.id;
  User.findByIdAndRemove(user_id, (err,user)=> {
    res.send(err? err : `[SUCCESS][DELETE] ${user._id} Deleted`);
  })
}
const updateUserMemo = (method,user_id,memo_id,res) => {
  User.findById(user_id, (err_find,user)=>{
    console.log('----------------------------3')
    if (err_find) res.send('Invalid user');
    else {

      let scs_msg = '';
      switch(method) {
        case 'DELETE':
          let idx = user.memoList.findIndex((memo)=> memo == memo_id );
          if (idx > -1) user.memoList.splice(idx,1);
          scs_msg = '[SUCCESS][DELETE] ${memo_id} deleted';
        break;
        case 'POST':
          user.memoList.push(`${memo_id}`);
          scs_msg = `[SUCCESS][INSERT] ${memo_id} inserted`;
        break;
      }

      user.save((err,u_user) => {
        if (err) {
          let err_msg = '';
          for (let error in err.errors) err_msg += err.errors[error].message+'\n';
          res.send(err_msg);
        } else if (res)
          res.send(scs_msg)

      });

    }
  })
}

const updateUser = (req,res) => {
  let user_id = req.params.id;
  User.findById(user_id, (err_find,user)=>{
    if (err_find) res.send('Invalid user');
    else {
      user.password = req.body.password;
      user.name = req.body.name;
      user.save((err,result) => {
        if (err) {
          let err_msg = '';
          for (let error in err.errors) err_msg += err.errors[error].message+'\n';
          if (err.code == 11000) err_msg+= `Username exist`;
          res.send(err_msg);
        } else {
          res.send(`[SUCCESS][UPDATE] ${result._id} Updated`)
        }

      })
    }
  })

}

const createUser = (req,res) => {
  let user_data = {};
  user_data.username = req.body.username;
  user_data.name = req.body.name;
  user_data.role = req.body.role || 'siswa';
  user_data.password = req.body.password;
  let newuser = new User(user_data);
  newuser.save((err,user)=>{
    if (err) {
      let err_msg = '';
      for (let error in err.errors) err_msg += err.errors[error].message+'\n';
      if (err.code == 11000) err_msg+= `Username already exist`;
      res.send(err_msg);
    } else {

      user.save((err_hash,user)=>{
        if (err_hash) res.send('Hash password failed');
        else res.send(`[SUCCESS][INSERT] ${user._id} inserted`);
      })

    };
  })

}

module.exports = {
  showCreate,
  findAllUsers,
  getUser,
  deleteUser,
  updateUser,
  createUser,
  updateUserMemo
}