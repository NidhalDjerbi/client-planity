import "./styles.css";
import { useState } from "react";
import axios from "axios";
import DownloadButton from "../button/download-button";
import ProgressBar from "../progress/progress-bar";

export default function File() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file.type === "text/csv") {
      setSelectedFile(file);
      setSelectedName(file.name);
      setError(null);
      setUploadProgress(0);
      setIsUploading(false);
      startUpload(file);
      setDownloadUrl(null);
    } else {
      setSelectedFile(null);
      setSelectedName("");
      setError("Please select a CSV file to upload.");
    }
  };

  const startUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/file/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (data) => {
            setUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
          responseType: "blob",
        }
      );

      setDownloadUrl(URL.createObjectURL(response.data));
      setIsUploading(false);
      setSelectedFile(null);
      setSelectedName("");
    } catch (error) {
      setError("An error occurred while uploading the file. Please try again.");
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "separated_files.zip"; // Set the desired file name
      link.click();
      // clear all the states
      setDownloadUrl(null);
      setSelectedFile(null);
      setUploadProgress(0);
      setIsUploading(false);
      setSelectedName("");
      setSuccessMessage("File uploaded and ZIP generated successfully!");
    }
  };

  return (
    <div className="app">
      {error && <div className="error-popup">{error}</div>}
      {successMessage && <div className="success-popup">{successMessage}</div>}
      <div className="parent">
        <div className="file-upload">
          <img src="./uploadImage.png" alt="upload" />
          <h3>{selectedName || "Choose your file"}</h3>
          {!selectedName && <p>Please Select a CSV File</p>}

          <input
            accept=".csv"
            type="file"
            onChange={handleFileChange}
            disabled={isUploading}
          />

          {isUploading && uploadProgress < 100 && (
            <ProgressBar uploadProgress={uploadProgress} />
          )}
          {uploadProgress === 100 && !downloadUrl && (
            <span className="blinking-text">Processing...</span>
          )}
        </div>
        {/* Show the download button with animation when processing is complete */}
        {uploadProgress === 100 && downloadUrl && (
          <DownloadButton handleDownload={handleDownload} />
        )}
      </div>
    </div>
  );
}
