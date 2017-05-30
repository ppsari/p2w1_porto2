const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'k3yR4hasiaKat@ny4a';
const SALT = '';
const page_user = [
  {
    name:'/',
    hasParam: {
      GET : ['admin','id'],
      PUT : ['admin','id'],
      DELETE : ['admin'],
      POST:['admin']
    },
    noParam: {
      GET: ['admin']
    }
  },{
    name:'/create',
    noParam: {
      GET : ['admin']
    }
  }
]
const page_memo = [
  {
    name: '/',
    hasParam: {
      GET : ['admin','login'],
      POST : ['login'],
      PUT : ['login'],
      DELETE : ['admin','login']
    },
    noParam: {
      POST: ['login'],
      GET: ['admin'],
    }
  },{
    name:'/user',
    noParam: { GET: ['login'] },
    hasParam: { GET: ['login']}
  }
]

const authMemo = (req,res,next) => {
  let original_url = (typeof req._parsedOriginalUrl !== 'undefined')? req._parsedOriginalUrl.path.split('/').filter((url)=> url != '' && /\d/gi.test(url) === false ) : [];
  let path = (original_url.length > 1) ? original_url[1] : req.path ;
  // console.log('path: '+req.path)
  let method = req.method;
  let idx = page_memo.findIndex((x)=> x.name === path);
  let user_auth;
  // console.log('lagi di : '+path+' dengan method '+method)
  if (idx !== -1) {
    // console.log(req.params.id)
    let token = req.headers.token;
    if (token) {
      let decoded = jwt.verify(token,SECRET_KEY);
      user_auth = (typeof req.params.id !== 'undefined'? page_memo[idx].hasParam[method] : page_memo[idx].noParam[method]);
      // console.log('user_auth'+user_auth);
      let is_user_auth = -1;
      // console.log(decoded.id +'__'+ req.params.id)
      is_user_auth = user_auth.findIndex((x)=>
        ( x === 'login'|| (x === 'id' && decoded.id == req.params.id ) || (decoded.role === x) )
      );
      console.log('is_user_auth : '+is_user_auth)
      if (is_user_auth === -1) res.send(`User ${decoded.username} - role ${decoded.role} tak dapat mengakses ${path} ${method}`);
      else next();
    } else res.send('You must login');
  } else next();
}

const authUser = (req,res,next) => {

  let path = req.path;
  let method = req.method;
  let idx = page_user.findIndex((x)=> x.name === path);
  let user_auth;

  if (idx !== -1) {
    let token = req.headers.token;
    if (token) {
      let decoded = jwt.verify(token,SECRET_KEY);
      user_auth = (typeof req.params.id !== 'undefined'? page_user[idx].hasParam[method] : page_user[idx].noParam[method]);
      let is_user_auth = -1;
      if (user_auth)
        is_user_auth = user_auth.findIndex((x)=>
          ( x === 'login' || (decoded.role === x) || (x === 'id' && decoded.id == req.params.id ) )
        );

      if (is_user_auth === -1) res.send(`User ${decoded.username} - role ${decoded.role} tak dapat mengakses ${path} ${method}`);
      else next();
    } else res.send('You must login');
  }
  else next();
}


const getUserId = (token,callback) => {
  jwt.verify(token, SECRET_KEY, callback);

}

const getUserDetail = (token) => {
  jwt.verify(token, SECRET_KEY, (err,decoded)=>{
    return err? false : decoded;
  });
}

const createToken = (user_data) => {
  let token = jwt.sign(user_data, SECRET_KEY)
  return token;
}
const authNoParam = () => {}
const authParam = () => {}
const hashPassword = (password) => {
  let hashPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
  return hashPassword;
}

const checkPassword = (password,hashPassword) => {
  let plainpass  = CryptoJS.AES.decrypt(hashPassword, SECRET_KEY).toString(CryptoJS.enc.Utf8);
  return plainpass === password;
}

module.exports = {
  getUserId,
  getUserDetail,
  authMemo,
  authUser,
  hashPassword,
  checkPassword,
  createToken
}