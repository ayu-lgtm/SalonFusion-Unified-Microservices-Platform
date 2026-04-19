import React, { useEffect } from "react";
import { services } from "../../../Data/Services";
import HomeServiceCard from "./HomeServiceCard";
import SalonList from "../Salon/SalonList";
import Banner from "./Banner";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalons } from "../../../Redux/Salon/action";

const Home = () => {
  const { salon } = useSelector((store) => store);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSalons());
  }, []);

  return (
    <div className="space-y-24">
      <section>
        <Banner />
      </section>

      {/* Services section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="w-full lg:w-1/2">
            <div className="mb-8">
              <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wide mb-2">Services</p>
              <h2 className="text-3xl font-bold text-slate-900">What are you looking for? 👀</h2>
              <p className="text-slate-500 mt-2">Browse our wide range of professional beauty services</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {services.map((item) => (
                <HomeServiceCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Photo grid */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3 h-[480px]">
            <div className="row-span-1 rounded-2xl overflow-hidden">
              <img className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" src="https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" src="https://images.pexels.com/photos/3331488/pexels-photo-3331488.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" src="https://images.pexels.com/photos/5069455/pexels-photo-5069455.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" src="https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* Salons section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wide mb-2">Discover</p>
            <h2 className="text-3xl font-bold text-slate-900">Book Your Favorite Salon</h2>
          </div>
        </div>
        <SalonList salons={salon.salons} />
      </section>
    </div>
  );
};

export default Home;