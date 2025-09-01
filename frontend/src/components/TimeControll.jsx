import Icons from "./Icons";
const TimeRange = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  error,
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 h-[150px]">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Icons.Clock />
        <span className="ml-2">Time Range</span>
      </h3>

      <div className="flex justify-between gap-x-4 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Start Time (seconds)
          </label>
          <input
            type="number"
            value={startTime ?? ""}
            onChange={onStartTimeChange}
            className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0 (full duration)"
          />
        </div>

        <div className="relative">
          {error && (
            <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-3 py-1 rounded shadow-md z-10">
              {error}
            </div>
          )}
          <label className="block text-sm font-medium text-gray-300 mb-2">
            End Time (seconds)
          </label>
          <input
            type="number"
            value={endTime ?? ""}
            onChange={onEndTimeChange}
            className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0 (full duration)"
          />
        </div>

        {(startTime > 0 || endTime > 0) && (
          <div className="text-sm text-gray-400 text-center p-3 bg-black/20 rounded-lg">
            Duration: {formatTime(endTime - startTime)}
            {endTime === 0 && " (to end)"}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeRange;
