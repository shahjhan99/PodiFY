import React from "react";
import { Volume2 } from "lucide-react";

const Header = () => {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Podify Transcription
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Transform your audio and video content into accurate transcripts and
          intelligent summaries with AI-powered processing
        </p>
      </div>
    </>
  );
};

export default Header;
