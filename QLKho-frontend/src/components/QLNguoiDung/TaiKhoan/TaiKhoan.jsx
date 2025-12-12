import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../../../services/axiosConfig";
import "../../QuanLy.css";

const API_BASE = "http://localhost:4000/api/taikhoan";

function TaiKhoan() {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchTaiKhoan = useCallback(async (currentPage = 1) => {
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE}?page=${currentPage}&limit=${pageSize}`;
      const res = await fetchWithAuth(url);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText || "Không thể tải dữ liệu tài khoản"}`);
      }

      const data = await res.json();
      console.log("Tài khoản data:", data);
      
      setItems(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("fetchTaiKhoan error:", err);
      setError(err.message);
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    if (!isSearching) {
      fetchTaiKhoan(page);
    }
  }, [page, isSearching, fetchTaiKhoan]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const search = searchText.trim();

    if (!search) {
      setIsSearching(false);
      setPage(1);
      fetchTaiKhoan(1);
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

  const handleEditNavigate = (username) => {
    navigate(`/Admin/thongtintk/${username}`);
  };

  const getDisplayStatus = (status) => {
    if (status === "active") return "Hoạt động";
    if (status === "inactive") return "Không hoạt động";
    return status || "Hoạt động";
  };

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
            placeholder="Nhập tên đăng nhập..."
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
                <th>Tên đăng nhập</th>
                <th>Mã nhân viên</th>
                <th>Phân quyền</th>
                <th>Trạng thái</th>
                <th>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="6">Không có dữ liệu</td>
                </tr>
              ) : (
                items.map((it, idx) => (
                  <tr key={it.UserName}>
                    <td>{startIdx + idx + 1}</td>
                    <td>{it.UserName}</td>
                    <td>{it.MaNV}</td>
                    <td>{it.PhanQuyen}</td>
                    <td>
                      {getDisplayStatus(it.TrangThai)}
                    </td>
                    <td>
                      <button 
                        className="btn-small" 
                        onClick={() => handleEditNavigate(it.UserName)}
                      >
                        Sửa
                      </button>
                    </td>
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
    </div>
  );
}

export default TaiKhoan;