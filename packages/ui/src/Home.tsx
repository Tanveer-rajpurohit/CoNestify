import { FilePenLine } from "lucide-react";
import HeroSection from "./components/HeroSection";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const handelnavigate = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };
  return (
    <>
      <div
        className="w-full bg-[#ffffff] text-[#171717] min-h-screen py-8 px-6"
        style={{
          fontFamily: "Poppins",
        }}
      >
        <nav className="w-full flex justify-between items-baseline px-5 py-1">
          <div className="flex items-center justify-center gap-2 ">
            <FilePenLine className="w-5 h-5 text-gray-800" />
            <h2 className="text-lg ">CoNestify</h2>
          </div>
          <div
            onClick={(e) => {
              e.preventDefault();
              handelnavigate();
            }}
            className=""
          >
            <button className="px-6 py-3 bg-[#007A5A] text-[#171717] font-semibold rounded-md hover:bg-[#32947A] transition-colors duration-300 shadow-lg text-white">
              Try CoNestify
            </button>
          </div>
        </nav>
        <HeroSection />
      </div>
    </>
  );
};
export default Home;
