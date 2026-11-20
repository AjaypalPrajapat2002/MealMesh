import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useAppData } from "../context/AppContext";
import { useEffect, useState } from "react";
import { CgShoppingCart } from "react-icons/cg";
import { BiMapPin, BiSearch } from "react-icons/bi";
import { HiOutlineUser } from "react-icons/hi2";

const Navbar = () => {
  const { isAuth, city, quauntity } = useAppData();
  const currLocation = useLocation();

  const isHomePage = currLocation.pathname === "/";

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        setSearchParams({ search });
      } else {
        setSearchParams({});
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#eee7df] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between gap-5 px-4 sm:px-6">
        <Link
          to={"/"}
          className="flex shrink-0 items-center gap-2 cursor-pointer"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#F15A3B] text-xl font-bold text-white shadow-[0_8px_20px_rgba(241,90,59,.20)]">M</span>
          <span>
            <span className="block font-[Poppins] text-xl font-bold leading-5 text-[#202124]">MealMesh</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777777]">Good Food. Connected.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 rounded-[10px] border border-[#EEE7DF] bg-[#FFF8F2] px-3 py-2 md:flex">
          <BiMapPin className="h-5 w-5 shrink-0 text-[#F15A3B]" />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#777777]">Deliver to</p>
            <p className="max-w-40 truncate text-sm font-semibold text-[#303030]">{city}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={"/cart"} className="relative flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#EEE7DF] bg-white transition hover:border-[#F15A3B] hover:bg-[#FFF8F2]" aria-label="Shopping cart">
            <CgShoppingCart className="h-5 w-5 text-[#202124]" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F15A3B] px-1 text-[10px] font-bold text-white">
              {quauntity}
            </span>
          </Link>

          {isAuth ? (
            <Link to="/account" className="flex h-11 items-center gap-2 rounded-[10px] border border-[#EEE7DF] px-3 font-medium text-[#303030] transition hover:border-[#F15A3B]">
              <HiOutlineUser className="h-5 w-5" />
              <span className="hidden sm:inline">Account</span>
            </Link>
          ) : (
            <Link to="/login" className="h-11 rounded-[10px] bg-[#F15A3B] px-5 flex items-center text-sm font-semibold text-white transition hover:bg-[#d9482d]">
              Login
            </Link>
          )}
        </div>
      </div>
      {isHomePage && (
        <div className="border-t border-[#F1ECE6] px-4 py-3">
          <div className="mx-auto flex max-w-[1280px] items-center rounded-[12px] border border-[#EEE7DF] bg-white shadow-[0_6px_24px_rgba(32,33,36,.05)]">
            <div className="hidden items-center gap-2 border-r border-[#EEE7DF] px-4 py-3 text-[#303030] sm:flex">
              <BiMapPin className="h-5 w-5 text-[#F15A3B]" />
              <span className="max-w-36 truncate text-sm font-medium">{city}</span>
            </div>
            <div className="flex flex-1 items-center gap-3 px-4">
              <BiSearch className="h-5 w-5 text-[#777777]" />
              <input type="text" placeholder="Search restaurants or dishes" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full py-3 text-sm text-[#303030] outline-none placeholder:text-[#999999]" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
