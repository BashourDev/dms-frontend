import { useState } from "react";
import { Switch } from "@headlessui/react";
import { useFormikContext } from "formik";

export default function AppFormSwitch({ name, text }) {
  const { values, setFieldValue } = useFormikContext();

  return (
    <>
      <Switch
        as="button"
        id={name}
        checked={values[name]}
        onChange={(value) => setFieldValue(name, value)}
        className={`${values[name] ? "bg-primary" : "bg-lightGray"}
          relative inline-flex flex-shrink-0 h-[28px] w-[56px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${values[name] ? "-translate-x-7" : "translate-x-0"}
            pointer-events-none inline-block h-[24px] w-[24px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
        />
      </Switch>
      <span
        className={`${
          values[name] ? "text-primary" : "text-dark"
        } mx-2 pt-[2px] text-xs lg:text-sm`}
      >
        {text}
      </span>
    </>
  );
}
