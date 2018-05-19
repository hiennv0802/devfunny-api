/**
 * @api {post} /api/upload/image Upload image
 * @apiVersion 1.0.0
 * @apiGroup Upload
 * @apiName UploadImage
 *
 * @apiHeader {String} Authorization Json token of user.
 * @apiHeaderExample {json} Header-Example:
 *   {
 *     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 *
 * @apiParam {File} file File with form-data.
 *
 * @apiSuccess {Boolean} success Image is upload?
 * @apiSuccess {String} image_id Image id
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     "success": true,
 *     "image_id": "593121183162973c6b208592"
 *   }
 *
 * @apiError FileSize File size is too large. Max limit is 10MB.
 * @apiError FileType Filetype is invalid. Must be .png.
 * @apiErrorExample {json} Error-Response:
 *   {
 *     "success": false,
 *     "message": "Filetype is invalid. Must be .png"
 *   }
 */
