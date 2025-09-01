import Icons from "./Icons";
const Transcript = ({ transcript }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Icons.FileText />
          <span className="ml-2">Transcription</span>
        </h3>
        {transcript && (
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
        {transcript ? (
          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
            {transcript}
          </p>
        ) : (
          <p className="text-gray-500 italic">
            Transcription will appear here after processing...
          </p>
        )}
      </div>
    </div>
  );
};

export default Transcript;
