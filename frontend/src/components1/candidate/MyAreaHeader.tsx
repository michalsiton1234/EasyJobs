// import { useNavigate } from "react-router-dom";
// import { Loader2, Zap, ArrowLeft } from "lucide-react";
// import { getUserName } from "@/lib/auth";
// import { useDispatch } from "react-redux";
// import { logout } from "@/store/authSlice";
// import type { AppDispatch } from "@/store";
// import { logout as reduxLogout } from "@/store/authSlice";
// import { useAuth } from "@/lib/AuthContext";



// import "@/style/candidate/MyArea.css";

// interface MyAreaHeaderProps {
//   suggestionsCount: number;
//   loading: boolean;
//   onRefresh: () => void;
// }

// export default function MyAreaHeader({
//   suggestionsCount,
//   loading,
//   onRefresh,
// }: MyAreaHeaderProps) {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
// const { logout: authLogout } = useAuth();

// const handleLogout = () => {
//   authLogout();
//   dispatch(reduxLogout());
//   navigate("/login");
// };
// //   const dispatch = useDispatch<AppDispatch>();

// // const handleLogout = () => {
// //   dispatch(logout());
// //   navigate("/login");
// // };

//   return (
//     <>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <button
//           onClick={() => navigate("/")}
//           className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-gray-600 hover:bg-gray-50 transition-all"
//         >
//           <span>דף הבית</span> <ArrowLeft className="w-4 h-4" />
//         </button>
//         <button
//   onClick={handleLogout}
//   className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-white transition-all"
// >
//   התנתק
// </button>


//         <div className="text-right flex items-center gap-3">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">
//               שלום, {getUserName() || "אורח"}
//             </h1>
//             <p className="text-gray-500 text-sm">התאמות חכמות עבורך</p>
//           </div>
//    ז       <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-2xl shadow-lg">
//             👋
//           </div>
//         </div>
//       </div>

//       {/* Banner */}
//       <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-6 mb-8 text-white flex justify-between items-center">
//         <div className="flex items-center gap-4">
//           <div className="bg-white/20 p-3 rounded-xl">
//             <Zap className="w-6 h-6 fill-white" />
//           </div>
//           <div>
//             <h2 className="text-xl font-bold">התאמות אלגוריתם</h2>
//             <p className="text-white/80 text-sm">
//               מצאנו {suggestionsCount} משרות שתואמות בדיוק לפרופיל שלך
//             </p>
//           </div>
//         </div>
//         <button onClick={onRefresh} className="myarea-refresh-btn">
//           {loading ? (
//             <Loader2 className="w-5 h-5 animate-spin" />
//           ) : (
//             <Zap className="w-5 h-5" />
//           )}
//         </button>
//       </div>
//     </>
//   );
// }
import { useNavigate } from "react-router-dom";
import { Loader2, Zap, ArrowLeft } from "lucide-react";
import { getUserName } from "@/lib/auth";
import { useDispatch } from "react-redux";
import { logout as reduxLogout } from "@/store/authSlice";
import type { AppDispatch } from "@/store";
import { useAuth } from "@/lib/AuthContext";
import "@/style/candidate/MyArea.css";

interface MyAreaHeaderProps {
  suggestionsCount: number;
  loading: boolean;
  onRefresh: () => void;
}

export default function MyAreaHeader({
  suggestionsCount,
  loading,
  onRefresh,
}: MyAreaHeaderProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { logout: authLogout } = useAuth();

  const handleLogout = () => {
    authLogout();
    dispatch(reduxLogout());
    navigate("/login");
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-gray-600 hover:bg-gray-50 transition-all"
        >
          <span>דף הבית</span> <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-white transition-all"
          >
            התנתק
          </button>

          <div className="text-right flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                שלום, {getUserName() || "אורח"}
              </h1>
              <p className="text-gray-500 text-sm">התאמות חכמות עבורך</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-2xl shadow-lg">
              👋
            </div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-6 mb-8 text-white flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">התאמות אלגוריתם</h2>
            <p className="text-white/80 text-sm">
              מצאנו {suggestionsCount} משרות שתואמות בדיוק לפרופיל שלך
            </p>
          </div>
        </div>
        <button onClick={onRefresh} className="myarea-refresh-btn">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Zap className="w-5 h-5" />
          )}
        </button>
      </div>
    </>
  );
}
