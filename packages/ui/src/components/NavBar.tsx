// "use client";

// import { Facebook, Instagram, Twitter } from "lucide-react";
// import Link from "next/link";
// import "../font.css";
// import { FaSortDown } from "react-icons/fa";

// const NavBar = () => {
//   return (
//     <div className="w-full  px-6 flex items-start justify-center gap-30">
//       {/* Logo */}
//       <div className="">
//         <h2
//           className="text-[#F9921F] font-extrabold text-[2.55rem]"
//           style={{ fontFamily: "Nothing You Could Do" }}
//         >
//           CoNestify
//         </h2>
//       </div>

//       {/* Navigation Links */}
//       <nav className="hidden  md:flex items-center text-sm text-gray-500/80">
        
//         <div className="flex flex-col items-center justify-start">
//           <FaSortDown className="h-3 w-3" />
//           <div >
//             <Link
//               href="#"
//               className="px-1  transition-colors"
//             >
//               nosotros
//             </Link>
//             <span className="text-gray-500">|</span>
//           </div>
//         </div>
       
      
//         <div className="flex flex-col items-center justify-start">
//           <FaSortDown className="h-3 w-3" />
//           <div >
//             <Link
//               href="#"
//               className="px-1  transition-colors"
//             >
//               nosotros
//             </Link>
//             <span className="text-gray-500">|</span>
//           </div>
//         </div>
       
      
//         <div className="flex flex-col items-center justify-start">
//           <FaSortDown className="h-3 w-3" />
//           <div >
//             <Link
//               href="#"
//               className="px-1  transition-colors"
//             >
//               nosotros
//             </Link>
//             <span className="text-gray-500">|</span>
//           </div>
//         </div>
       
      
//         <div className="flex flex-col items-center justify-start">
//           <FaSortDown className="h-3 w-3" />
//           <div >
//             <Link
//               href="#"
//               className="px-1  transition-colors"
//             >
//               nosotros
//             </Link>
//             <span className="text-gray-500">|</span>
//           </div>
//         </div>
       
      
//         <div className="flex flex-col items-center justify-start">
//           <FaSortDown className="h-3 w-3" />
//           <div >
//             <Link
//               href="#"
//               className="px-1  transition-colors"
//             >
//               nosotros
//             </Link>
//             <span className="text-gray-500">|</span>
//           </div>
//         </div>
       
      
//         <div className="flex flex-col items-center justify-start">
//           <FaSortDown className="h-3 w-3" />
//           <div >
//             <Link
//               href="#"
//               className="px-1  transition-colors"
//             >
//               nosotros
//             </Link>
//           </div>
//         </div>
       
      
       
//         {/* Social Media Icons */}
//         <div className="hidden md:flex items-center gap-2 pt-2 ml-4">
//           <Link
//             href="#"
//             className="rounded-full border border-gray-800 flex items-center justify-center hover:border-[#F9921F] transition-colors"
//           >
//             <button className="rounded-full border border-gray-800 p-1 flex items-center justify-center  transition-colors">
//               <Facebook className="h-4 w-4 text-gray-700 " />
//             </button>
//           </Link>

//           <Link
//             href="#"
//             className="rounded-full border border-gray-800 flex items-center justify-center hover:border-[#F9921F] transition-colors"
//           >
//             <button className="rounded-full border border-gray-800 p-1 flex items-center justify-center  transition-colors">
//               <Instagram className="h-4 w-4 text-gray-700 " />
//             </button>
//           </Link>

//           <Link
//             href="#"
//             className="rounded-full border border-gray-800 flex items-center justify-center hover:border-[#F9921F] transition-colors"
//           >
//             <button className="rounded-full border border-gray-800 p-1 flex items-center justify-center  transition-colors">
//               <Twitter className="h-4 w-4 text-gray-700 " />
//             </button>
//           </Link>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default NavBar;



"use client"

import { Facebook, Instagram, Twitter } from "lucide-react"
import Link from "next/link"
import "../font.css"
import { FaSortDown } from "react-icons/fa"

