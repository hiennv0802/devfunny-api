/**
 * @api {post} /api/auth/login Login
 * @apiVersion 1.0.0
 * @apiGroup Auth
 * @apiName Login
 *
 * @apiParam {string} email Email of user
 * @apiParam {string} password Password of user
 *
 * @apiSuccess {string} token jwt token
 * @apiSuccess {string} email Email of user
 * @apiSuccess {string} username Username
 * @apiSuccess {string} social_type Type social of account
 * @apiSuccess {Integer} social_id ID social of account
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...rIZeqE",
 *     "username": "hienbx94",
 *     "email": "hienbx94@gmail.com",
 *     "social_type": "email",
 *     "social_id": null
 *   }
 *
 *
 * @apiError (Error 400) Parameter Parameter is required
 * @apiErrorExample {json} Error-Response:
 *   {
 *      "message": "password is required"
 *   }
 */
