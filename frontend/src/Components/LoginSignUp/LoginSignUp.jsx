import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginSignUp.css";
import { Mail, Lock, User, Phone, MapPin, Calendar } from "lucide-react";
import PasswordReset from "../PasswordReset/PasswordReset";

const LoginSignUp = () => {
  const navigate = useNavigate();
  const [action, setAction] = useState("Đăng nhập"); // Changed default to Sign In
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    sex: 1,
    address: "",
    email: "",
    password: "",
    type: 1,
  });
  const [error, setError] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (type) => {
    setError("");
    try {
      const endpoint =
        type === "Đăng nhập"
          ? "http://10.147.17.110:8080/api/v1/auth/sign-in"
          : "http://10.147.17.110:8080/api/v1/auth/sign-up";

      if (type === "Đăng ký") {
        const requiredFields = [
          "firstName",
          "lastName",
          "phone",
          "dateOfBirth",
          "sex",
          "address",
          "email",
          "password",
        ];
        const missingFields = requiredFields.filter(
          (field) => !formData[field]
        );
        if (missingFields.length > 0) {
          setError("Vui lòng điền đầy đủ thông tin");
          return;
        }
      }

      const payload =
        type === "Đăng nhập"
          ? {
              email: formData.email,
              password: formData.password,
            }
          : {
              ...formData,
              sex: parseInt(formData.sex),
              type: parseInt(formData.type),
              dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
            };

      const response = await axios.post(endpoint, payload);

      if (type === "Đăng ký") {
        // After successful signup, switch to sign in
        setAction("Đăng nhập");
        setFormData({
          ...formData,
          password: "", // Clear password for security
        });
        setError(""); // Clear any errors
        return; // Don't proceed with token storage
      }

      if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("userId", response.data.userId);
        navigate("/home");
      }
    } catch (err) {
      setError(
        err.response?.data?.description ||
          err.response?.data?.message ||
          "Đã xảy ra lỗi"
      );
    }
  };

  const handlePasswordResetSuccess = () => {
    setShowPasswordReset(false);
    setAction("Đăng nhập");
  };

  return (
    <div className="container">
      {showPasswordReset ? (
        <PasswordReset
          onBackToLogin={() => setShowPasswordReset(false)}
          onResetSuccess={handlePasswordResetSuccess}
        />
      ) : (
        <>
          <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
          </div>

          <div className="toggle-buttons">
            <div
              className={action === "Đăng nhập" ? "toggle gray" : "toggle"}
              onClick={() => setAction("Đăng ký")}
            >
              Đăng ký
            </div>
            <div
              className={action === "Đăng ký" ? "toggle gray" : "toggle"}
              onClick={() => setAction("Đăng nhập")}
            >
              Đăng nhập
            </div>
          </div>

          {error && (
            <div style={{ color: "red", textAlign: "center" }}>{error}</div>
          )}

          <div className="inputs">
            {action === "Đăng ký" && (
              <>
                <div className="input">
                  <User className="input-icon" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Nhập tên..."
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input">
                  <User className="input-icon" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Nhập họ..."
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Số điện thoại..."
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input">
                  <Calendar className="input-icon" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    placeholder="Ngày sinh..."
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input">
                  <User className="input-icon" />
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                  >
                    <option value={1}>Nam</option>
                    <option value={0}>Nữ</option>
                  </select>
                </div>
                <div className="input">
                  <MapPin className="input-icon" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Địa chỉ..."
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            <div className="input">
              <Mail className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Nhập email của bạn..."
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="input">
              <Lock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Nhập mật khẩu của bạn..."
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {action === "Đăng nhập" && (
            <div className="forgot-password">
              Quên mật khẩu?{" "}
              <span onClick={() => setShowPasswordReset(true)}>
                Vui lòng ấn tại đây!
              </span>
            </div>
          )}

          <div className="submit-container">
            <div className="submit" onClick={() => handleSubmit(action)}>
              {action === "Đăng ký" ? "Đăng ký" : "Đăng nhập"}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginSignUp;
