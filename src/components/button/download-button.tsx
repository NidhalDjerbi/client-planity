import React from "react";
interface DownloadButtonProps {
  handleDownload: () => void;
}
function DownloadButton({ handleDownload }: DownloadButtonProps) {
  return (
    <button onClick={handleDownload} className="download-button animated">
      Download File
    </button>
  );
}

export default DownloadButton;
