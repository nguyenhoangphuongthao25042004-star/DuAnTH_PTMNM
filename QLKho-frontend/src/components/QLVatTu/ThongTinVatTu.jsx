import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ThongTinVatTu.css';

const API_BASE = "http://localhost:4000/api/vattu";
const ENDPOINTS = {
  create: `${API_BASE}/create`,
  detail: (ma) => `${API_BASE}/detail/${ma}`,        // backend dùng /detail/:MaVT
  update: (ma) => `${API_BASE}/update/${ma}`          // dùng PUT /update/:MaVT (403 → đúng route, cần quyền)
};

function ThongTinVatTu() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const maParam = searchParams.get('ma');
  const isEdit = !!maParam;

  const [formData, setFormData] = useState({
    MaVT: '',
    TenVT: '',
    MaLoai: '',
    DonViTinh: '',
    SoLuong: 0,
    TrangThai: 'Hết hàng',
    MaChoChua: '',
    DonGiaNhap: '',
    DonGiaXuat: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fetchedRef = useRef(false);

  const getTrangThaiFromSoLuong = (soLuong) => {
    const sl = Number(soLuong) || 0;
    return sl === 0 ? 'Hết hàng' : 'Còn hàng';
  };

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (isEdit && maParam && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchDetail(maParam);
    } else if (!isEdit) {
      setFormData(prev => ({ ...prev, MaVT: '', SoLuong: 0, TrangThai: 'Hết hàng' }));
    }
  }, [isEdit, maParam]);

  const fetchDetail = async (ma) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(ENDPOINTS.detail(ma), {
        headers: { 'Content-Type': 'application/json', ...authHeaders() }
      });
      if (res.status === 401) { alert('Hết hạn phiên. Đăng nhập lại.'); navigate('/'); return; }
      if (res.status === 403) { setError('Không có quyền xem vật tư.'); return; }
      if (!res.ok) throw new Error(`Không tìm thấy (HTTP ${res.status})`);
      const data = await res.json();
      fillForm(data.data || data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fillForm = (vt) => {
    setFormData({
      MaVT: vt.MaVT || '',
      TenVT: vt.TenVT || '',
      MaLoai: vt.MaLoai || '',
      DonViTinh: vt.DonViTinh || '',
      SoLuong: vt.SoLuong ?? 0,
      TrangThai: vt.TrangThai || getTrangThaiFromSoLuong(vt.SoLuong ?? 0),
      MaChoChua: vt.MaChoChua || '',
      DonGiaNhap: vt.DonGiaNhap || '',
      DonGiaXuat: vt.DonGiaXuat || ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.MaVT || !formData.TenVT) { alert('Thiếu mã / tên'); return; }
    setLoading(true); setError('');

    // Tạo payload KHÔNG có TrangThai
    const payload = {
      MaVT: formData.MaVT.trim(),
      TenVT: formData.TenVT.trim(),
      MaLoai: formData.MaLoai,
      DonViTinh: formData.DonViTinh,
      MaChoChua: formData.MaChoChua,
      DonGiaNhap: parseFloat(formData.DonGiaNhap),
      DonGiaXuat: parseFloat(formData.DonGiaXuat)
    };

    // Log để debug
    console.log('Payload gửi đi:', payload);
    console.log('Headers:', authHeaders());

    try {
      let res;
      if (isEdit) {
        res = await fetch(ENDPOINTS.update(formData.MaVT), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(ENDPOINTS.create, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify(payload)
        });
      }

      // Log response để debug
      console.log('Response status:', res.status);
      
      if (res.status === 401) { 
        alert('Hết hạn phiên. Đăng nhập lại.');
        navigate('/'); 
        return; 
      }
      if (res.status === 403) { 
        setError('Không có quyền (403).'); 
        return; 
      }

      const data = await res.json().catch(() => ({}));
      
      // Log error message từ server
      if (!res.ok) {
        console.error('Server error:', data);
        throw new Error(data.message || data.error || `HTTP ${res.status}`);
      }

      localStorage.setItem('vattuFlash', isEdit ? 'Cập nhật thành công' : 'Thêm thành công');
      navigate('/Admin/vattu');
    } catch (e2) {
      console.error('Submit error:', e2);
      setError(`Lỗi: ${e2.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="thongtin-container">
      <h2>{isEdit ? 'Cập nhật vật tư' : 'Thêm vật tư mới'}</h2>
      {error && <div style={{color:'red', marginBottom:12}}>{error}</div>}
      <form className="thongtin-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="MaVT">Mã vật tư *</label>
          <input
            type="text"
            id="MaVT"
            name="MaVT"
            value={formData.MaVT}
            onChange={handleChange}
            maxLength="20"
            disabled={isEdit || loading}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="TenVT">Tên vật tư *</label>
          <input
            type="text"
            id="TenVT"
            name="TenVT"
            value={formData.TenVT}
            onChange={handleChange}
            maxLength="100"
            disabled={loading}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="MaLoai">Nhóm hàng</label>
          <select
            id="MaLoai"
            name="MaLoai"
            value={formData.MaLoai}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">-- Chọn Loại --</option>
            <option value="LVT01">Thép và hợp kim</option>
            <option value="LVT02">Vật liệu hàn và cắt</option>
            <option value="LVT03">Vật liệu phủ bề mặt</option>
            <option value="LVT04">Vật liệu sản xuất</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="DonViTinh">Đơn vị tính</label>
          <input
            type="text"
            id="DonViTinh"
            name="DonViTinh"
            value={formData.DonViTinh}
            onChange={handleChange}
            maxLength="20"
            disabled={loading}
          />
        </div>
        <div className="form-row">
          <label htmlFor="DonGiaNhap">Đơn giá nhập</label>
          <input
            type="number"
            id="DonGiaNhap"
            name="DonGiaNhap"
            value={formData.DonGiaNhap}
            onChange={handleChange}
            min="0"
            step="1"
            disabled={loading}
          />
        </div>
        <div className="form-row">
          <label htmlFor="DonGiaXuat">Đơn giá xuất</label>
          <input
            type="number"
            id="DonGiaXuat"
            name="DonGiaXuat"
            value={formData.DonGiaXuat}
            onChange={handleChange}
            min="0"
            step="1"
            disabled={loading}
          />
        </div>
        <div className="form-row">
          <label htmlFor="MaChoChua">Mã chỗ chứa</label>
          <select
            id="MaChoChua"
            name="MaChoChua"
            value={formData.MaChoChua}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">-- Chọn Chỗ Chứa --</option>
            <option value="CC01">Kệ A1</option>
            <option value="CC02">Kệ A2</option>
            <option value="CC03">Kệ A3</option>
            <option value="CC04">Kệ B1</option>
            <option value="CC05">Kệ B2</option>
            <option value="CC06">Kệ B3</option>
            <option value="CC07">Kệ B4</option>
            <option value="CC08">Kệ C1</option>
            <option value="CC09">Kệ C2</option>
            <option value="CC010">Kệ C3</option>
            <option value="CC011">Kệ D1</option>
            <option value="CC012">Kệ D2</option>
            <option value="CC014">Kệ D3</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/Admin/vattu')} disabled={loading}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default ThongTinVatTu;