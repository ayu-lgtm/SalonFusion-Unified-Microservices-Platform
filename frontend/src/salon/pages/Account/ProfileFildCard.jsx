import React from "react";

const ProfileFildCard = ({ value, keys }) => {
  return (
    <div className="flex items-center gap-5 px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0">
      <p className="w-36 text-xs font-semibold text-slate-400 uppercase tracking-wide flex-shrink-0">{keys}</p>
      <div className="w-px h-5 bg-slate-200 flex-shrink-0" />
      <p className="text-slate-800 font-medium text-sm">{value || "—"}</p>
    </div>
  );
};

export default ProfileFildCard;