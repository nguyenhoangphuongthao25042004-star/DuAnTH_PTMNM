import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ThongTinNV.css";
import fetchWithAuth from "../../../services/axiosConfig";


const API_BASE = `${import.meta.env.VITE_API_BASE}/nhanvien`;

function ThongTinNV() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    MaNV: "",
    HoTenNV: "",
    ChucVu: "",
    GioiTinh: "Nam",
    NgaySinh: "",
    QueQuan: "",
    CCCD: "",
    DiaChi: "",
    SDT: "",
    Email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      fetchDetail();
    }
  }, [id, isEdit]);

  const fetchDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchWithAuth(`${API_BASE}/detail/${id}`);
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Không thể tải thông tin nhân viên");
      }

      const data = await res.json();
      console.log("Detail data:", data);
      
      // Format ngày sinh về yyyy-MM-dd cho input type="date"
      let ngaySinh = data.NgaySinh || "";
      if (ngaySinh) {
        const date = new Date(ngaySinh);
        if (!isNaN(date.getTime())) {
          ngaySinh = date.toISOString().split('T')[0];
        }
      }
      
      setFormData({
        MaNV: data.MaNV || "",
        HoTenNV: data.HoTenNV || "",
        ChucVu: data.ChucVu || "",
        GioiTinh: data.GioiTinh || "Nam",
        NgaySinh: ngaySinh,
        QueQuan: data.QueQuan || "",
        CCCD: data.CCCD || "",
        DiaChi: data.DiaChi || "",
        SDT: data.SDT || "",
        Email: data.Email || "",
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
    
    if (!formData.MaNV || !formData.HoTenNV) {
      alert("Vui lòng nhập Mã NV và Họ tên");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        MaNV: formData.MaNV.trim(),
        HoTenNV: formData.HoTenNV.trim(),
        ChucVu: formData.ChucVu.trim(),
        GioiTinh: formData.GioiTinh,
        NgaySinh: formData.NgaySinh,
        QueQuan: formData.QueQuan.trim(),
        CCCD: formData.CCCD.trim(),
        DiaChi: formData.DiaChi.trim(),
        SDT: formData.SDT.trim(),
        Email: formData.Email.trim(),
      };

      console.log("Payload gửi lên:", payload);

      if (isEdit) {
        // Cập nhật nhân viên
        const res = await fetchWithAuth(`${API_BASE}/update/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Update error response:", errorText);
          throw new Error(errorText || "Không thể cập nhật nhân viên");
        }

        alert("Cập nhật nhân viên thành công!");
      } else {
        // Thêm mới nhân viên
        const res = await fetchWithAuth(`${API_BASE}/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Create error response:", errorText);
          throw new Error(errorText || "Không thể thêm nhân viên");
        }

        const result = await res.json();
        console.log("Create success:", result);
        alert("Thêm nhân viên thành công!");
      }

      navigate("/Admin/nhanvien");
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
      alert(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/Admin/nhanvien");

  if (loading && isEdit && !formData.MaNV) {
    return (
      <div className="thongtin-nv-container">
        <div style={{ textAlign: "center", padding: "20px" }}>Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="thongtin-nv-container">
      <h2>{isEdit ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}</h2>

      {error && (
        <div style={{ color: "red", padding: "10px", marginBottom: "10px" }}>
          {error}
        </div>
      )}

      <form className="thongtin-nv-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="MaNV">Mã NV *</label>
          <input 
            id="MaNV" 
            name="MaNV" 
            value={formData.MaNV} 
            onChange={handleChange} 
            required 
            disabled={isEdit}
            style={isEdit ? { backgroundColor: "#f0f0f0", cursor: "not-allowed" } : {}}
          />
        </div>

        <div className="form-row">
          <label htmlFor="HoTenNV">Họ tên *</label>
          <input 
            id="HoTenNV" 
            name="HoTenNV" 
            value={formData.HoTenNV} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-row">
          <label htmlFor="ChucVu">Chức vụ</label>
          <input 
            id="ChucVu" 
            name="ChucVu" 
            value={formData.ChucVu} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-row">
          <label htmlFor="GioiTinh">Giới tính</label>
          <select 
            id="GioiTinh" 
            name="GioiTinh" 
            value={formData.GioiTinh} 
            onChange={handleChange}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="NgaySinh">Ngày sinh</label>
          <input 
            type="date" 
            id="NgaySinh" 
            name="NgaySinh" 
            value={formData.NgaySinh} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-row">
          <label htmlFor="QueQuan">Quê quán</label>
          <input 
            id="QueQuan" 
            name="QueQuan" 
            value={formData.QueQuan} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-row">
          <label htmlFor="CCCD">CCCD</label>
          <input 
            id="CCCD" 
            name="CCCD" 
            value={formData.CCCD} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-row">
          <label htmlFor="DiaChi">Địa chỉ</label>
          <input 
            id="DiaChi" 
            name="DiaChi" 
            value={formData.DiaChi} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-row">
          <label htmlFor="SDT">SĐT</label>
          <input 
            id="SDT" 
            name="SDT" 
            value={formData.SDT} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-row">
          <label htmlFor="Email">Email</label>
          <input 
            type="email" 
            id="Email" 
            name="Email" 
            value={formData.Email} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Đang xử lý..." : (isEdit ? "Cập nhật" : "Thêm mới")}
          </button>
          <button type="button" className="btn-secondary" onClick={handleCancel} disabled={loading}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default ThongTinNV;