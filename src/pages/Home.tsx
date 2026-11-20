import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppData } from "../context/AppContext";
import { useEffect, useState } from "react";
import type { IRestaurant } from "../types";
import axios from "axios";
import { restaurantService } from "../main";
import RestaurantCard from "../components/RestaurantCard";
import { BiSearch, BiMapPin } from "react-icons/bi";
import { FiArrowRight } from "react-icons/fi";

const categories = [
  ["Pizza", "🍕"], ["Burgers", "🍔"], ["Biryani", "🍛"], ["Chinese", "🥢"],
  ["South Indian", "🥘"], ["North Indian", "🫓"], ["Desserts", "🍰"],
  ["Healthy", "🥗"], ["Beverages", "🧋"],
];

const Home = () => {
  const { location, city } = useAppData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search") || "";

  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const getDistanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return +(R * c).toFixed(2);
  };

  const fetchRestaurants = async () => {
    if (!location?.latitude || !location?.longitude) {
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(
        `${restaurantService}/api/restaurant/all`,
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            search,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRestaurants(data.restaurants ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [location, search]);

  if (loading || !location) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500">Finding restaurants near you...</p>
      </div>
    );
  }
  return (
    <main className="pb-16">
      <section className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:py-10">
        <div className="relative min-h-[330px] overflow-hidden rounded-[24px] bg-[#202124] px-6 py-10 text-white sm:px-10 lg:flex lg:items-center lg:px-14">
          <div className="relative z-10 max-w-[620px]">
            <span className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#FFD8CE]">Fresh picks, near you</span>
            <h1 className="text-[38px] font-bold leading-[1.12] text-white sm:text-[52px]">Discover Food<br />You'll Love.</h1>
            <p className="mt-4 max-w-lg text-base text-[#D8D8D8] sm:text-lg">Your favourite meals, delivered fresh to your doorstep.</p>
            <button type="button" onClick={() => document.querySelector<HTMLInputElement>('input[placeholder*="restaurants"]')?.focus()} className="mt-7 flex w-full max-w-[520px] items-center rounded-[12px] bg-white p-2 text-left shadow-[0_16px_40px_rgba(0,0,0,.18)] sm:w-[520px]">
              <BiMapPin className="ml-3 h-5 w-5 shrink-0 text-[#F15A3B]" />
              <span className="max-w-[130px] truncate px-2 text-sm font-medium text-[#303030] sm:max-w-[160px]">{location?.formattedAddress || city}</span>
              <span className="mx-1 h-6 w-px bg-[#EEE7DF]" />
              <BiSearch className="ml-2 h-5 w-5 shrink-0 text-[#777777]" />
              <span className="flex-1 px-2 text-sm text-[#777777]">Search restaurants</span>
              <span className="flex h-11 items-center gap-2 rounded-[9px] bg-[#F15A3B] px-4 text-sm font-semibold text-white">
                Search <FiArrowRight />
              </span>
            </button>
          </div>
          <div className="absolute right-[-80px] top-[-90px] h-[430px] w-[430px] rounded-full border-[52px] border-white/5 sm:right-[-20px] lg:right-[-10px]" />
          <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=720&q=85" alt="Fresh pizza" className="absolute right-[-30px] bottom-[-120px] h-[380px] w-[380px] rounded-full object-cover shadow-2xl ring-[18px] ring-white/10 lg:right-[30px] lg:bottom-[-70px]" />
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-[#F15A3B]">Explore flavours</p>
            <h2 className="mt-1 text-2xl font-bold text-[#202124]">What's on your mind?</h2>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {categories.map(([name, emoji]) => (
            <button key={name} type="button" onClick={() => navigate(`/?search=${encodeURIComponent(name)}`)} className="group flex min-h-[110px] flex-col items-center justify-center gap-3 rounded-[16px] border border-[#EEE7DF] bg-white px-2 text-center shadow-[0_6px_20px_rgba(32,33,36,.04)] transition hover:-translate-y-1 hover:border-[#F15A3B]/40">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF8F2] text-3xl transition group-hover:scale-105">{emoji}</span>
              <span className="text-xs font-semibold text-[#303030] sm:text-sm">{name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-[1280px] px-4 sm:px-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-[#F15A3B]">Near you</p>
            <h2 className="mt-1 text-2xl font-bold">Popular restaurants</h2>
          </div>
          <span className="hidden text-sm font-medium text-[#777777] sm:inline">{restaurants.length} places available</span>
        </div>
      {restaurants.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {restaurants.map((res) => {
            const [resLng, resLat] = res.autoLocation.coordinates;

            const distance = getDistanceKm(
              location.latitude,
              location.longitude,
              resLat,
              resLng
            );

            return (
              <RestaurantCard
                key={res._id}
                id={res._id}
                name={res.name}
                image={res.image ?? ""}
                distance={`${distance}`}
                isOpen={res.isOpen}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-[16px] border border-dashed border-[#D8CFC4] bg-white px-6 py-14 text-center">
          <p className="text-lg font-semibold text-[#303030]">No restaurants found nearby</p>
          <p className="mt-2 text-sm text-[#777777]">Try a different search or check back soon.</p>
        </div>
      )}
      </section>

      <section className="mx-auto mt-12 max-w-[1280px] px-4 sm:px-6">
        <div className="flex flex-col overflow-hidden rounded-[20px] bg-[#F4E5D9] md:flex-row">
          <div className="flex-1 p-8 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#F15A3B]">MealMesh offers</p>
            <h2 className="mt-2 text-3xl font-bold">Good food, better value.</h2>
            <p className="mt-3 max-w-lg text-[#777777]">Discover local favourites and save on your next meal.</p>
            <button type="button" onClick={() => document.querySelector<HTMLInputElement>('input[placeholder*="restaurants"]')?.focus()} className="mt-6 rounded-[10px] bg-[#202124] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#303030]">Explore offers</button>
          </div>
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85" alt="Meal offer" className="h-64 w-full object-cover md:h-auto md:w-[44%]" />
        </div>
      </section>
    </main>
  );
};

export default Home;
