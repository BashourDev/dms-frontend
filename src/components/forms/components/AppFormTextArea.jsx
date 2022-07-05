import React from "react";
import { useFormikContext } from "formik";

const AppFormTextArea = ({
  id,
  label,
  placeholder,
  Icon,
  className,
  containerClassName,
}) => {
  const { setFieldTouched, handleChange, errors, touched, values } =
    useFormikContext();
  return (
    <div className={`mt-5 ${containerClassName}`}>
      <label
        htmlFor={id}
        className="focus:text-primary text-dark text-sm lg:text-base mb-1 ml-1 focus-within:text-primary"
      >
        {label}
      </label>
      <div
        className={`w-full test-sm lg:text-base h-20 border-[1px] border-lightGray rounded-lg flex text-dark focus-within:border-primary ${className} ${
          touched[id] && errors[id] && "border-danger"
        }`}
      >
        <div className="pl-2 pt-1">{Icon && <Icon />}</div>
        <textarea
          id={id}
          name={id}
          placeholder={placeholder}
          value={values[id]}
          onChange={handleChange(id)}
          onBlur={(e) => setFieldTouched(id)}
          className="border-0 outline-none px-2 w-full bg-inherit resize-none text-sm lg:text-base focus:ring-0"
        />
      </div>
      {touched[id] && errors[id] && (
        <p className="text-danger mt-1">{errors[id]}</p>
      )}
    </div>
  );
};

export default AppFormTextArea;
