import Icons from "./Icons";
const Summary = ({ summary }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
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
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
          AI Summary
        </h3>
        {summary && (
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Icons.Download />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Icons.Share />
            </button>
          </div>
        )}
      </div>

      <div className="bg-black/30 rounded-xl p-4 h-[320px] overflow-y-auto">
        {summary ? (
          <p className="text-gray-200 leading-relaxed">{summary}</p>
        ) : (
          <p className="text-gray-500 italic">
            AI-generated summary will appear here after processing...
          </p>
        )}
      </div>
    </div>
  );
};

export default Summary;
