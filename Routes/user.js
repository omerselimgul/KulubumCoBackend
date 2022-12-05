const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate/validate");
const auth = require("../middleware/authorization/auth");
const userController = require("../controller/userController");
const schema = require("../schemas/userSchema");

router
  .route("/profile/currentuser")
  .get(
    auth.getAccessToRoute,
    validate(schema.getCurrentUserSchema),
    userController.getCurrentUser
  );
router
  .route("/:id")
  .get(validate(schema.getByIdSchema), userController.getById);
router.put(
  "/",
  auth.getOnlyUserIdFromTokenToBody,
  validate(schema.editUserSchema),
  userController.EditUser,
  userController.EditUserCookieInfo
);

module.exports = router;