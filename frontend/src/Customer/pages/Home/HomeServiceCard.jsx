import React from "react";

const HomeServiceCard = ({ item }) => {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl p-4 bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50 transition-all duration-200 cursor-pointer group w-[100px]">
      <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all">
        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" src={item.image} alt={item.name} />
      </div>
      <h1 className="text-center text-xs font-medium text-slate-700 group-hover:text-indigo-600 transition-colors leading-tight">{item.name}</h1>
    </div>
  );
};

export default HomeServiceCard;