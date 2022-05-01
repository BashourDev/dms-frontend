import { useFormikContext } from "formik";
import React from "react";

const AppFormRadioButton = ({ id, name, value, text, checked = false }) => {
  const { handleChange, values } = useFormikContext();

  const isChecked = () => {
    if (typeof value === "string") {
      return value === `${values[name]}`;
    }
  };

  return (
    <>
      <label>
        <input
          id={id}
          name={name}
          type="radio"
          className="sr-only peer"
          value={value}
          onChange={handleChange(name)}
          checked={isChecked()}
        />
        <div className="transition duration-300 px-4 h-7 lg:h-9 text-xs lg:text-sm cursor-pointer rounded-full flex items-center justify-center text-dark peer-checked:bg-primary peer-checked:text-white">
          {text}
        </div>
      </label>
      {/* <input
        id={id}
        name={name}
        type="radio"
        value={value}
        onChange={handleChange(name)}
        checked={value === values.model}
        className=" form-check-input appearance-none rounded-full h-4 w-4 border-4 border-gray-300 bg-white checked:bg-white checked:border-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain"
      />
      <label
        className="form-check-label inline-block text-dark pr-5 pl-1"
        htmlFor={id}
      >
        {text}
      </label> */}
    </>
  );
};

export default AppFormRadioButton;