const NavBar = () => {
  return (
    <div className="w-full  px-6 flex items-start justify-center gap-30">
      {/* Logo */}
      <div className="">
        <h2 className="text-[#F9921F] font-extrabold text-[2.55rem]" style={{ fontFamily: "Nothing You Could Do" }}>
          CoNestify
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="hidden  md:flex items-center text-sm text-gray-500/80">
        <div className="flex flex-col items-center justify-start group">
          <FaSortDown className="h-3 w-3 transform group-hover:text-[#F9921F] transition-all duration-300 group-hover:-translate-y-1" />
          <div>
            <Link href="#" className="px-1 transition-colors relative overflow-hidden group-hover:text-[#F9921F]">
              <span className="relative z-10">nosotros</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F9921F] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <span className="text-gray-500">|</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-start group">
          <FaSortDown className="h-3 w-3 transform group-hover:text-[#F9921F] transition-all duration-300 group-hover:-translate-y-1" />
          <div>
            <Link href="#" className="px-1 transition-colors relative overflow-hidden group-hover:text-[#F9921F]">
              <span className="relative z-10">nosotros</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F9921F] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <span className="text-gray-500">|</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-start group">
          <FaSortDown className="h-3 w-3 transform group-hover:text-[#F9921F] transition-all duration-300 group-hover:-translate-y-1" />
          <div>
            <Link href="#" className="px-1 transition-colors relative overflow-hidden group-hover:text-[#F9921F]">
              <span className="relative z-10">nosotros</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F9921F] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <span className="text-gray-500">|</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-start group">
          <FaSortDown className="h-3 w-3 transform group-hover:text-[#F9921F] transition-all duration-300 group-hover:-translate-y-1" />
          <div>
            <Link href="#" className="px-1 transition-colors relative overflow-hidden group-hover:text-[#F9921F]">
              <span className="relative z-10">nosotros</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F9921F] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <span className="text-gray-500">|</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-start group">
          <FaSortDown className="h-3 w-3 transform group-hover:text-[#F9921F] transition-all duration-300 group-hover:-translate-y-1" />
          <div>
            <Link href="#" className="px-1 transition-colors relative overflow-hidden group-hover:text-[#F9921F]">
              <span className="relative z-10">nosotros</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F9921F] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <span className="text-gray-500">|</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-start group">
          <FaSortDown className="h-3 w-3 transform group-hover:text-[#F9921F] transition-all duration-300 group-hover:-translate-y-1" />
          <div>
            <Link href="#" className="px-1 transition-colors relative overflow-hidden group-hover:text-[#F9921F]">
              <span className="relative z-10">nosotros</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F9921F] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="hidden md:flex items-center gap-2 pt-2 ml-4">
          <Link
            href="#"
            className="rounded-full border border-gray-800 flex items-center justify-center hover:border-[#F9921F] transition-colors"
          >
            <button className="rounded-full border border-gray-800 p-1 flex items-center justify-center transition-colors hover:border-[#F9921F] group">
              <Facebook className="h-4 w-4 text-gray-700 group-hover:text-[#F9921F] transition-colors" />
            </button>
          </Link>

          <Link
            href="#"
            className="rounded-full border border-gray-800 flex items-center justify-center hover:border-[#F9921F] transition-colors"
          >
            <button className="rounded-full border border-gray-800 p-1 flex items-center justify-center transition-colors hover:border-[#F9921F] group">
              <Instagram className="h-4 w-4 text-gray-700 group-hover:text-[#F9921F] transition-colors" />
            </button>
          </Link>

          <Link
            href="#"
            className="rounded-full border border-gray-800 flex items-center justify-center hover:border-[#F9921F] transition-colors"
          >
            <button className="rounded-full border border-gray-800 p-1 flex items-center justify-center transition-colors hover:border-[#F9921F] group">
              <Twitter className="h-4 w-4 text-gray-700 group-hover:text-[#F9921F] transition-colors" />
            </button>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default NavBar
