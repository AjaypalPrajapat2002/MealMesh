import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineBuildingStorefront,
  HiOutlineHome,
  HiOutlineMagnifyingGlass,
  HiOutlineUsers,
  HiOutlineTruck,
  HiOutlineShoppingBag,
  HiOutlineSquares2X2,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineArrowLeftOnRectangle,
} from "react-icons/hi2";
import { adminService } from "../main";
import { useAppData } from "../context/AppContext";

type AdminSection =
  | "overview"
  | "restaurants"
  | "riders"
  | "customers"
  | "orders"
  | "categories"
  | "reports"
  | "settings";

interface AdminStats {
  restaurants: number;
  riders: number;
  customers: number;
  pendingApprovals: number;
}

const navItems: { key: AdminSection; label: string; icon: typeof HiOutlineHome }[] =
  [
    { key: "overview", label: "Overview", icon: HiOutlineHome },
    { key: "restaurants", label: "Restaurants", icon: HiOutlineBuildingStorefront },
    { key: "riders", label: "Riders", icon: HiOutlineTruck },
    { key: "customers", label: "Customers", icon: HiOutlineUsers },
    { key: "orders", label: "Orders", icon: HiOutlineShoppingBag },
    { key: "categories", label: "Categories", icon: HiOutlineSquares2X2 },
    { key: "reports", label: "Reports", icon: HiOutlineChartBar },
    { key: "settings", label: "Settings", icon: HiOutlineCog6Tooth },
  ];

