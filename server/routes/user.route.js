import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';

const router = express.Router();

router.route('/')
  .get(userCtrl.list)

/**
 * @api {post} /api/users Create new user
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiName CreateUser
 *
 * @apiParam {String} name Name of user.
 * @apiParam {String} email Email of user.
 * @apiParam {String} password Password of user.
 *
 * @apiSuccess {String} id ID of user.
 * @apiSuccess {String} name Name of user.
 * @apiSuccess {String} email Email of user.
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "__v": 0,
 *    "name": "Bui Hien",
 *    "email": "hienbx94@gmail.com",
 *    "password": "$2a$10$ZQiDyDq92YBYCfe4sN/8G.sp5fUGKNECWOd/X0CPg3eMzZMFdfSi6",
 *    "_id": "593137c353afe608c64d800f",
 *    "createdAt": "2017-06-02T10:02:43.475Z"
 *  }
 *
 * @apiError InternalServerError InternalServerError
 * @apiErrorExample {json} Error-Response:
 *   {
 *     "message": "Internal Server Error",
 *      "stack": {}
 *   }
 */

  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  .get(userCtrl.get)

  .put(validate(paramValidation.updateUser), userCtrl.update)

  .delete(userCtrl.remove);

router.param('userId', userCtrl.load);

export default router;
