import "../QuanLy.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../../services/axiosConfig";


const API_BASE = `${import.meta.env.VITE_API_BASE}/vattu`;

function VatTu() {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [detailItem, setDetailItem] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Lấy PhanQuyen từ localStorage
  const rawUser = localStorage.getItem("user");
  let parsedUser = null;
  try {
    parsedUser = rawUser ? JSON.parse(rawUser) : null;
  } catch (e) {
    console.warn("Parse user error:", e);
  }
  const userRole =
    parsedUser?.PhanQuyen ||
    localStorage.getItem("PhanQuyen") ||
    null;

  // Chỉ Admin và QuanLy được phép thêm/xóa/sửa
  const canEdit = userRole === "admin" || userRole === "quanly";

  console.log("User Role:", userRole);
  console.log("Can Edit:", canEdit);

  const fetchVatTu = useCallback(async (currentPage = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchWithAuth(`${API_BASE}?page=${currentPage}&limit=${pageSize}`);
      const data = await res.json();
      
      console.log("Fetch vật tư response:", data);

      let list = [];
      let total = 1;

      if (Array.isArray(data)) {
        list = data;
        total = Math.ceil(data.length / pageSize);
      } else if (data.data && Array.isArray(data.data)) {
        list = data.data;
        total = data.totalPages || data.total_pages || Math.ceil(data.total / pageSize) || 1;
      } else if (data.items && Array.isArray(data.items)) {
        list = data.items;
        total = data.totalPages || data.total_pages || 1;
      }

      const mapped = list.map((vt) => ({
        id: vt.MaVT,
        ma: vt.MaVT,
        ten: vt.TenVT,
        donVi: vt.DonViTinh,
        soLuong: vt.SoLuong ?? 0,
        trangThai: vt.TrangThai,
        maLoai: vt.MaLoai,
        maChoChua: vt.MaChoChua,
        donGiaNhap: parseFloat(vt.DonGiaNhap || 0),
        donGiaXuat: parseFloat(vt.DonGiaXuat || 0),
      }));

      console.log("Mapped items:", mapped);

      setItems(mapped);
      setTotalPages(total);
    } catch (e) {
      console.error("Fetch vật tư error:", e);
      setError(e.message || "Không thể tải vật tư");
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    if (!isSearching) {
      fetchVatTu(page);
    }
  }, [page, isSearching, fetchVatTu]);

  const doSearch = async (keyword, searchPage) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetchWithAuth(
        `${API_BASE}/search?keyword=${encodeURIComponent(keyword)}&page=${searchPage}&limit=${pageSize}`
      );

      const data = await res.json();
      console.log("Search response:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Tìm kiếm thất bại.");
      }

      let list = [];
      let total = 1;

      if (Array.isArray(data)) {
        list = data;
        total = Math.ceil(data.length / pageSize);
      } else if (data.data && Array.isArray(data.data)) {
        list = data.data;
        total = data.totalPages || data.total_pages || Math.ceil(data.total / pageSize) || 1;
      } else if (data.items && Array.isArray(data.items)) {
        list = data.items;
        total = data.totalPages || data.total_pages || 1;
      }

      const mapped = list.map((vt) => ({
        id: vt.MaVT,
        ma: vt.MaVT,
        ten: vt.TenVT,
        donVi: vt.DonViTinh,
        soLuong: vt.SoLuong ?? 0,
        trangThai: vt.TrangThai,
        maLoai: vt.MaLoai,
        maChoChua: vt.MaChoChua,
        donGiaNhap: parseFloat(vt.DonGiaNhap || 0),
        donGiaXuat: parseFloat(vt.DonGiaXuat || 0),
      }));

      console.log("Search mapped items:", mapped);

      setItems(mapped);
      setTotalPages(total);
    } catch (e) {
      console.error("Search error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const kw = searchText.trim();
    if (!kw) {
      setIsSearching(false);
      setPage(1);
      return;
    }
    setIsSearching(true);
    setPage(1);
    doSearch(kw, 1);
  };

  useEffect(() => {
    if (isSearching && searchText.trim()) {
      doSearch(searchText.trim(), page);
    } else if (!isSearching) {
      fetchVatTu(page);
    }
  }, [page, isSearching, searchText]);

  const handleDelete = async (ma) => {
    if (!canEdit) {
      alert("Bạn không có quyền xóa vật tư.");
      return;
    }

    if (!ma) { alert("Thiếu mã vật tư."); return; }
    if (!window.confirm("Xóa vật tư này?")) return;

    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/delete/${ma}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text() || "Xóa thất bại");
      alert("Xóa thành công"); fetchVatTu(page);
    } catch (e) { alert(e.message); } finally { setLoading(false); }
  };

  const handleEditNavigate = (ma) => {
    if (!canEdit) {
      alert("Bạn không có quyền sửa vật tư.");
      return;
    }
    // Dùng mã vật tư chuyển sang trang sửa
    navigate(`/Admin/thongtinvattu?ma=${encodeURIComponent(ma)}`);
  };

  const handleAddNew = () => {
    if (!canEdit) {
      alert("Bạn không có quyền thêm vật tư.");
      return;
    }
    navigate("/Admin/thongtinvattu");
  };

  const openDetail = async (item) => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/detail/${item.ma}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();
      console.log("Detail response:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Không tải được chi tiết vật tư.");
      }

      const detail = data.data || data;

      const mapped = {
        id:  detail.MaVT,
        ma: detail.MaVT,
        ten: detail.TenVT,
        donVi: detail.DonViTinh,
        soLuong: detail.SoLuong ?? 0,
        trangThai: detail.TrangThai,
        maLoai: detail.MaLoai,
        maChoChua: detail.MaChoChua,
        donGiaNhap: parseFloat(detail.DonGiaNhap || 0),
        donGiaXuat: parseFloat(detail.DonGiaXuat || 0),
        moTa: detail.MoTa || "",
        xuatXu: detail.XuatXu || "",
        ngayNhap: detail.NgayNhap || "",
      };

      setDetailItem(mapped);
    } catch (e) {
      alert("Lỗi tải chi tiết: " + e.message);
      console.error("Detail error:", e);
    } finally {
      setLoading(false);
    }
  };
  const closeDetail = () => setDetailItem(null);

  const formatVND = (n) => {
    const num = typeof n === "number" && !isNaN(n) ? n : 0;
    return num > 0 ? num.toLocaleString("vi-VN") + " ₫" : "-";
  };

  const renderTable = () => {
    if (loading) return <div>Đang tải...</div>;
    return (
      <table className="data-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã vật tư</th>
            <th>Tên vật tư</th>
            <th>Đơn vị tính</th>
            <th>Số lượng</th>
            <th>Trạng thái tồn kho</th>
            <th>Xem chi tiết</th>
            {canEdit && <th>Cập nhật</th>}
            {canEdit && <th>Xóa</th>}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={canEdit ? 9 : 7}>Không có dữ liệu</td>
            </tr>
          ) : (
            items.map((it, idx) => (
              <tr key={it.id || it.ma}>
                <td>{(page - 1) * pageSize + idx + 1}</td>
                <td>{it.ma}</td>
                <td>{it.ten}</td>
                <td>{it.donVi}</td>
                <td>{it.soLuong}</td>
                <td>{it.trangThai}</td>
                <td>
                  <button
                    type="button"
                    className="btn-small"
                    onClick={() => openDetail(it)}
                  >
                    Xem chi tiết
                  </button>
                </td>
                {canEdit && (
                  <td>
                    <button
                      type="button"
                      className="btn-small"
                      onClick={() => handleEditNavigate(it.ma)}
                    >
                      Sửa
                    </button>
                  </td>
                )}
                {canEdit && (
                  <td>
                    <button
                      type="button"
                      className="btn-small btn-danger"
                      onClick={() => handleDelete(it.ma)}
                    >
                      Xóa
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div className="vattu-container">
      <div className="search-container">
        <form className="search-grid" onSubmit={handleSearch}>
          <input
            type="text"
            id="search_text"
            className="input-row"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Nhập mã hoặc tên vật tư..."
            style={{ width: "300px" }}
          />
          <div className="search-button-wrapper">
            <button type="submit" className="search-button" disabled={loading}>
              <span>Tìm kiếm</span>
            </button>
            {isSearching && (
              <button
                type="button"
                className="search-button"
                style={{ marginLeft: "8px" }}
                onClick={() => {
                  setSearchText("");
                  setIsSearching(false);
                  setPage(1);
                }}
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="body-section">
        {canEdit && (
          <div className="add-item-button-wrapper">
            <button className="add-item-button" onClick={handleAddNew} disabled={loading}>
              <span>+</span> Thêm vật tư
            </button>
          </div>
        )}

        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        {renderTable()}

        {!loading && totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              « Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pn => (
              <button
                key={pn}
                className={`page-btn ${pn === page ? "active" : ""}`}
                onClick={() => setPage(pn)}
              >
                {pn}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Sau »
            </button>
          </div>
        )}
      </div>

      {detailItem && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết vật tư</h3>
              <button className="modal-close" onClick={closeDetail}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="label">Mã vật tư:</span>
                <span className="value">{detailItem.ma}</span>
              </div>
              <div className="detail-row">
                <span className="label">Tên vật tư:</span>
                <span className="value">{detailItem.ten}</span>
              </div>
              <div className="detail-row">
                <span className="label">Đơn vị tính:</span>
                <span className="value">{detailItem.donVi}</span>
              </div>
              <div className="detail-row">
                <span className="label">Số lượng tồn kho:</span>
                <span className="value">{detailItem.soLuong}</span>
              </div>
              <div className="detail-row">
                <span className="label">Trạng thái tồn kho:</span>
                <span className="value">{detailItem.trangThai}</span>
              </div>
              <div className="detail-row">
                <span className="label">Mã loại:</span>
                <span className="value">{detailItem.maLoai}</span>
              </div>
              <div className="detail-row">
                <span className="label">Mã chỗ chứa:</span>
                <span className="value">{detailItem.maChoChua}</span>
              </div>
              <div className="detail-row">
                <span className="label">Đơn giá nhập:</span>
                <span className="value">{formatVND(detailItem.donGiaNhap)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Đơn giá xuất:</span>
                <span className="value">{formatVND(detailItem.donGiaXuat)}</span>
              </div>
              {detailItem.moTa && (
                <div className="detail-row">
                  <span className="label">Mô tả:</span>
                  <span className="value">{detailItem.moTa}</span>
                </div>
              )}
              {detailItem.xuatXu && (
                <div className="detail-row">
                  <span className="label">Xuất xứ:</span>
                  <span className="value">{detailItem.xuatXu}</span>
                </div>
              )}
              {detailItem.ngayNhap && (
                <div className="detail-row">
                  <span className="label">Ngày nhập:</span>
                  <span className="value">{detailItem.ngayNhap}</span>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={closeDetail}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default VatTu;
