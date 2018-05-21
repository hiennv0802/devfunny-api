/**
 * @api {post} /api/auth/login Login with email
 * @apiVersion 1.0.0
 * @apiGroup Auth
 * @apiName Login with email
 *
 * @apiParam {string} email Email of user
 * @apiParam {string} password Password of user
 *
 * @apiSuccess (Success 200) {string} token jsonwebtoken
 * @apiSuccess (Success 200) {string} username Username
 * @apiSuccess (Success 200) {string} email Email of user
 * @apiSuccess (Success 200) {string} social_type Type social of account
 * @apiSuccess (Success 200) {Integer} social_id ID social of account
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
 * @apiError (Error 400) {String} password Password is required
 * @apiError (Error 400) {String} email Email is required
 * @apiErrorExample {json} Error-Response 400:
 *   {
 *      "message": "email is required and password is required"
 *   }
 */
