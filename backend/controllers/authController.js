const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Op } = require("sequelize");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
        description: "No user found with this email",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
        description: "Password does not match",
      });
    }

    const accessToken = generateToken(user.id);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      accessToken,
      userId: user.id,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      description: error.message,
    });
  }
};

exports.signUp = async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    dateOfBirth,
    sex,
    address,
    email,
    password,
    type,
  } = req.body;

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Người dùng đã tồn tại",
        description:
          "An account with this email or phone number already exists",
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      phone,
      dateOfBirth,
      sex,
      address,
      email,
      password,
      type: type || 1,
    });

    const accessToken = generateToken(user.id);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      description: "User account created",
      accessToken,
      userId: user.id,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        status: "error",
        message: "Validation Failed",
        description: error.errors.map((err) => err.message).join(", "),
      });
    }

    res.status(500).json({
      status: "error",
      message: "Registration failed",
      description: error.message,
    });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  const { email, type } = req.body;

  try {
    if (!email || typeof type !== "number") {
      return res.status(400).json({
        status: "error",
        message: "Email và loại người dùng là bắt buộc",
      });
    }

    const user = await User.findOne({ where: { email, type } });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy người dùng với email và loại này",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    await user.update({
      resetOTP: otp,
      resetOTPExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    console.log(`Generated OTP for ${email}: ${otp}`);

    res.status(200).json({
      status: "success",
      message: "OTP đã được gửi đến email của bạn",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Có lỗi xảy ra khi xử lý yêu cầu",
      description: error.message,
    });
  }
};

exports.checkResetPasswordOTP = async (req, res) => {
  const { resetKey, type } = req.body;

  try {
    if (!resetKey || typeof type !== "number") {
      return res.status(400).json({
        status: "error",
        message: "OTP và loại người dùng là bắt buộc",
      });
    }

    const user = await User.findOne({
      where: {
        resetOTP: resetKey,
        type,
      },
    });

    if (!user) {
      return res.status(404).json({
        isValid: false,
        message: "OTP không hợp lệ",
      });
    }

    if (Date.now() > user.resetOTPExpires) {
      return res.status(400).json({
        isValid: false,
        message: "OTP đã hết hạn",
      });
    }

    res.status(200).json({
      isValid: true,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Có lỗi xảy ra khi kiểm tra OTP",
      description: error.message,
    });
  }
};

exports.resetPasswordFinish = async (req, res) => {
  const { resetKey, type, newPassword } = req.body;

  try {
    if (!resetKey || typeof type !== "number" || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "OTP, loại người dùng, và mật khẩu mới là bắt buộc",
      });
    }

    const user = await User.findOne({
      where: {
        resetOTP: resetKey,
        type,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "OTP không hợp lệ hoặc người dùng không tồn tại",
      });
    }

    if (Date.now() > user.resetOTPExpires) {
      return res.status(400).json({
        status: "error",
        message: "OTP đã hết hạn",
      });
    }

    await user.update({
      password: newPassword,
      resetOTP: null,
      resetOTPExpires: null,
    });

    res.status(200).json({
      status: "success",
      message: "Mật khẩu đã được cập nhật thành công",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Có lỗi xảy ra khi cập nhật mật khẩu",
      description: error.message,
    });
  }
};
