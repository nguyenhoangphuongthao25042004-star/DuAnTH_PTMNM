import './App.css'
import HomePage from './components/home/HomePage.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from './components/Admin/Admin.jsx'
import VatTu from './components/QLVatTu/VatTu.jsx'
import ThongTinVatTu from './components/QLVatTu/ThongTinVatTu.jsx'
import NCC from './components/QLNhaCungCap/NCC.jsx'
import NV from "./components/QLNguoiDung/NhanVien/NV.jsx";
import ThongTinNV from "./components/QLNguoiDung/NhanVien/ThongTinNV";
import QuanLy from './components/QuanLy/QuanLy.jsx'
import ThuKho from './components/ThuKho/ThuKho.jsx'
import ThongTinNCC from "./components/QLNhaCungCap/ThongTinNCC";
import TaiKhoan from "./components/QLNguoiDung/TaiKhoan/TaiKhoan";
import ThongTinTK from "./components/QLNguoiDung/TaiKhoan/ThongTinTK.jsx";
import NhanVien from './components/NhanVien/NhanVien.jsx';
import ResetPass from './components/Header/ResetPass.jsx';
import ForgotPass from "./components/home/ForgotPass.jsx";
import ResetForgotPass from "./components/home/ResetForgotPass";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="Admin" element={<Admin />}>
          <Route index element={<VatTu />} />
          <Route path="vattu" element={<VatTu />} />
          <Route path="thongtinvattu" element={<ThongTinVatTu />} />
          <Route path="thongtinvattu/:id" element={<ThongTinVatTu />} />
          <Route path="ncc" element={<NCC />} />
          <Route path="thongtinncc" element={<ThongTinNCC />} />
          <Route path="thongtinncc/:id" element={<ThongTinNCC />} />
          <Route path="taikhoan" element={<TaiKhoan />} />
          <Route path="thongtintk/:username" element={<ThongTinTK />} />
          <Route path="nhanvien" element={<NV />} />
          <Route path="thongtinnv" element={<ThongTinNV />} />
          <Route path="thongtinnv/:id" element={<ThongTinNV />} />
          <Route path="resetpass" element={<ResetPass />} />
        </Route>
        <Route path="NhanVien" element={<NhanVien />}>
          <Route index element={<VatTu />} />
          <Route path="vattu" element={<VatTu />} />
          <Route path="thongtinvattu" element={<ThongTinVatTu />} />
          <Route path="thongtinvattu/:id" element={<ThongTinVatTu />} />
          <Route path="ncc" element={<NCC />} />
          <Route path="thongtinncc" element={<ThongTinNCC />} />
          <Route path="thongtinncc/:id" element={<ThongTinNCC />} />
          <Route path="resetpass" element={<ResetPass />} />
        </Route>
        <Route path="QuanLy" element={<QuanLy />}>
          <Route index element={<VatTu />} />
          <Route path="vattu" element={<VatTu />} />
          <Route path="thongtinvattu" element={<ThongTinVatTu />} />
          <Route path="thongtinvattu/:id" element={<ThongTinVatTu />} />
          <Route path="ncc" element={<NCC />} />
          <Route path="thongtinncc" element={<ThongTinNCC />} />
          <Route path="thongtinncc/:id" element={<ThongTinNCC />} />
          <Route path="nhanvien" element={<NV />} />
          <Route path="thongtinnv" element={<ThongTinNV />} />
          <Route path="thongtinnv/:id" element={<ThongTinNV />} />
          <Route path="resetpass" element={<ResetPass />} />
        </Route>
        <Route path="ThuKho" element={<ThuKho />}>
          <Route index element={<VatTu />} />
          <Route path="vattu" element={<VatTu />} />
          <Route path="thongtinvattu" element={<ThongTinVatTu />} />
          <Route path="thongtinvattu/:id" element={<ThongTinVatTu />} />
          <Route path="resetpass" element={<ResetPass />} />
        </Route>
        <Route path="/forgotpass" element={<ForgotPass />} />
        <Route path="/resetpassword" element={<ResetForgotPass />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
