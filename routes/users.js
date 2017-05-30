const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');
const helper = require('../helper/util');

/* USER
  get     /       -> get semua user as admin
  get     /:id    -> get user detail aka show page_edit
  get     /create -> show page_create
  post            -> create user
  delete  /:id    -> delete user by user_id
  put     /:id    -> update user
*/

router.use('/', helper.authUser);
router.use('/:id', helper.authUser);


router.get('/', user_controller.findAllUsers); 
router.get('/:id',user_controller.getUser);
router.delete('/:id', user_controller.deleteUser);
router.put('/:id',user_controller.updateUser);
router.post('/',user_controller.createUser);
//tampilan doang, skip
router.get('/create',user_controller.showCreate);

module.exports = router;
