import { useState } from "react";

function Test() {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          width: "420px",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-block",
            background: "#22c55e",
            color: "white",
            padding: "6px 14px",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "20px",
          }}
        >
          CI/CD DEPLOY SUCCESS
        </div>

        <h1 style={{ marginBottom: "10px", color: "#1f2933" }}>
          🚀 React + Vercel
        </h1>

        <p style={{ color: "#4b5563", marginBottom: "30px" }}>
          <h1> Chiều thứ hai - ca 3</h1>
        </p>

        {/* Counter Card */}
        <div
          style={{
            background: "#f1f5f9",
            borderRadius: "16px",
            padding: "25px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "28px", marginBottom: "15px" }}>
            🔢 Counter: {count}
          </h2>

          <button
            onClick={() => setCount(count + 1)}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background: "#4f46e5",
              color: "white",
              fontWeight: "600",
            }}
          >
            ➕ Tăng giá trị
          </button>
        </div>

        <p style={{ fontSize: "13px", color: "#6b7280" }}>
          🕒 Build time: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default Test;
