import React from "react";
import { FaFile } from "react-icons/fa";

const AppFileInput = ({
  id,
  label,
  onChange,
  containerClassName,
  selectedFile,
}) => {
  return (
    <div
      className={`flex w-full h-32 items-center  bg-grey-lighter space-x-5 ${containerClassName}`}
    >
      <label className="w-64 flex justify-center items-center p-4 bg-white text-primaryDark rounded-lg shadow-sm tracking-wide uppercase border border-primary text-dark cursor-pointer hover:bg-primary hover:text-white">
        <svg
          className="w-8 h-8 mx-2"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
        </svg>
        <span className="mt-2 text-sm leading-normal">{label}</span>
        <input
          id={id}
          type="file"
          className="hidden"
          multiple
          onChange={onChange}
        />
      </label>
      <div className="w-24 flex flex-col justify-center items-center px-4">
        {selectedFile && <FaFile className="text-5xl text-dark self-start" />}
        <p className="text-xs text-dark">
          {selectedFile ? selectedFile?.name : "لا يوجد ملف محدد"}
        </p>
      </div>
    </div>
  );
};

export default AppFileInput;
