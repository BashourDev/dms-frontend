import React from "react";

const AppButton = ({
  Icon,
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border-4 transition duration-100 w-full h-8 lg:h-11 mt-8 mb-1 bg-inherit text-primary hover:bg-primary hover:text-white text-xs lg:text-sm border-primary ${className}`}
    >
      {Icon && <Icon />}
      {children}
    </button>
  );
};

export default AppButton;
