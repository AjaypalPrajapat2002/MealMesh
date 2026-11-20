import { useNavigate } from "react-router-dom";

type props = {
  id: string;
  image: string;
  name: string;
  distance: string;
  isOpen: boolean;
};

const RestaurantCard = ({ id, image, name, distance, isOpen }: props) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className={`group w-full cursor-pointer overflow-hidden rounded-[16px] border border-[#EEE7DF] bg-white text-left shadow-[0_8px_28px_rgba(32,33,36,.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(32,33,36,.10)] ${!isOpen ? "opacity-80" : ""}`}
      onClick={() => navigate(`/restaurant/${id}`)}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.04] ${
            !isOpen ? "grayscale" : ""
          }`}
        />
        {isOpen && (
          <span className="absolute left-3 top-3 rounded-full bg-[#27865B] px-2.5 py-1 text-[11px] font-bold text-white">OPEN</span>
        )}

        {!isOpen && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-md bg-black/80 px-3 py-1 font-semibold text-sm text-white">
              Closed
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1 p-4">
        <h3 className="truncate text-base font-semibold text-[#202124]">
          {name}
        </h3>
        <div className="flex items-center justify-between text-sm text-[#777777]">
          <span>{distance} km away</span>
          <span className="rounded-md bg-[#FFF8F2] px-2 py-1 text-xs font-semibold text-[#F15A3B]">25-35 min</span>
        </div>
      </div>
    </button>
  );
};

export default RestaurantCard;
