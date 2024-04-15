import { API, useGlobalContext } from "@/GlobalContext";
import Login from "@/auth/Login";
import Register from "@/auth/Register";
import { LoadingSpinner } from "@/components/ui/loadingspinner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Onboard = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const {setUser} = useGlobalContext();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(API + "/auth/validate", {
          method: "GET",
          headers: {
            "Authorization": token
          },
        });

        if (!response.ok) {
          throw new Error("Failed to validate token");
        }

        const data = await response.json();
        setUser(data.username);
        navigate("/home");
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    validateToken();
  }, []);


  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src="Tick.png" alt="VeriSight Logo" className="py-5" />
      <h4 className="font-extrabold text-xl my-0">
        Don't trust whatever you see
      </h4>
      <div className="border-black pb-2">
        <h3 className="text-wrap text-center justify-center px-5 py-5">
          An AI tool that detects fake news and misleading headlines online.
          Using cutting-edge algorithms, it instantly identifies unreliable
          sources and alerts users to potential misinformation, helping them
          browse the web with confidence and avoid falling for clickbait traps.
          <br />
        </h3>
      </div>
      <div className="flex flex-row space-x-2">
        <Login />
        <Register />
      </div>
    </div>
  );
};

export default Onboard;
