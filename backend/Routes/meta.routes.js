var express = require('express');
var AdminRouter = express.Router();
var auth = require('../utils/auth');

var AdminController = require('../Controller/meta.controller');

AdminRouter.get("/all",auth.verifyToken, auth.isMetaAdmin,AdminController.getAllAdmins);

AdminRouter.get("/all-reports",auth.verifyToken,AdminController.findAllReports);

AdminRouter.get("/:adminId",auth.verifyToken, AdminController.getOneByID);

AdminRouter.post("/signIn", AdminController.signIn);

AdminRouter.post("/create", auth.verifyToken ,auth.isMetaAdmin, AdminController.createAdmin);

AdminRouter.post("/accept-report/:reportId",auth.verifyToken, AdminController.acceptReportRequest);

AdminRouter.post("/reject-report/:reportId", auth.verifyToken,AdminController.rejectReportRequest);

AdminRouter.put("/update/:adminId", auth.verifyToken,auth.isMetaAdmin,AdminController.updateAdmin);

AdminRouter.put("/update-password",auth.verifyToken, AdminController.updatePassword);

AdminRouter.delete("/delete/:adminId",auth.verifyToken,auth.isMetaAdmin,AdminController.deleteAdmin);

module.exports = AdminRouter; 
