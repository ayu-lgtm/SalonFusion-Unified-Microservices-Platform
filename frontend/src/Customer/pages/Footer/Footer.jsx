import React from "react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand */}
          <div className="col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">SF</span>
              </div>
              <span className="text-white font-semibold text-lg">SalonFusion</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your one-stop destination for premium salon services. Book appointments with ease and experience luxury at your fingertips.
            </p>
            <div className="flex gap-3">
              {["facebook", "twitter", "instagram", "linkedin"].map((s) => (
                <a key={s} href="/" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors">
                  <span className="sr-only">{s}</span>
                  <span className="text-slate-400 hover:text-white text-xs capitalize">{s[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[["Home", "/"], ["Services", "/"], ["Book Appointment", "/"], ["About Us", "/"], ["Contact", "/"]].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-3 text-sm">
              {["Hair Cut", "Facial Treatment", "Manicure", "Pedicure", "Massage Therapy"].map((s) => (
                <li key={s}><a href="/" className="hover:text-white transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="material-icons text-indigo-400 text-base mt-0.5">phone</span>
                +1 234 567 890
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons text-indigo-400 text-base mt-0.5">email</span>
                support@salonfusion.com
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons text-indigo-400 text-base mt-0.5">location_on</span>
                123 Salon Street, City, Country
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>&copy; 2025 SalonFusion. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="/" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;