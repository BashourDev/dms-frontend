import React from "react";
import { useFormikContext } from "formik";

const AppFormInput = ({
  id,
  label,
  type = "text",
  placeholder,
  Icon,
  className,
  containerClassName,
  disabledValue,
}) => {
  const { setFieldTouched, handleChange, errors, touched, values } =
    useFormikContext();

  const isDisabled = () => {
    if (disabledValue) {
      if (typeof values[disabledValue] === "boolean") {
        return values[disabledValue] === false;
      } else if (typeof values[disabledValue] === "number") {
        return values[disabledValue] === 0;
      }
    } else {
      return false;
    }
  };

  return (
    <div className={`flex flex-col ${containerClassName}`}>
      <label
        htmlFor={id}
        className="text-dark text-xs lg:text-sm focus:text-primary mt-5 mb-1 mx-1 focus-within:text-primary"
      >
        {label}
      </label>
      <div
        className={`w-full h-11 border-[1px] border-lightGray transition duration-150 rounded-lg flex items-center text-dark focus-within:border-primary ${className} ${
          touched[id] && errors[id] && "border-danger"
        }`}
      >
        <div className="px-2">{Icon && <Icon />}</div>
        <input
          id={id}
          name={id}
          type={type}
          value={values[id] === null ? "" : values[id]}
          placeholder={placeholder}
          onChange={handleChange(id)}
          onBlur={(e) => setFieldTouched(id)}
          className="border-0 outline-none px-2 w-full bg-inherit text-xs lg:text-sm"
          disabled={isDisabled()}
        />
      </div>
      {touched[id] && errors[id] && (
        <p className="text-danger mt-1 text-xs lg:text-sm">{errors[id]}</p>
      )}
    </div>
  );
};

export default AppFormInput;
