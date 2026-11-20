import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { IMenuItem, IRestaurant } from "../types";
import axios from "axios";
import { restaurantService } from "../main";
import MenuItems from "../components/MenuItems";

const RestaurantPage = () => {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurant = async () => {
    try {
      const { data } = await axios.get(
        `${restaurantService}/api/restaurant/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRestaurant(data || null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const { data } = await axios.get(
        `${restaurantService}/api/item/all/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMenuItems(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRestaurant();
      fetchMenuItems();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading restaurant...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500">No Restaurant with this id</p>
      </div>
    );
  }
  return (
    <main className="mx-auto min-h-screen max-w-[1280px] px-4 py-6 sm:px-6">
      <section className="overflow-hidden rounded-[20px] border border-[#EEE7DF] bg-white shadow-[0_12px_36px_rgba(32,33,36,.06)]">
        {restaurant.image && (
          <div className="relative h-[260px] sm:h-[340px]">
            <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
              <span className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-bold text-white ${restaurant.isOpen ? "bg-[#27865B]" : "bg-[#777777]"}`}>{restaurant.isOpen ? "OPEN NOW" : "CLOSED"}</span>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">{restaurant.name}</h1>
              <p className="mt-2 max-w-xl text-sm text-white/85">{restaurant.description || restaurant.autoLocation.formattedAddress}</p>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5 text-sm text-[#777777] sm:px-8">
          <span><strong className="text-[#303030]">25-35 min</strong> delivery</span>
          <span>{restaurant.autoLocation.formattedAddress || "Location unavailable"}</span>
          <button type="button" className="ml-auto rounded-[10px] border border-[#EEE7DF] px-4 py-2 font-semibold text-[#303030]">View details</button>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-[#F15A3B]">Full menu</p>
            <h2 className="mt-1 text-2xl font-bold">Choose your favourites</h2>
          </div>
          <span className="text-sm text-[#777777]">{menuItems.length} items</span>
        </div>
        <div className="rounded-[16px] border border-[#EEE7DF] bg-white p-4 shadow-[0_8px_28px_rgba(32,33,36,.04)] sm:p-6">
          {menuItems.length > 0 ? (
            <MenuItems isSeller={false} items={menuItems} onItemDeleted={() => {}} />
          ) : (
            <div className="py-12 text-center text-[#777777]">This restaurant has no menu items yet.</div>
          )}
        </div>
      </section>
    </main>
  );
};

export default RestaurantPage;
