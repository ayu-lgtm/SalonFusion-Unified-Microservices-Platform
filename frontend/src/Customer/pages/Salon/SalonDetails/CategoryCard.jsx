import React from "react";

const CategoryCard = ({ handleSelectCategory, item, selectedCategory }) => {
  const isSelected = selectedCategory === item.id;
  return (
    <div
      onClick={handleSelectCategory(item.id)}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <img
        className="w-10 h-10 object-cover rounded-xl flex-shrink-0"
        src={item.image}
        alt={item.name}
      />
      <h1 className={`text-sm font-medium ${isSelected ? "text-white" : "text-slate-700"}`}>{item.name}</h1>
    </div>
  );
};

export default CategoryCard;