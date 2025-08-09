import { useState } from "react";
import Preview from "./components/Preview";
import ProcessButton from "./components/Processing";
import Summary from "./components/Summary";
import TimeRange from "./components/TimeControll";
import Transcript from "./components/Transcript";
import Upload from "./components/Upload";
import Header from "./components/Header";

const App = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [processingStep, setProcessingStep] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setTranscript("");
    setSummary("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type.startsWith("audio/") ||
        droppedFile.type.startsWith("video/"))
    ) {
      handleFileUpload(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleStartTimeChange = (e) => {
    const value = parseInt(e.target.value);
    setStartTime(value);
    if (endTime > 0 && endTime <= value) {
      setError("End time should be greater than start time");
    } else {
      setError("");
    }
  };

  const handleEndTimeChange = (e) => {
    const value = parseInt(e.target.value);
    if (value <= 0 || value <= startTime) {
      setError("End time should be greater than start time");
    } else {
      setError("");
    }
    setEndTime(value);
  };

  const handleProcess = () => {
    if (!file) return;

    setIsProcessing(true);
    setTranscript("");
    setSummary("");

    const steps = [
      "Uploading file...",
      "Extracting audio...",
      "Processing speech recognition...",
      "Generating transcript...",
      "Creating summary...",
      "Finalizing results...",
    ];

    let currentStep = 0;
    const processInterval = setInterval(() => {
      if (currentStep < steps.length) {
        setProcessingStep(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(processInterval);
        setTranscript(
          "This is where your transcript will appear after processing. The AI will convert your audio/video content into accurate text with proper formatting and timestamps."
        );
        setSummary(
          "This section will contain an AI-generated summary of your content, highlighting key points, main topics, and important insights from your audio or video file."
        );
        setIsProcessing(false);
        setProcessingStep("");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <Header />
        <div className="flex w-full gap-6">
          {/* Left Column */}
          <div className="space-y-6 w-[40%]">
            <Upload
              file={file}
              onFileUpload={handleFileUpload}
              dragOver={dragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />

            <Preview file={file} />

            <TimeRange
              startTime={startTime}
              endTime={endTime}
              onStartTimeChange={handleStartTimeChange}
              onEndTimeChange={handleEndTimeChange}
              error={error}
            />

            <ProcessButton
              file={file}
              isProcessing={isProcessing}
              onProcess={handleProcess}
              processingStep={processingStep}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6 w-[60%]">
            <Transcript transcript={transcript} />
            <Summary summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
