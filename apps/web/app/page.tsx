"use client";

import Home from "@repo/ui/Home";

const page = () => {
  return (
    <>
      <Home />
    </>
  );
};
export default page;



// import "dotenv/config";

// const page = async () => {
//   // Fetch the env variable from your API route
//   const res = await fetch("http://localhost:3000/api/env", {
//     cache: "no-store",
//   });
//   console.log(res);
//   const data = await res.json();
//   console.log(data);

//   return (
//     <div>
//       <div>DATABASE_URL: {process.env.DATABASE_URL}</div>
//     </div>
//   );
// };
// export default page;
