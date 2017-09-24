import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/lib/param-validation';
import registerCtrl from '../controllers/register.controller';
import config from '../../config/config';

const router = express.Router();

router.route('/')

/**
 * @api {post} /api/register Signup with email
 * @apiVersion 1.0.0
 * @apiGroup Signup
 * @apiName Signup with email
 *
 * @apiParam {String} social_type Type of signup(email, facebook, twitter)
 * @apiParam {String} email Email of user.
 * @apiParam {String} password Password of user.
 *
 * @apiSuccess {String} _id ID of user.
 * @apiSuccess {String} name Name of user.
 * @apiSuccess {String} email Email of user.
 * @apiSuccess {String} username Username of user.
 * @apiSuccess {String} social_id Social ID of user.
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "__v": 0,
 *    "email": "hienbx94@gmail.com",
 *    "username": "hienbx94",
 *    "social_id": null,
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

  .post(validate(paramValidation.signup), registerCtrl.signup);

export default router;
