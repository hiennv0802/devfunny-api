/**
 * @api {post} /api/register Signup with email
 * @apiVersion 1.0.0
 * @apiGroup Signup
 * @apiName Signup with email
 *
 * @apiParam {String} email Email of user.
 * @apiParam {String} password Password of user.
 * @apiParam {String} social_type Type of signup(email, facebook, twitter). In this case is email
 *
 * @apiSuccess (Success 200) {String} _id ID of user.
 * @apiSuccess (Success 200) {String} name Name of user.
 * @apiSuccess (Success 200) {String} email Email of user.
 * @apiSuccess (Success 200) {String} username Username of user.
 * @apiSuccess (Success 200) {String} social_id Social ID of user.
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
 * @apiError (Error 400) {String} password Password is required
 * @apiErrorExample {json} Error-Response 400:
 *   {
 *     "message": "password is required"
 *   }
 */
