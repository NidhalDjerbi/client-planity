import React from "react";
interface ProgressBarProps {
  uploadProgress: number;
}
function ProgressBar({ uploadProgress }: ProgressBarProps) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
      <span>{uploadProgress}%</span>
    </div>
  );
}

export default ProgressBar;
