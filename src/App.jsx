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

  // if (loading)
  //   return (
  //     <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
  //   );
  // if (error)
  //   return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;

  return (
    <div className="container">
      {/* Show loading or error messages inside the container, not instead of it */}
      {loading && (
        <div style={{ padding: "20px", textAlign: "center", color: "blue" }}>
          Loading...
        </div>
      )}
      {error && (
        <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>
      )}
      <div className="qimage-div">
        <img
          className="qimage"
          src={imageUrl}
          alt="Inspirational quote"
          style={{
            border: "2px solid #ccc",
            textAlign: "center",
          }}
          onError={() => setError("Image failed to load")}
        />
      </div>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <button
          onClick={fetchImage}
          style={{
            padding: "10px 20px",
            backgroundColor: "green",
            color: "white",
            border: "1px solid black",
            cursor: "pointer",
          }}
        >
          New Quote
        </button>
        <button
          onClick={downloadImage}
          disabled={!imageUrl}
          style={{
            padding: "10px 20px",
            //backgroundColor: imageUrl ? "#28a745" : "#6c757d",
            backgroundColor: "yellow",
            color: "black",
            border: "1px solid black",
            cursor: imageUrl ? "pointer" : "not-allowed",
          }}
        >
          Download Image
        </button>
      </div>
    </div>
  );
}

export default App;
