import { confirm } from "react-confirm-box";
import AppButton from "./AppButton";

const options = {
  render: (message, onConfirm, onCancel) => {
    return (
      <div
        dir="rtl"
        className="space-y-4 bg-white p-5 rounded-lg border-[1px] border-mediumGray shadow-sm shadow-darkGray absolute"
      >
        <h1 className="text-dark font-medium text-lg"> {message} </h1>
        <div className="flex justify-end">
          <button
            className="transition duration-100 mx-2 bg-danger w-24 rounded-full text-white h-10 hover:bg-danger/90"
            onClick={onConfirm}
          >
            {" "}
            نعم{" "}
          </button>
          <button
            className="transition duration-100 mx-2 w-24 rounded-full text-dark h-10 hover:bg-lightGray/25"
            onClick={onCancel}
          >
            {" "}
            لا{" "}
          </button>
        </div>
      </div>
    );
  },
};

export const conf = async (message) => {
  const result = await confirm(message, options);
  return result;
};
