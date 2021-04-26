var MetaService = require("../Services/meta.service");
var UserService = require("../Services/user.services");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

exports.createAdmin = async (req, res) => {
  try {
    let admin = await MetaService.getOne({ user_name: req.body.user_name });
    if (admin)
      return res.status(200).json({ message: "Admin already registered" });
    admin = await MetaService.createAdmin({
      user_name: req.body.user_name,
      password: req.body.password,
      text_password: req.body.password,
      type: req.body.type,
      status: "Active",
    });
    return res.status(200).json({
      _id: admin._id,
      name: admin.user_name,
      message: "Admin Created Success",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(200).json({
      message: "Internal Server Error",
      admin: {},
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    let admin = await MetaService.getOne({ user_name: req.body.user_name });
    if (!admin) {
      return res.status(200).json({ message: "Invalid user_name" });
    } else if (
      admin &&
      (admin.status == "Deleted" || admin.status == "Blocked")
    ) {
      return res
        .status(200)
        .json({ message: "Admin account has been deleted or blcocked" });
    }
    const hash = admin.password;
    bcrypt.compare(req.body.password, hash, function (err, result) {
      if (result) {
        const token = jwt.sign(
          {
            name: admin.user_name,
            adminId: admin._id,
            userType: admin.type,
          },
          config.get("myprivatekey")
        );
        return res
          .header("authorization", token)
          .status(200)
          .json({
            message: "Login Successfuly...!!!",
            token: token,
            Admindata: {
              name: admin.user_name,
              adminId: admin._id,
            },
          });
      } else {
        return res.status(200).json({
          message: "Wrong password",
        });
      }
    });
  } catch (error) {
    console.log("error", error);
    return res.status(200).json({
      message: "Internal Server Error",
      Admindata: {},
    });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const updatedAdmin = await MetaService.updateAdmin(
      { _id: adminId },
      req.body
    );
    return res.status(200).json({
      admin: updatedAdmin,
      message: "Admin Updated Success",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(200).json({
      message: "Internal Server Error",
      admin: {},
    });
  }
};

exports.getOneByID = async (req, res) => {
  try {
    const admin = await MetaService.getOneByID(req.params.adminId);
    return res.status(200).json({
      admin: admin,
      message: "Admin found success",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(200).json({
      message: "Internal Server Error",
      admin: {},
    });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await MetaService.getAllAdmins();
    if (admins && admins.length > 0) {
      return res.status(200).json({
        adminsList: admins,
        message: "Admins found success",
      });
    } else {
      return res.status(200).json({
        adminsList: [],
        message: "Admins not found",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(200).json({
      adminsList: [],
      message: "Internal Server Error",
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    let { oldPassword, newPassword } = req.body;

    let admin = await MetaService.getOneByID(req["adminId"]);

    if (!admin) {
      return res.status(200).json({ message: "Invalid admin Id" });
    }

    const hash = admin.password;

    bcrypt.compare(oldPassword, hash, async function (err, result) {
      if (result) {
        const password = await bcrypt.hash(newPassword, 10);
        const updatedAdmin = await MetaService.updateAdmin(
          { _id: req["adminId"] },
          { password, text_password: newPassword }
        );
        return res.status(200).json({
          admin: updatedAdmin,
          message: "Admin Password Updated Success",
        });
      } else {
        return res.status(200).json({
          admin: {},
          message: "Wrong Old Password",
        });
      }
    });
  } catch (error) {
    console.log("error", error);
    return res.status(200).json({
      admin: {},
      message: "Internal Server Error",
    });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    let admin = await MetaService.getOneByID(req.params.adminId);

    if (!admin) {
      return res.status(200).json({ message: "Invalid admin id" });
    }
    const updatedAdmin = await MetaService.updateAdmin(
      { _id: req.params.adminId },
      { status: "Deleted" }
    );
    return res.status(200).json({
      admin: updatedAdmin,
      message: "Admin Deleted Success",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(200).json({
      message: "Internal Server Error",
      admin: {},
    });
  }
};

exports.acceptReportRequest = async (req, res) => {
  try {
    const report = await UserService.findReports({ _id: req.params.reportId });

    if (report && report.length > 0) {
      const updatedReport = await MetaService.updateReportStatus(
        report[0]._id,
        "Accepted"
      );

      const updatedUser = await UserService.updateUser(
        { _id: report[0].reportedUser._id },
        { status: "Blocked" }
      );

      if (updatedReport && updatedUser) {
        return res.status(200).json({
          report: updatedReport,
          user: updatedUser,
          message: "Report Approved and processed",
        });
      } else {
        return res.status(200).json({
          report: {},
          message: " Report can not processed, Internal server error",
        });
      }
    } else {
      return res.status(200).json({
        report: {},
        message: "Report can not processed, not found",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(200).json({
      message: "Internal Server Error",
      report: {},
    });
  }
};

exports.rejectReportRequest = async (req, res) => {
  try {
    const report = await UserService.findReports({ _id: req.params.reportId });
    if (report && report.length > 0) {
      const updatedReport = await MetaService.updateReportStatus(
        report[0]._id,
        "Rejected"
      );

      const updatedUser = await UserService.updateUser(
        { _id: report[0].reportedUser._id },
        { status: "Active" }
      );

      if (updatedReport && updatedUser) {
        return res.status(200).json({
          report: updatedReport,
          user: updatedUser,
          message: "Report Rejected ",
        });
      } else {
        return res.status(200).json({
          report: {},
          message: " Report can not processed, Internal server error",
        });
      }
    } else {
      return res.status(200).json({
        report: {},
        message: "Report can not processed, not found",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(200).json({
      message: "Internal Server Error",
      report: {},
    });
  }
};

exports.findAllReports = async (req, res) => {
  try {
    const report = await UserService.findReports({ status: "Reported" });
    if (report && report.length > 0) {
      return res.status(200).json({
        reportList: report,
        message: "Report founded",
      });
    } else {
      return res.status(200).json({
        reportList: [],
        message: "Reports can not found",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(200).json({
      message: "Internal Server Error",
      reportList: [],
    });
  }
};
