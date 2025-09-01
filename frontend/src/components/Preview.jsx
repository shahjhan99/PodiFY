import Icons from "./Icons";
const Preview = ({ file }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        {file && file.type.startsWith("video/") ? (
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
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        ) : (
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
              d="M5.586 15H4a1 1 0 01-1-1v-4a8 8 0 1116 0v4a1 1 0 01-1 1h-1.586l-1.707 1.707A1 1 0 0115 17v-2.586A2 2 0 0113.414 13H19V9a8 8 0 10-16 0v4z"
            />
          </svg>
        )}
        Media Preview
      </h3>

      <div className="bg-black/30 rounded-xl p-4 flex items-center justify-center h-[200px]">
        {file ? (
          <div className="w-full h-full flex items-center justify-center">
            {file.type.startsWith("video/") ? (
              <video
                src={URL.createObjectURL(file)}
                controls
                className="max-w-full max-h-full rounded-lg"
                preload="metadata"
              />
            ) : file.type.startsWith("audio/") ? (
              <div className="w-full text-center">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 text-blue-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.586 15H4a1 1 0 01-1-1v-4a8 8 0 1116 0v4a1 1 0 01-1 1h-1.586l-1.707 1.707A1 1 0 0115 17v-2.586A2 2 0 0113.414 13H19V9a8 8 0 10-16 0v4z"
                    />
                  </svg>
                  <p className="text-sm text-gray-300 mb-4">{file.name}</p>
                </div>
                <audio
                  src={URL.createObjectURL(file)}
                  controls
                  className="w-full max-w-sm"
                  preload="metadata"
                />
              </div>
            ) : (
              <div className="text-center">
                <Icons.Mic />
                <p className="text-sm text-gray-300">{file.name}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <div className="mb-4">
              <Icons.Upload />
            </div>
            <p>Media preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
