import { useState } from "react";

function Test() {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <h1>🚀 CI/CD TEST – React + Vercel</h1>

      <p style={{ fontSize: "18px" }}>
        Nếu bạn thấy trang này thay đổi sau khi push code → CI/CD hoạt động ✅
      </p>

      <h2>Counter: {count}</h2>

      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        ➕ Tăng
      </button>

      <p style={{ marginTop: "30px", opacity: 0.7 }}>
        Build time: {new Date().toLocaleString()}
      </p>
    </div>
  );
}

export default Test;
