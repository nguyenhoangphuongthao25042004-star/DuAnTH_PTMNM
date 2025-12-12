import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../QuanLy.css";
import fetchWithAuth from "../../services/axiosConfig";

const API_BASE = "http://localhost:4000/api/nhacc";

function NCC() {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [detailItem, setDetailItem] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // State cho lịch sử cung cấp
  const [historyData, setHistoryData] = useState(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(false);
  const historyPageSize = 10;

  const navigate = useNavigate();

  // Lấy thông tin user và phân quyền
  const getUserRole = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      const user = JSON.parse(userStr);
      return (user.PhanQuyen || "").toLowerCase();
    } catch (e) {
      console.error("Error parsing user:", e);
      return null;
    }
  };

  const userRole = getUserRole();
  // Chỉ admin và quanly mới có quyền thêm/sửa/xem lịch sử
  const canModify = userRole === "admin" || userRole === "quanly";

  // Ví dụ load danh sách
  const fetchNCC = useCallback(async (currentPage = 1) => {
    setLoading(true); setError("");
    try {
      const res = await fetchWithAuth(`${API_BASE}?page=${currentPage}&limit=${pageSize}`);
      const data = await res.json();
      setItems(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      setError(e.message || "Không thể tải dữ liệu");
    } finally { setLoading(false); }
  }, [pageSize]);

  useEffect(() => {
    if (!isSearching) {
      fetchNCC(page);
    }
  }, [page, isSearching, fetchNCC]);

  // Tìm kiếm
  const handleSearch = async (e) => {
    e.preventDefault();
    const kw = searchText.trim();
    if (!kw) { setIsSearching(false); setPage(1); fetchNCC(1); return; }
    setLoading(true); setError(""); setIsSearching(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/search?keyword=${encodeURIComponent(kw)}&page=1&limit=${pageSize}`);
      const data = await res.json();
      setItems(data.data || []); setTotalPages(data.totalPages || 1); setPage(1);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (isSearching && searchText.trim()) {
      const search = async () => {
        setLoading(true);
        setError("");
        try {
          const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
          const url = `${API_BASE}/search?keyword=${encodeURIComponent(searchText.trim())}&page=${page}&limit=${pageSize}`;
          const res = await fetch(url, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          });
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

  const handleViewHistory = async (MaNCC) => {
    if (!canModify) {
      alert("Bạn không có quyền xem lịch sử cung cấp.");
      return;
    }
    setHistoryPage(1);
    await fetchHistory(MaNCC, 1);
  };

  const fetchHistory = async (MaNCC, currentPage = 1) => {
    setHistoryLoading(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      const url = `${API_BASE}/supplierhistory/${MaNCC}?page=${currentPage}&limit=${historyPageSize}`;
      
      console.log("Fetching history URL:", url);
      
      const res = await fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("History API error:", errorText);
        throw new Error(`Không thể tải lịch sử: ${errorText}`);
      }

      const data = await res.json();
      console.log("History data:", data);
      setHistoryData({
        MaNCC: MaNCC,
        items: data.data || [],
      });
      setHistoryTotalPages(data.totalPages || 1);
      setHistoryPage(currentPage);
    } catch (err) {
      console.error("fetchHistory error:", err);
      alert(`Lỗi: ${err.message}`);
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeHistory = () => {
    setHistoryData(null);
    setHistoryPage(1);
    setHistoryTotalPages(1);
  };

  const handleEditNavigate = (MaNCC) => {
    if (!canModify) {
      alert("Bạn không có quyền cập nhật nhà cung cấp.");
      return;
    }
    navigate(`/Admin/thongtinncc/${MaNCC}`);
  };

  const handleAddNew = () => {
    if (!canModify) {
      alert("Bạn không có quyền thêm nhà cung cấp.");
      return;
    }
    navigate("/Admin/thongtinncc");
  };

  const openDetail = async (item) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/detail/${item.MaNCC}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Detail error response:", errorText);
        throw new Error(`HTTP ${res.status}: ${errorText || "Không thể tải chi tiết"}`);
      }
      const data = await res.json();
      setDetailItem(data);
    } catch (err) {
      console.error("openDetail error:", err);
      alert(`Không thể tải chi tiết nhà cung cấp: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const closeDetail = () => setDetailItem(null);

  const startIdx = (page - 1) * pageSize;

  return (
    <div className="vattu-container">
      <div className="search-container">
        <form
          className="search-grid"
          onSubmit={handleSearch}
          style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            id="search_text"
            className="input-row"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Nhập mã hoặc tên nhà cung cấp..."
            style={{ width: "400px" }}
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
        <div
          className="error-msg"
          style={{
            color: "red",
            padding: "10px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <div className="body-section">
        {canModify && (
          <div className="add-item-button-wrapper">
            <button className="add-item-button" onClick={handleAddNew}>
              <span>+</span> Thêm nhà cung cấp
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
                <th>Mã nhà cung cấp</th>
                <th>Tên nhà cung cấp</th>
                <th>Địa chỉ</th>
                <th>Xem chi tiết</th>
                {canModify && <th>Cập nhật</th>}
                {canModify && <th>Lịch sử cung cấp</th>}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={canModify ? "7" : "5"}>Không có dữ liệu</td>
                </tr>
              ) : (
                items.map((it, idx) => (
                  <tr key={it.MaNCC}>
                    <td data-label="STT">{startIdx + idx + 1}</td>
                    <td data-label="Mã NCC">{it.MaNCC}</td>
                    <td data-label="Tên NCC">{it.TenNCC}</td>
                    <td data-label="Địa chỉ">{it.DiaChi || "N/A"}</td>
                    <td data-label="Xem chi tiết">
                      <button
                        className="btn-small"
                        onClick={() => openDetail(it)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                    {canModify && (
                      <td data-label="Cập nhật">
                        <button
                          className="btn-small"
                          onClick={() => handleEditNavigate(it.MaNCC)}
                        >
                          Sửa
                        </button>
                      </td>
                    )}
                    {canModify && (
                      <td data-label="Lịch sử cung cấp">
                        <button
                          className="btn-small"
                          onClick={() => handleViewHistory(it.MaNCC)}
                        >
                          Xem lịch sử
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

      {/* Modal chi tiết nhà cung cấp */}
      {detailItem && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết nhà cung cấp</h3>
              <button className="modal-close" onClick={closeDetail}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="label">Mã NCC:</span>
                <span className="value">{detailItem.MaNCC || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Tên NCC:</span>
                <span className="value">{detailItem.TenNCC || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Địa chỉ:</span>
                <span className="value">{detailItem.DiaChi || "Chưa có"}</span>
              </div>
              <div className="detail-row">
                <span className="label">SĐT:</span>
                <span className="value">{detailItem.SDT || "Chưa có"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{detailItem.Email || "Chưa có"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Người đại diện:</span>
                <span className="value">{detailItem.NguoiDaiDien || "Chưa có"}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={closeDetail}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal lịch sử cung cấp (style giống modal chi tiết) */}
      {historyData && (
        <div className="modal-overlay" onClick={closeHistory}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "640px", width: "92vw" }}
          >
            <div className="modal-header">
              <h3>Lịch sử cung cấp - Mã NCC: {historyData.MaNCC}</h3>
              <button className="modal-close" onClick={closeHistory}>×</button>
            </div>

            <div
              className="modal-body history-body"
              style={{ display: "block", maxHeight: "500px", overflowY: "auto" }}
            >
              {historyLoading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>Đang tải...</div>
              ) : historyData.items.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px" }}>Không có lịch sử cung cấp</div>
              ) : (
                <div className="history-list">
                  {historyData.items.map((item, idx) => (
                    <div className="history-item" key={`${item.MaPN}-${item.MaVT}-${idx}`}>
                      <div className="row"><span className="label">STT:</span><span className="value">{(historyPage - 1) * historyPageSize + idx + 1}</span></div>
                      <div className="row"><span className="label">Mã phiếu nhập:</span><span className="value">{item.MaPN}</span></div>
                      <div className="row"><span className="label">Ngày nhập:</span><span className="value">{item.NgayNhap}</span></div>
                      <div className="row"><span className="label">Mã vật tư:</span><span className="value">{item.MaVT}</span></div>
                      <div className="row"><span className="label">Tên vật tư:</span><span className="value">{item.TenVT}</span></div>
                      <div className="row"><span className="label">Số lượng:</span><span className="value">{item.SoLuong}</span></div>
                      <div className="row"><span className="label">Đơn giá:</span><span className="value">{Number(item.DonGia).toLocaleString("vi-VN")} đ</span></div>
                      <div className="row total"><span className="label">Thành tiền:</span><span className="value">{Number(item.ThanhTien).toLocaleString("vi-VN")} đ</span></div>
                      {item.GhiChu && <div className="row"><span className="label">Ghi chú:</span><span className="value">{item.GhiChu}</span></div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {historyData.items?.length > 0 && !historyLoading && (
              <div
                className="pagination history-pagination"
                style={{ display: "flex", justifyContent: "center", gap: "4px", padding: "10px 16px" }}
              >
                <button
                  className="page-btn"
                  disabled={historyPage === 1}
                  onClick={() => fetchHistory(historyData.MaNCC, historyPage - 1)}
                >
                  « Trước
                </button>
                {Array.from({ length: historyTotalPages }, (_, i) => i + 1).map((pn) => (
                  <button
                    key={pn}
                    className={`page-btn ${pn === historyPage ? "active" : ""}`}
                    onClick={() => fetchHistory(historyData.MaNCC, pn)}
                  >
                    {pn}
                  </button>
                ))}
                <button
                  className="page-btn"
                  disabled={historyPage === historyTotalPages}
                  onClick={() => fetchHistory(historyData.MaNCC, historyPage + 1)}
                >
                  Sau »
                </button>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn" onClick={closeHistory}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NCC;