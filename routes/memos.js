const express = require('express');
const router = express.Router();
const memo_controller = require('../controllers/memo_controller');
const helper = require('../helper/util');
/* MEMO
  get       /     -> get semua as admin
  get       /user -> memos 1 user
  get       /create -> show createMemo
  get       /:id  -> get memo by memo_id
  delete    /:id  -> delete memo by memo_id
  put       /:id  -> update memo by memo_id
  post            -> create memo
*/

//kalau ada
// router.use('/user', helper.authMemo);
//kalo ga ada param
router.use('/:id', helper.authMemo);
router.use('/', helper.authMemo);
router.use('/user', helper.authMemo);

router.put('/:id',memo_controller.updateMemo); //v
router.get('/user/', memo_controller.findUserMemos); //v
router.get('/:id',memo_controller.findUserMemo); //v
router.get('/', memo_controller.findAllMemos); //v
router.delete('/:id', memo_controller.deleteMemo); //v
router.post('/',memo_controller.createMemo); //v


module.exports = router;