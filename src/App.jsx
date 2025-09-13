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

  const shareToWhatsApp = () => {
    if (!imageUrl) return;

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `inspirational-quote-${Date.now()}.jpg`;
    document.body.appendChild(a);

    // After a small delay, try to share via WhatsApp
    setTimeout(() => {
      try {
        // Create a Blob from the image URL
        fetch(imageUrl)
          .then((response) => response.blob())
          .then((blob) => {
            // Create a file from the blob
            const file = new File([blob], "inspirational-quote.jpg", {
              type: "image/jpeg",
            });

            // Check if the Web Share API is available
            if (navigator.share && navigator.canShare({ files: [file] })) {
              navigator
                .share({
                  files: [file],
                  title: "Inspirational Quote",
                  text: "Check out this inspirational quote!",
                })
                .catch((err) => {
                  console.error("Error sharing:", err);
                  // Fallback to WhatsApp URL scheme
                  window.open(
                    `whatsapp://send?text=Check out this inspirational quote! ${window.location.href}`,
                    "_blank"
                  );
                });
            } else {
              // Fallback to WhatsApp URL scheme
              window.open(
                `whatsapp://send?text=Check out this inspirational quote! ${window.location.href}`,
                "_blank"
              );
            }
          })
          .catch((err) => {
            console.error("Error creating share file:", err);
            // Final fallback
            window.open(
              `whatsapp://send?text=Check out this inspirational quote! ${window.location.href}`,
              "_blank"
            );
          });
      } catch (err) {
        console.error("Error sharing to WhatsApp:", err);
        // Final fallback
        window.open(
          `whatsapp://send?text=Check out this inspirational quote! ${window.location.href}`,
          "_blank"
        );
      }
    }, 100);

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "20px",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundColor: "black",
        color: "#333",
      }}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          boxShadow:  "0 0 15px rgba(255, 255, 255, 0.9)",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
        }}
      >
        <h1
          style={{
            margin: "0 0 30px 0",
            fontSize: "35px",
            fontWeight: "700",
            textAlign: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Inspirational Quotes
        </h1>

        {/* Show loading or error messages inside the container, not instead of it */}
        {loading && (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#667eea",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "3px solid rgba(102, 126, 234, 0.3)",
                borderTop: "3px solid #667eea",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "20px",
              }}
            ></div>
            <p style={{ fontSize: "1.2rem", margin: 0 }}>
              Loading your inspiration...
            </p>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "20px",
              color: "#e74c3c",
              backgroundColor: "#ffeded",
              borderRadius: "10px",
              margin: "20px 0",
              border: "1px solid #ffcccb",
            }}
          >
            Error: {error}
          </div>
        )}

        <div
          className="qimage-div"
          style={{
            margin: "20px 0",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!loading && !error && imageUrl && (
            <img
              className="qimage"
              src={imageUrl}
              alt="Inspirational quote"
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                borderRadius: "8px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                border: "none",
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
              padding: "14px 28px",
              backgroundColor: loading ? "#b8b8b8" : "#667eea",
              color: "white",
              border: "none",
              borderRadius: "50px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "1rem",

              transition: "all 0.3s ease",
              boxShadow: loading
                ? "none"
                : "0 4px 15px rgba(102, 126, 234, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 6px 20px rgba(102, 126, 234, 0.5)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow =
                  "0 4px 15px rgba(102, 126, 234, 0.4)";
              }
            }}
          >
            {loading ? (
              <>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>New Quote</span>
                
              </>
            )}
          </button>

          <button
            onClick={downloadImage}
            disabled={!imageUrl || loading}
            style={{
              padding: "14px 28px",
              backgroundColor: !imageUrl || loading ? "#b8b8b8" : "#f39c12",
              color: "black",
              border: "none",
              borderRadius: "50px",
              cursor: !imageUrl || loading ? "not-allowed" : "pointer",
              fontSize: "1rem",

              transition: "all 0.3s ease",
              boxShadow:
                !imageUrl || loading
                  ? "none"
                  : "0 4px 15px rgba(243, 156, 18, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseOver={(e) => {
              if (imageUrl && !loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(243, 156, 18, 0.5)";
              }
            }}
            onMouseOut={(e) => {
              if (imageUrl && !loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(243, 156, 18, 0.4)";
              }
            }}
          >
            <span>Download Image</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 16L12 4M12 16L8 12M12 16L16 12"
                stroke={!imageUrl || loading ? "#888" : "black"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 20H20"
                stroke={!imageUrl || loading ? "#888" : "black"}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            onClick={shareToWhatsApp}
            disabled={!imageUrl || loading}
            style={{
              padding: "14px 28px",
              backgroundColor: !imageUrl || loading ? "#b8b8b8" : "#25D366",
              color: "white",
              border: "none",
              borderRadius: "50px",
              cursor: !imageUrl || loading ? "not-allowed" : "pointer",
              fontSize: "1rem",

              transition: "all 0.3s ease",
              boxShadow:
                !imageUrl || loading
                  ? "none"
                  : "0 4px 15px rgba(37, 211, 102, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseOver={(e) => {
              if (imageUrl && !loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(37, 211, 102, 0.5)";
              }
            }}
            onMouseOut={(e) => {
              if (imageUrl && !loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(37, 211, 102, 0.4)";
              }
            }}
          >
            <span>Share on WhatsApp</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488"
                fill={!imageUrl || loading ? "#888" : "white"}
              />
            </svg>
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          body {
      margin: 0;
      overflow: hidden; /* Prevent scrolling */
    }
    
    html, body, #root {
      height: 100%;
    }
        `}
      </style>
    </div>
  );
}

export default App;
