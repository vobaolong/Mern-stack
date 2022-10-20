const userController = require("../controller/UserController");
let authCtrl = require("../controller/AuthController");
const fileCtrl = require("../controller/UpLoadImageController");

module.exports = function (app) {
  app
    .route("/users")
    .get(authCtrl.verifyTokenAdmin, userController.getAll) //Kiểm tra quyền Admin trước rồi mới getAll user
    .post(userController.create);

  app
    .route("/myprofile")
    .get(authCtrl.verifyToken, userController.myProfile)
    .put(authCtrl.verifyToken, userController.updateProfile);

  app
    .route("/myprofile/changePassword")
    .post(authCtrl.verifyToken, userController.verifyPassword, userController.changePassword);

  app.route("/deleteme").delete(authCtrl.verifyToken, userController.verifyPassword, userController.delete);

  app
    .route("/myprofile/uploadimage")
    .put(
      authCtrl.verifyToken,
      fileCtrl.upLoadFile,
      userController.updateProfile
    );
};
