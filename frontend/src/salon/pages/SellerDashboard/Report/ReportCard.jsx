import React from "react";

const gradients = [
  "from-indigo-600 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-500",
];

let cardIndex = 0;

const ReportCard = ({ value, title, icon }) => {
  const gradient = gradients[cardIndex++ % gradients.length];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-md`}>
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-4 -right-10 w-32 h-32 rounded-full bg-white/10" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-white/70 text-xs font-medium uppercase tracking-wide mb-2">{title}</p>
          <p className="text-2xl font-bold text-white">{value ?? "—"}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;