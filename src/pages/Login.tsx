import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

import { FcGoogle } from "react-icons/fc";
import { useAppData } from "../context/AppContext";
import { authService } from "../main";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsAuth } = useAppData();



  const responseGoogle = async (authResult: { code: string }) => {
    setLoading(true);
    try {
      const result = await axios.post(`${authService}/api/auth/login`, {
        code: authResult["code"],
      });

      localStorage.setItem("token", result.data.token);
      setUser(result.data.user);
      setIsAuth(true);
      toast.success(result.data.message);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Problem while login");
      } else {
        toast.error("Problem while login");
      }
      setLoading(false);
    }
  };

    const googlelogin = useGoogleLogin({
      onSuccess: responseGoogle,
      onError: (error) => {
        console.error(error);
        toast.error("Problem while login");
        setLoading(false);
      },
      flow: "auth-code",
    });
    return (
      <main className="grid min-h-[calc(100vh-76px)] lg:grid-cols-[1.05fr_.95fr]">
        <section className="hidden bg-[#202124] p-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F15A3B]">MealMesh</p>
            <h1 className="mt-5 max-w-lg text-5xl font-bold leading-[1.1] text-white">Good food.<br />One connected place.</h1>
          </div>
          <img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85" alt="Fresh meal" className="h-[360px] w-full rounded-[24px] object-cover opacity-95" />
        </section>
        <section className="flex items-center justify-center bg-[#FFF8F2] px-5 py-12">
          <div className="w-full max-w-[420px]">
            <span className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#F15A3B] text-xl font-bold text-white">M</span>
            <h1 className="text-center text-3xl font-bold text-[#202124]">Welcome to MealMesh</h1>
            <p className="mt-2 text-center text-sm text-[#777777]">Sign in to discover meals and track every order.</p>
            <button onClick={googlelogin} disabled={loading} className="mt-8 flex w-full items-center justify-center gap-3 rounded-[10px] border border-[#DCD5CC] bg-white px-4 py-3.5 text-sm font-semibold text-[#303030] shadow-[0_8px_24px_rgba(32,33,36,.05)] transition hover:border-[#F15A3B] disabled:opacity-60">
              <FcGoogle size={20} />
              {loading ? "Signing in..." : "Continue with Google"}
            </button>
            <p className="mt-6 text-center text-xs leading-5 text-[#777777]">
              By continuing, you agree to our <span className="font-semibold text-[#F15A3B]">Terms of Service</span> and <span className="font-semibold text-[#F15A3B]">Privacy Policy</span>.
            </p>
          </div>
        </section>
      </main>
    );
  };

export default Login;