const Admin = () => {
  const { setUser, setIsAuth } = useAppData();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [riders, setRiders] = useState<any[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    restaurants: 0,
    riders: 0,
    customers: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<AdminSection>("overview");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "pending">("all");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [restaurantResult, riderResult, statsResult] = await Promise.all([
        axios.get(`${adminService}/api/v1/admin/restaurant/pending`, {
          headers: authHeaders,
        }),
        axios.get(`${adminService}/api/v1/admin/rider/pending`, {
          headers: authHeaders,
        }),
        axios.get(`${adminService}/api/v1/admin/stats`, {
          headers: authHeaders,
        }),
      ]);

      setRestaurants(restaurantResult.data.restaurants || []);
      setRiders(riderResult.data.riders || []);
      setStats(statsResult.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRestaurants = useMemo(() => {
    const query = search.trim().toLowerCase();
    return restaurants.filter((restaurant) => {
      const matchesSearch =
        !query ||
        restaurant.name?.toLowerCase().includes(query) ||
        restaurant.phone?.toString().includes(query) ||
        restaurant.autoLocation?.formattedAddress?.toLowerCase().includes(query);
      const matchesStatus =
        status === "all" || restaurant.isVerified === false;
      return matchesSearch && matchesStatus;
    });
  }, [restaurants, search, status]);

  const filteredRiders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return riders.filter((rider) => {
      const matchesSearch =
        !query ||
        rider.phoneNumber?.toString().includes(query) ||
        rider.aadharNumber?.toString().includes(query) ||
        rider.drivingLicenseNumber?.toString().toLowerCase().includes(query);
      const matchesStatus = status === "all" || rider.isVerified === false;
      return matchesSearch && matchesStatus;
    });
  }, [riders, search, status]);

  const verifyRestaurant = async (restaurant: any) => {
    if (!window.confirm(`Approve ${restaurant.name || "this restaurant"}?`)) return;

    try {
      setVerifyingId(restaurant._id);
      await axios.patch(
        `${adminService}/api/v1/verify/restaurant/${restaurant._id}`,
        {},
        { headers: authHeaders }
      );
      toast.success("Restaurant approved successfully");
      await fetchData();
    } catch (error) {
      toast.error("Failed to approve restaurant");
    } finally {
      setVerifyingId(null);
    }
  };

  const verifyRider = async (rider: any) => {
    if (!window.confirm(`Approve rider ${rider.phoneNumber || rider._id}?`)) return;

    try {
      setVerifyingId(rider._id);
      await axios.patch(
        `${adminService}/api/v1/verify/rider/${rider._id}`,
        {},
        { headers: authHeaders }
      );
      toast.success("Rider approved successfully");
      await fetchData();
    } catch (error) {
      toast.error("Failed to approve rider");
    } finally {
      setVerifyingId(null);
    }
  };

  const logout = () => {
    localStorage.setItem("token", "");
    setIsAuth(false);
    setUser(null);
  };

  const queueType = section === "riders" ? "riders" : "restaurants";
  const showQueue = section === "restaurants" || section === "riders" || section === "overview";

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-[#EEE7DF] bg-white px-4 py-5 lg:flex lg:flex-col">
        <div className="flex items-center gap-3 px-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#F15A3B] text-lg font-bold text-white">M</span>
          <div>
            <p className="font-[Poppins] font-bold text-[#202124]">MealMesh</p>
            <p className="text-xs text-[#777777]">Admin Console</p>
          </div>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = section === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSection(item.key)}
                className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-[#FFF0EA] text-[#F15A3B]"
                    : "text-[#666666] hover:bg-[#FFF8F2] hover:text-[#202124]"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
                {item.key === "restaurants" && stats.pendingApprovals > 0 && (
                  <span className="ml-auto rounded-full bg-[#FFF0EA] px-2 py-0.5 text-[10px] font-bold text-[#F15A3B]">
                    {stats.pendingApprovals}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <button onClick={logout} className="mt-auto flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-[#777777] hover:bg-red-50 hover:text-red-600">
          <HiOutlineArrowLeftOnRectangle className="h-[18px] w-[18px]" />
          Sign out
        </button>
      </aside>

      <main className="lg:ml-[250px]">
        <div className="border-b border-[#EEE7DF] bg-white px-4 py-4 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F15A3B]">Platform control</p>
            <h1 className="mt-1 text-2xl font-bold text-[#202124]">Admin Dashboard</h1>
          </div>
          <nav className="mx-auto mt-4 flex max-w-[1180px] gap-2 overflow-x-auto lg:hidden">
            {navItems.map((item) => (
              <button key={item.key} type="button" onClick={() => setSection(item.key)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold ${section === item.key ? "bg-[#F15A3B] text-white" : "border border-[#EEE7DF] bg-white text-[#777777]"}`}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mx-auto max-w-[1180px] px-4 py-6 lg:px-8">
          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[1, 2, 3, 4].map((item) => <div key={item} className="h-28 animate-pulse rounded-[16px] border border-[#EEE7DF] bg-white" />)}
              </div>
              <div className="h-16 animate-pulse rounded-[16px] border border-[#EEE7DF] bg-white" />
              <div className="h-72 animate-pulse rounded-[16px] border border-[#EEE7DF] bg-white" />
            </div>
          ) : (
            <>
              <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  { label: "Pending approvals", value: stats.pendingApprovals, icon: HiOutlineClock, color: "text-[#F15A3B]", bg: "bg-[#FFF0EA]" },
                  { label: "Restaurants", value: stats.restaurants, icon: HiOutlineBuildingStorefront, color: "text-[#27865B]", bg: "bg-[#EAF5EF]" },
                  { label: "Riders", value: stats.riders, icon: HiOutlineTruck, color: "text-[#4A6FA5]", bg: "bg-[#EDF3FA]" },
                  { label: "Customers", value: stats.customers, icon: HiOutlineUsers, color: "text-[#7B61A8]", bg: "bg-[#F3EFF8]" },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} className="rounded-[16px] border border-[#EEE7DF] bg-white p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium text-[#777777] sm:text-sm">{card.label}</p>
                          <p className="mt-2 text-2xl font-bold text-[#202124] sm:text-3xl">{card.value}</p>
                        </div>
                        <span className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${card.bg} ${card.color}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </section>

              {showQueue ? (
                <section className="mt-6">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#F15A3B]">Verification queue</p>
                      <h2 className="mt-1 text-xl font-bold text-[#202124]">
                        {section === "riders" ? "Pending riders" : section === "restaurants" ? "Pending restaurants" : "Pending approvals"}
                      </h2>
                    </div>
                    {section === "overview" && (
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setSection("restaurants")} className="rounded-[9px] border border-[#EEE7DF] bg-white px-3 py-2 text-xs font-semibold text-[#303030]">View restaurants</button>
                        <button type="button" onClick={() => setSection("riders")} className="rounded-[9px] bg-[#F15A3B] px-3 py-2 text-xs font-semibold text-white">View riders</button>
                      </div>
                    )}
                  </div>

                  {section === "overview" ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                      <QueuePreview title="Restaurants" count={restaurants.length} empty="No pending restaurant approvals." onView={() => setSection("restaurants")} />
                      <QueuePreview title="Riders" count={riders.length} empty="No pending rider approvals." onView={() => setSection("riders")} />
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex flex-col gap-3 rounded-[16px] border border-[#EEE7DF] bg-white p-3 sm:flex-row">
                        <div className="relative flex-1">
                          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777777]" />
                          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${queueType}...`} className="h-10 w-full rounded-[9px] border border-[#EEE7DF] pl-9 pr-3 text-sm outline-none focus:border-[#F15A3B]" />
                        </div>
                        <select value={status} onChange={(event) => setStatus(event.target.value as "all" | "pending")} className="h-10 rounded-[9px] border border-[#EEE7DF] bg-white px-3 text-sm outline-none focus:border-[#F15A3B]">
                          <option value="all">All status</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>

                      {queueType === "restaurants" ? (
                        <RestaurantQueue items={filteredRestaurants} verifyingId={verifyingId} onVerify={verifyRestaurant} />
                      ) : (
                        <RiderQueue items={filteredRiders} verifyingId={verifyingId} onVerify={verifyRider} />
                      )}
                    </>
                  )}
                </section>
              ) : (
                <section className="mt-6 rounded-[16px] border border-[#EEE7DF] bg-white p-10 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF8F2] text-[#F15A3B]">
                    <HiOutlineSquares2X2 className="h-6 w-6" />
                  </span>
                  <h2 className="mt-4 text-xl font-bold text-[#202124]">{navItems.find((item) => item.key === section)?.label}</h2>
                  <p className="mt-2 text-sm text-[#777777]">This management view is ready for the next API integration.</p>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const QueuePreview = ({ title, count, empty, onView }: { title: string; count: number; empty: string; onView: () => void }) => (
  <div className="rounded-[16px] border border-[#EEE7DF] bg-white p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-[#777777]">{title}</p>
        <p className="mt-1 text-2xl font-bold text-[#202124]">{count}</p>
      </div>
      <button type="button" onClick={onView} className="rounded-[9px] border border-[#EEE7DF] px-3 py-2 text-xs font-semibold text-[#303030] hover:border-[#F15A3B]">Open queue</button>
    </div>
    {count === 0 && <p className="mt-4 rounded-[10px] bg-[#F7F9F8] px-3 py-2 text-sm text-[#27865B]">{empty}</p>}
  </div>
);

const EmptyQueue = ({ label }: { label: string }) => (
  <div className="rounded-[16px] border border-dashed border-[#D8CFC4] bg-white py-12 text-center">
    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5EF] text-[#27865B]"><HiOutlineCheck className="h-5 w-5" /></span>
    <p className="mt-3 font-semibold text-[#303030]">No pending {label}</p>
    <p className="mt-1 text-sm text-[#777777]">This queue is all caught up.</p>
  </div>
);

const RestaurantQueue = ({ items, verifyingId, onVerify }: { items: any[]; verifyingId: string | null; onVerify: (item: any) => void }) => {
  if (items.length === 0) return <EmptyQueue label="restaurant approvals" />;
  return (
    <>
      <div className="hidden overflow-hidden rounded-[16px] border border-[#EEE7DF] bg-white md:block">
        <table className="w-full text-left">
          <thead className="border-b border-[#EEE7DF] bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wide text-[#777777]">
            <tr><th className="px-5 py-3">Restaurant</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-[#EEE7DF]">
            {items.map((restaurant) => (
              <tr key={restaurant._id} className="text-sm">
                <td className="px-5 py-4"><div className="flex items-center gap-3"><img src={restaurant.image} alt="" className="h-10 w-10 rounded-[9px] object-cover" /><span className="font-semibold text-[#303030]">{restaurant.name}</span></div></td>
                <td className="px-5 py-4 text-[#777777]">{restaurant.phone || "—"}</td>
                <td className="max-w-[260px] px-5 py-4 text-[#777777]">{restaurant.autoLocation?.formattedAddress || "Location unavailable"}</td>
                <td className="px-5 py-4"><span className="rounded-full bg-[#FFF0EA] px-2.5 py-1 text-xs font-semibold text-[#F15A3B]">Pending</span></td>
                <td className="px-5 py-4 text-right"><button disabled={verifyingId === restaurant._id} onClick={() => onVerify(restaurant)} className="rounded-[9px] bg-[#27865B] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{verifyingId === restaurant._id ? "Approving..." : "Approve"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {items.map((restaurant) => (
          <div key={restaurant._id} className="rounded-[16px] border border-[#EEE7DF] bg-white p-4">
            <div className="flex gap-3"><img src={restaurant.image} alt="" className="h-16 w-16 rounded-[10px] object-cover" /><div><p className="font-semibold text-[#303030]">{restaurant.name}</p><p className="mt-1 text-xs text-[#777777]">{restaurant.phone || "No phone"}</p><span className="mt-2 inline-block rounded-full bg-[#FFF0EA] px-2 py-1 text-xs font-semibold text-[#F15A3B]">Pending</span></div></div>
            <p className="mt-3 text-sm text-[#777777]">{restaurant.autoLocation?.formattedAddress || "Location unavailable"}</p>
            <button disabled={verifyingId === restaurant._id} onClick={() => onVerify(restaurant)} className="mt-4 w-full rounded-[9px] bg-[#27865B] py-2.5 text-sm font-semibold text-white disabled:opacity-50">{verifyingId === restaurant._id ? "Approving..." : "Approve restaurant"}</button>
          </div>
        ))}
      </div>
    </>
  );
};

const RiderQueue = ({ items, verifyingId, onVerify }: { items: any[]; verifyingId: string | null; onVerify: (item: any) => void }) => {
  if (items.length === 0) return <EmptyQueue label="rider approvals" />;
  return (
    <>
      <div className="hidden overflow-hidden rounded-[16px] border border-[#EEE7DF] bg-white md:block">
        <table className="w-full text-left">
          <thead className="border-b border-[#EEE7DF] bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wide text-[#777777]">
            <tr><th className="px-5 py-3">Rider</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">Aadhar</th><th className="px-5 py-3">License</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-[#EEE7DF]">
            {items.map((rider) => (
              <tr key={rider._id} className="text-sm">
                <td className="px-5 py-4"><div className="flex items-center gap-3"><img src={rider.picture} alt="" className="h-10 w-10 rounded-full object-cover" /><span className="font-semibold text-[#303030]">Rider</span></div></td>
                <td className="px-5 py-4 text-[#777777]">{rider.phoneNumber || "—"}</td>
                <td className="px-5 py-4 text-[#777777]">{rider.aadharNumber || "—"}</td>
                <td className="px-5 py-4 text-[#777777]">{rider.drivingLicenseNumber || "—"}</td>
                <td className="px-5 py-4"><span className="rounded-full bg-[#FFF0EA] px-2.5 py-1 text-xs font-semibold text-[#F15A3B]">Pending</span></td>
                <td className="px-5 py-4 text-right"><button disabled={verifyingId === rider._id} onClick={() => onVerify(rider)} className="rounded-[9px] bg-[#27865B] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{verifyingId === rider._id ? "Approving..." : "Approve"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {items.map((rider) => (
          <div key={rider._id} className="rounded-[16px] border border-[#EEE7DF] bg-white p-4">
            <div className="flex gap-3"><img src={rider.picture} alt="" className="h-16 w-16 rounded-full object-cover" /><div><p className="font-semibold text-[#303030]">{rider.phoneNumber || "Rider"}</p><span className="mt-2 inline-block rounded-full bg-[#FFF0EA] px-2 py-1 text-xs font-semibold text-[#F15A3B]">Pending</span></div></div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#777777]"><p>Aadhar: {rider.aadharNumber || "—"}</p><p>License: {rider.drivingLicenseNumber || "—"}</p></div>
            <button disabled={verifyingId === rider._id} onClick={() => onVerify(rider)} className="mt-4 w-full rounded-[9px] bg-[#27865B] py-2.5 text-sm font-semibold text-white disabled:opacity-50">{verifyingId === rider._id ? "Approving..." : "Approve rider"}</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Admin;
