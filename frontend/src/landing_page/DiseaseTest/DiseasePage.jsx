import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// --- SVG Icon Components ---
const UploadCloudIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);
const FileIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);
const XIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const CheckCircleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
const CameraIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>;

const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Camera access denied:", err);
          alert("Camera access was denied. Please allow camera permissions in your browser settings.");
          onClose();
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, [isOpen, onClose]);

  const handleCapture = () => {
    const canvas = document.createElement('canvas');
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      canvas.toBlob(blob => {
        const capturedFile = new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
        onCapture(capturedFile);
      }, 'image/png');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
        <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg mb-4"></video>
        <div className="flex justify-center gap-4">
          <button onClick={handleCapture} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg">Capture</button>
          <button onClick={onClose} className="px-6 py-2 bg-slate-200 text-slate-800 font-bold rounded-lg">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const DiseasePage = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // 'idle', 'uploading', 'success'
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setStatus("idle");
    } else {
      // Optional: show an error message for non-image files
      alert("Please select an image file.");
    }
  };

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8080/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();

      const imagePreview = URL.createObjectURL(file);

      // Navigate to result page with data
      navigate(`/farm/${params.id}/disease-testing/result`, { state: { ...result, image: imagePreview } });

    } catch (error) {
      console.error("Error uploading file:", error);
      alert("There was an error uploading the file. Please try again.");
      setStatus("idle");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setStatus("idle");
  };

  const handleCapture = (capturedFile) => {
    handleFileChange(capturedFile);
    setIsCameraOpen(false);
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + ["Bytes", "KB", "MB", "GB"][i];
  };

  return (
    <>
      <CameraModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleCapture} />
      <div className="bg-slate-100 font-sans flex items-center justify-center min-h-[90vh] p-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <header className="text-center">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Disease Detection</h1>
            <p className="mt-2 text-slate-500">Upload or capture an image of the affected crop.</p>
          </header>

          {!file ? (
            <div
              onDragEnter={handleDragEnter} onDragOver={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors duration-300 ${isDragging ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-slate-50"}`}
            >
              <div className="flex flex-col items-center text-slate-500">
                <UploadCloudIcon className="w-16 h-16 mb-4" />
                <p className="font-bold text-slate-700">Drag & drop your image here</p>
                <p className="text-sm my-2">or</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <label htmlFor="file-upload" className="cursor-pointer font-semibold text-indigo-600 bg-indigo-100 hover:bg-indigo-200 px-4 py-2 rounded-lg transition-colors">
                        Browse Files
                    </label>
                    <button onClick={() => setIsCameraOpen(true)} className="flex items-center justify-center gap-2 cursor-pointer font-semibold text-slate-600 bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-lg transition-colors">
                        <CameraIcon className="w-5 h-5"/>
                        Use Camera
                    </button>
                </div>
                <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e.target.files[0])} />
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white border-2 border-slate-200 rounded-xl p-4 flex items-center space-x-4">
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                  <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                </div>
                <button onClick={() => setFile(null)} className="flex-shrink-0 p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleUpload}
                  disabled={status === "uploading"}
                  className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300"
                >
                  {status === "uploading" ? "Analyzing..." : "Analyze Image"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DiseasePage;
