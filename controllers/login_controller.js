let helper = require('../helper/util');
const User = require('../models/user');
const mongoose = require('mongoose');

const showLogin = (req,res) => {}
const showRegister = (req,res) => {}
const logout = (req,res) => {}

const login = (req,res) => {
  User.findOne({username:req.body.username}, (err,user)=>{
    if (err || user === null) res.send('Invalid User')
    else if (user !== null) {
      let user_dt = {
        username : user.username,
        id : user._id,
        role: user.role
      };
      if (helper.checkPassword(req.body.password,user.password)) {
        let token = helper.createToken(user_dt);
        // res.setHeader('token',`${token}`);
        res.send(`benar\n${token}`);
      }
      else res.send('false');
    }
  });
}

const register = (req,res) => {
  let user_data = {};
  user_data.username = req.body.username;
  user_data.name = req.body.name;
  user_data.role = 'siswa';
  user_data.password = req.body.password;
  let newuser = new User(user_data);
  newuser.save((err,user)=>{
    if (err) {
      let err_msg = '';
      for (let error in err.errors) err_msg += err.errors[error].message+'\n';
      if (err.code == 11000) err_msg+= `Username exist`;
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
  showLogin,
  showRegister,
  logout,
  login,
  register
}