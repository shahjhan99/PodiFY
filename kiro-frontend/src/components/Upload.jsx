import { useRef } from "react";
import Icons from "./Icons";
const Upload = ({
  file,
  onFileUpload,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  const fileInputRef = useRef(null);

  const getFileIcon = () => {
    if (!file) return <Icons.Upload />;
    if (file.type.startsWith("video/")) return <Icons.Video />;
    if (file.type.startsWith("audio/")) return <Icons.Audio />;
    return <Icons.Mic />;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 h-[250px]">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        Upload Media
      </h3>

      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer h-[160px] flex flex-col justify-center ${
          dragOver
            ? "border-blue-400 bg-blue-400/10"
            : file
            ? "border-green-400 bg-green-400/10"
            : "border-gray-600 hover:border-gray-400"
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="audio/*,video/*"
          onChange={(e) => e.target.files[0] && onFileUpload(e.target.files[0])}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-3">
          {getFileIcon()}
          <div>
            {file ? (
              <div>
                <p className="font-medium text-green-400">{file.name}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium">Drop your file here</p>
                <p className="text-sm text-gray-400 mt-1">or click to browse</p>
                <p className="text-xs text-gray-500 mt-2">
                  Supports MP3, WAV, MP4, MOV, etc.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
