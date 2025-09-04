import { useState, useEffect } from "react";

function App() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchImage = async () => {
    try {
      setLoading(true);
      setError("");

      // Add cache-busting parameter to get a new image each time
      const timestamp = Date.now();
      const response = await fetch(
        `https://myproxy1.netlify.app/.netlify/functions/zenquotes-proxy?t=${timestamp}`
      );

      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();

      // Revoke previous URL to avoid memory leaks
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }

      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `inspirational-quote-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    fetchImage();

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, []);

  return (
    <div
      className="container"
      style={{
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f7fa",
      }}
    >
      <h1
        style={{ textAlign: "center", color: "#2c3e50", marginBottom: "30px" }}
      >
        Inspirational Quotes
      </h1>

      <div
        className="qimage-div"
        style={{
          display: "flex",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "400px",
              backgroundColor: "#ecf0f1",
              borderRadius: "8px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  border: "5px solid #3498db",
                  borderTop: "5px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 20px",
                }}
              ></div>
              <p style={{ color: "#7f8c8d", fontSize: "18px" }}>
                Loading inspirational quote...
              </p>
            </div>
          </div>
        ) : error ? (
          <div
            style={{
              padding: "20px",
              color: "#e74c3c",
              backgroundColor: "#fadbd8",
              borderRadius: "8px",
              textAlign: "center",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Error: {error}
          </div>
        ) : (
          <img
            className="qimage"
            src={imageUrl}
            alt="Inspirational quote"
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              border: "3px solid #bdc3c7",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
            onError={() => setError("Image failed to load")}
          />
        )}
      </div>

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={fetchImage}
          disabled={loading}
          style={{
            padding: "12px 25px",
            backgroundColor: loading ? "#95a5a6" : "#3498db",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
          onMouseOver={(e) => {
            if (!loading) e.target.style.backgroundColor = "#2980b9";
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.backgroundColor = "#3498db";
          }}
        >
          {loading ? "Loading..." : "New Quote"}
        </button>
        <button
          onClick={downloadImage}
          disabled={!imageUrl || loading}
          style={{
            padding: "12px 25px",
            backgroundColor: !imageUrl || loading ? "#95a5a6" : "#f39c12",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: !imageUrl || loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
          onMouseOver={(e) => {
            if (imageUrl && !loading)
              e.target.style.backgroundColor = "#e67e22";
          }}
          onMouseOut={(e) => {
            if (imageUrl && !loading)
              e.target.style.backgroundColor = "#f39c12";
          }}
        >
          Download Image
        </button>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default App;
