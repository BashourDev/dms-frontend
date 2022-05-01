import React from "react";
import Lottie from "lottie-react";
import loadingAn from "../assets/lotties/loading-state.json";

const Loading = ({ className = "w-20 h-20 self-center" }) => {
  return (
    <div className="flex justify-center items-center self-center w-full">
      <Lottie animationData={loadingAn} loop className={className} />
    </div>
  );
};

export default Loading;
