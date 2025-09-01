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
  if (!file) return <Icons.Upload className="w-3 h-3 mr-1" />;
  if (file.type.startsWith("video/")) return <Icons.Video className="w-3 h-3" />;
  if (file.type.startsWith("audio/")) return <Icons.Audio className="w-3 h-3" />;
  return <Icons.Mic className="w-3 h-3" />;
};

  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 border border-white/20 h-[90px] w-full">
      <h3 className="text-sm font-semibold mb-1 flex items-center">
        <svg
          className="w-4 h-4 mr-1"
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
        className={`border-2 border-dashed rounded-lg p-2 text-center transition-all duration-300 cursor-pointer h-[25px] flex flex-col justify-center ${
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
          onChange={(e) =>
            e.target.files[0] && onFileUpload(e.target.files[0])
          }
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-0.5">
          {getFileIcon()}
          <div>
            {file ? (
              <div>
                <p className="font-medium text-green-400 text-xs truncate max-w-[400px]">
                  {file.name}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium text-xs">Drop your file</p>
                <p className="text-[10px] text-gray-400">or click</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
