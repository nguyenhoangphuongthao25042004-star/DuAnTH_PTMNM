import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ThongTinNCC.css";


const API_BASE = `${import.meta.env.VITE_API_BASE}/nhacc`;


function ThongTinNCC() {
  const { id } = useParams(); // id ở đây là MaNCC
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    ma: "",
    ten: "",
    diaChi: "",
    sdt: "",
    email: "",
    daiDien: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
          const res = await fetch(`${API_BASE}/detail/${id}`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          });
          
          if (!res.ok) {
            throw new Error("Không thể tải thông tin nhà cung cấp");
          }
          
          const data = await res.json();
          setFormData({
            ma: data.MaNCC || "",
            ten: data.TenNCC || "",
            diaChi: data.DiaChi || "",
            sdt: data.SDT || "",
            email: data.Email || "",
            daiDien: data.NguoiDaiDien || "",
          });
        } catch (err) {
          console.error("fetchDetail error:", err);
          setError(err.message);
          alert(`Lỗi: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Chuẩn hóa mã NCC
    const maNCC = formData.ma?.trim();
    const regex = /^NCC\d{1,7}$/;
    if (!regex.test(maNCC)) {
      setError("Mã nhà cung cấp phải bắt đầu bằng 'NCC' và tối đa 7 số phía sau");
      setLoading(false);
      return;
    }

    // Tạo payload đúng tên trường
    const payload = {
      MaNCC: maNCC,
      TenNCC: formData.ten?.trim(),
      DiaChi: formData.diaChi?.trim(),
      SDT: formData.sdt?.trim(),
      Email: formData.email?.trim(),
      NguoiDaiDien: formData.daiDien?.trim()
    };

    console.log("Payload gửi lên NCC:", payload);

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Tạo nhà cung cấp thất bại");
      }

      alert("Thêm nhà cung cấp thành công!");
      navigate("/Admin/nhacc");
    } catch (err) {
      setError(err.message);
      console.error("handleSubmit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/Admin/ncc");
  };

  return (
    <div className="thongtin-ncc-container">
      <h2>{isEdit ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp mới"}</h2>
      
      {error && (
        <div style={{ color: "red", padding: "10px", marginBottom: "10px" }}>
          {error}
        </div>
      )}

      <form className="thongtin-ncc-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="ma">Mã nhà cung cấp *</label>
          <input
            type="text"
            id="ma"
            name="ma"
            value={formData.ma}
            onChange={handleChange}
            required
            disabled={isEdit}
          />
        </div>

        <div className="form-row">
          <label htmlFor="ten">Tên nhà cung cấp *</label>
          <input
            type="text"
            id="ten"
            name="ten"
            value={formData.ten}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="diaChi">Địa chỉ *</label>
          <input
            type="text"
            id="diaChi"
            name="diaChi"
            value={formData.diaChi}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="sdt">Số điện thoại *</label>
          <input
            type="tel"
            id="sdt"
            name="sdt"
            value={formData.sdt}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="daiDien">Người đại diện</label>
          <input
            type="text"
            id="daiDien"
            name="daiDien"
            value={formData.daiDien}
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

export default ThongTinNCC;