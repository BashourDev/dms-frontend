import { useFormikContext } from "formik";
import React from "react";

const AppFormCheckBox = ({ id, name, text, disabledValue, onClick }) => {
  const { handleChange, values } = useFormikContext();
  return (
    <label className="flex items-center mt-8 text-xs lg:text-sm">
      <input
        id={id}
        onClick={handleChange(name)}
        className=""
        name={name}
        type="checkbox"
        value={values[name] === null ? false : values[name][0]}
        disabled={disabledValue ? values[disabledValue] === false : false}
      />
      <span className="px-2">{text}</span>
    </label>
  );
};

export default AppFormCheckBox;
