import React from "react";

const SearchInput = ({
  placeholder,
  onChange,
  Icon,
  className,
  onKeyPress,
}) => {
  return (
    <div
      className={`flex h-7 lg:h-8 items-center space-x-1 text-dark text-xs lg:text-sm  border-b-2 border-darkGray/20 focus-within:border-primary transition duration-300 ${className}`}
    >
      <input
        type="text"
        className="h-10 outline-none w-full bg-inherit"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => onKeyPress(e)}
      />
      {Icon && <Icon className="w-6 h-6 " />}
    </div>
  );
};

export default SearchInput;
