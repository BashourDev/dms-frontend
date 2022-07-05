import React from "react";
import Loading from "./Loading";

const AppButton = ({
  Icon,
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  isLoading = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`rounded-full border-4 transition duration-100 w-full h-11 mt-8 mb-1 bg-inherit text-primary hover:bg-primary hover:text-white text-xs lg:text-sm border-primary ${className}`}
    >
      {isLoading ? (
        <Loading className="w-8 h-8" />
      ) : (
        <>
          {Icon && <Icon />}
          {children}
        </>
      )}
    </button>
  );
};

export default AppButton;
