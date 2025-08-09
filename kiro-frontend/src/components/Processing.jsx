const ProcessButton = ({ file, isProcessing, onProcess, processingStep }) => {
  return (
    <div className="space-y-4">
      <button
        onClick={onProcess}
        disabled={!file || isProcessing}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
          !file || isProcessing
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02]"
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Processing...
          </div>
        ) : (
          "Start Processing"
        )}
      </button>

      {isProcessing && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4">Processing Status</h3>
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
            <span className="text-blue-400 font-medium">{processingStep}</span>
          </div>
          <div className="mt-4 bg-black/30 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300 animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessButton;
