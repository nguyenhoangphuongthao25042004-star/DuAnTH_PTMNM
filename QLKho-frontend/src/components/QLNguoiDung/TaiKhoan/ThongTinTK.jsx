import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import fetchWithAuth from "../../../services/axiosConfig";
import "./ThongTinTK.css";

const API_BASE = `${import.meta.env.VITE_API_BASE}/taikhoan`;

function ThongTinTK() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    UserName: "",
    MaNV: "",
    PhanQuyen: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (username) {
      fetchDetail();
    }
  }, [username]);

  const fetchDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchWithAuth(`${API_BASE}/detail/${username}`);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Không thể tải thông tin tài khoản");
      }

      const data = await res.json();
      console.log("Detail data:", data);

      setFormData({
        UserName: data.UserName || "",
        MaNV: data.MaNV || "",
        PhanQuyen: data.PhanQuyen || "",
      });
    } catch (err) {
      console.error("Fetch detail error:", err);
      setError(err.message);
      alert(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      alert("Không tìm thấy username");
      return;
    }

    if (!formData.PhanQuyen) {
      alert("Vui lòng chọn phân quyền");
      return;
    }

    console.log("Updating account:", username);
    console.log("Update data:", {
      PhanQuyen: formData.PhanQuyen,
    });

    setLoading(true);
    setError("");
    try {
      const res = await fetchWithAuth(`${API_BASE}/update/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PhanQuyen: formData.PhanQuyen,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Không thể cập nhật tài khoản");
      }

      alert("Cập nhật tài khoản thành công!");
      navigate("/Admin/taikhoan");
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
      alert(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/Admin/taikhoan");

  if (!username) {
    return (
      <div className="thongtin-tk-container">
        <div style={{ color: "red", padding: "20px", textAlign: "center" }}>
          Lỗi: Không tìm thấy username trong URL
        </div>
        <button onClick={handleCancel}>Quay lại</button>
      </div>
    );
  }

  if (loading && !formData.UserName) {
    return (
      <div className="thongtin-tk-container">
        <div style={{ textAlign: "center", padding: "20px" }}>Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="thongtin-tk-container">
      <h2>Cập nhật tài khoản: {username}</h2>

      {error && (
        <div style={{ color: "red", padding: "10px", marginBottom: "10px" }}>
          {error}
        </div>
      )}

      <form className="thongtin-tk-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="UserName">Tên đăng nhập</label>
          <input
            id="UserName"
            name="UserName"
            value={formData.UserName}
            disabled
            style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
          />
        </div>

        <div className="form-row">
          <label htmlFor="MaNV">Mã nhân viên</label>
          <input
            id="MaNV"
            name="MaNV"
            value={formData.MaNV}
            disabled
            style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
          />
        </div>

        <div className="form-row">
          <label htmlFor="PhanQuyen">Phân quyền *</label>
          <select
            id="PhanQuyen"
            name="PhanQuyen"
            value={formData.PhanQuyen}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn phân quyền --</option>
            <option value="admin">Admin</option>
            <option value="quanly">Quản Lý</option>
            <option value="thukho">Thủ Kho</option>
            <option value="nhanvien">Nhân Viên</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default ThongTinTK;