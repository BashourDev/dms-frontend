import React from "react";
import { useFormikContext } from "formik";
import Loading from "../../Loading";

const AppSubmitButton = ({
  Icon,
  children,
  className,
  type = "submit",
  isLoading,
  onCustomClick,
  ...otherProps
}) => {
  const { handleSubmit } = useFormikContext();
  // const { handleSubmit, errors, dirty } = useFormikContext();

  //   const handleClick = () => {
  //     if (!dirty || Object.keys(errors).length > 0) {
  //       handleSubmit();
  //     }
  //   };

  const handleClick = () => {
    handleSubmit();
    if (onCustomClick) {
      onCustomClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isLoading}
      className={`rounded-full outline-none transition duration-100 w-full h-11 mt-8 mb-1 bg-inherit text-primary hover:bg-primary hover:text-white border-primary disabled:text-lightGray disabled:hover:bg-lightGray disabled:hover:text-white disabled:border-lightGray text-sm lg:text-base border-4 ${className}`}
      {...otherProps}
    >
      {Icon && <Icon />}
      {isLoading ? <Loading className={"w-8 h-8"} /> : children}
    </button>
  );
};

export default AppSubmitButton;
