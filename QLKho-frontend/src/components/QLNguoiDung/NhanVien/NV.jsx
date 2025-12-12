import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../QuanLy.css";
import fetchWithAuth from "../../../services/axiosConfig";

const API_BASE = "http://localhost:4000/api/nhanvien";

function NV() {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [detailItem, setDetailItem] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Lấy PhanQuyen an toàn
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
    localStorage.getItem("userRole") ||
    null;

  const isAdmin = userRole === "admin";

  console.log("User Role (resolved):", userRole);
  console.log("Is Admin:", isAdmin);

  const fetchNhanVien = useCallback(async (currentPage = 1) => {
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE}?page=${currentPage}&limit=${pageSize}`;
      const res = await fetchWithAuth(url);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText || "Không thể tải dữ liệu nhân viên"}`);
      }

      const data = await res.json();
      console.log("Dữ liệu nhân viên:", data);
      
      setItems(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("fetchNhanVien error:", err);
      setError(err.message);
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    if (!isSearching) {
      fetchNhanVien(page);
    }
  }, [page, isSearching, fetchNhanVien]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const search = searchText.trim();

    if (!search) {
      setIsSearching(false);
      setPage(1);
      fetchNhanVien(1);
      return;
    }

    setLoading(true);
    setError("");
    setIsSearching(true);
    try {
      const url = `${API_BASE}/search?keyword=${encodeURIComponent(search)}&page=1&limit=${pageSize}`;
      const res = await fetchWithAuth(url);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText || "Không thể tìm kiếm"}`);
      }

      const data = await res.json();
      console.log("Search result:", data);
      
      setItems(data.data || []);
      setTotalPages(data.totalPages || 1);
      setPage(1);
    } catch (err) {
      console.error("search error:", err);
      setError(err.message);
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSearching && searchText.trim()) {
      const search = async () => {
        setLoading(true);
        setError("");
        try {
          const url = `${API_BASE}/search?keyword=${encodeURIComponent(searchText.trim())}&page=${page}&limit=${pageSize}`;
          const res = await fetchWithAuth(url);
          
          if (!res.ok) throw new Error("Không thể tìm kiếm");
          
          const data = await res.json();
          setItems(data.data || []);
          setTotalPages(data.totalPages || 1);
        } catch (err) {
          console.error("search page error:", err);
          setError(err.message);
          setItems([]);
          setTotalPages(1);
        } finally {
          setLoading(false);
        }
      };
      search();
    }
  }, [page, isSearching, searchText, pageSize]);

  const handleDelete = async (maNV) => {
    const ok = window.confirm("Bạn có chắc muốn xóa nhân viên này?");
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/delete/${maNV}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Không thể xóa nhân viên");
      }

      alert("Xóa nhân viên thành công!");

      // Refresh lại danh sách
      if (isSearching && searchText.trim()) {
        handleSearch({ preventDefault: () => {} });
      } else {
        // Nếu trang hiện tại không còn dữ liệu sau khi xóa, quay về trang trước
        const remainingItems = items.length - 1;
        if (remainingItems === 0 && page > 1) {
          setPage(page - 1);
        } else {
          await fetchNhanVien(page);
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditNavigate = (maNV) => navigate(`/Admin/thongtinnv/${maNV}`);
  const handleAddNew = () => navigate(`/Admin/thongtinnv`);

  const fetchDetail = async (maNV) => {
    setLoadingDetail(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/detail/${maNV}`);
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Không thể tải chi tiết nhân viên");
      }

      const data = await res.json();
      console.log("Chi tiết nhân viên:", data);
      setDetailItem(data);
    } catch (err) {
      console.error("Fetch detail error:", err);
      alert(`Lỗi: ${err.message}`);
    } finally {
      setLoadingDetail(false);
    }
  };

  const openDetail = (maNV) => {
    fetchDetail(maNV);
  };

  const closeDetail = () => setDetailItem(null);

  const startIdx = (page - 1) * pageSize;

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
            placeholder="Nhập mã hoặc họ tên nhân viên..."
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

      {error && (
        <div style={{ color: "red", padding: "10px", textAlign: "center" }}>
          {error}
        </div>
      )}

      <div className="body-section">
        {/* Chỉ hiển thị nút thêm mới khi role là Admin */}
        {isAdmin && (
          <div className="add-item-button-wrapper">
            <button className="add-item-button" onClick={handleAddNew}>
              <span>+</span> Thêm nhân viên
            </button>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            Đang tải...
          </div>
        )}

        {!loading && (
          <table className="data-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã NV</th>
                <th>Họ tên</th>
                <th>Chức vụ</th>
                <th>Giới tính</th>
                <th>Trạng thái</th>
                <th>Xem chi tiết</th>
                <th>Cập nhật</th>
                {/* Chỉ hiển thị cột Xóa khi role là Admin */}
                {isAdmin && <th>Xóa</th>}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={isAdmin ? 9 : 8}>Không có dữ liệu</td></tr>
              ) : (
                items.map((it, idx) => (
                  <tr key={it.MaNV}>
                    <td>{startIdx + idx + 1}</td>
                    <td>{it.MaNV}</td>
                    <td>{it.HoTenNV}</td>
                    <td>{it.ChucVu}</td>
                    <td>{it.GioiTinh}</td>
                    <td>{it.TrangThai === "active" ? "Đang làm việc" : "Đã thôi việc"}</td>
                    <td>
                      <button className="btn-small" onClick={() => openDetail(it.MaNV)}>
                        Xem chi tiết
                      </button>
                    </td>
                    <td>
                      <button className="btn-small" onClick={() => handleEditNavigate(it.MaNV)}>
                        Sửa
                      </button>
                    </td>
                    {/* Chỉ hiển thị nút Xóa khi role là Admin */}
                    {isAdmin && (
                      <td>
                        <button className="btn-small btn-danger" onClick={() => handleDelete(it.MaNV)} disabled={loading}>
                          Xóa
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            « Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pn) => (
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Sau »
          </button>
        </div>
      </div>

      {detailItem && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết nhân viên</h3>
              <button className="modal-close" onClick={closeDetail}>×</button>
            </div>
            {loadingDetail ? (
              <div style={{ textAlign: "center", padding: "20px" }}>Đang tải...</div>
            ) : (
              <>
                <div className="modal-body">
                  <div className="detail-row"><span className="label">Mã NV:</span><span className="value">{detailItem.MaNV}</span></div>
                  <div className="detail-row"><span className="label">Họ tên:</span><span className="value">{detailItem.HoTenNV}</span></div>
                  <div className="detail-row"><span className="label">Chức vụ:</span><span className="value">{detailItem.ChucVu}</span></div>
                  <div className="detail-row"><span className="label">Giới tính:</span><span className="value">{detailItem.GioiTinh}</span></div>
                  <div className="detail-row"><span className="label">Ngày sinh:</span><span className="value">{detailItem.NgaySinh}</span></div>
                  <div className="detail-row"><span className="label">Quê quán:</span><span className="value">{detailItem.QueQuan}</span></div>
                  <div className="detail-row"><span className="label">CCCD:</span><span className="value">{detailItem.CCCD}</span></div>
                  <div className="detail-row"><span className="label">Địa chỉ:</span><span className="value">{detailItem.DiaChi}</span></div>
                  <div className="detail-row"><span className="label">SĐT:</span><span className="value">{detailItem.SDT}</span></div>
                  <div className="detail-row"><span className="label">Email:</span><span className="value">{detailItem.Email}</span></div>
                  <div className="detail-row"><span className="label">Trạng thái:</span><span className="value">{detailItem.TrangThai === "active" ? "Đang làm việc" : "Đã thôi việc"}</span></div>
                </div>
                <div className="modal-actions">
                  <button className="btn" onClick={closeDetail}>Đóng</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NV;