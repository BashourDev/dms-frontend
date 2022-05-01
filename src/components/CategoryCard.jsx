import React from "react";
import { MdDelete } from "react-icons/md";

const CategoryCard = ({ name = "", productsCount = 0 }) => {
  return (
    <div className="flex justify-between items-center p-2 mt-2 ring-1 ring-lightGray/50 rounded-md shadow-md shadow-lightGray">
      <div>
        <h3 className="text-lg text-dark">{name}</h3>
        <h5 className="text-lightDark">{productsCount} products</h5>
      </div>
      <MdDelete className="text-danger text-xl lg:text-2xl cursor-pointer" />
    </div>
  );
};

export default CategoryCard;
