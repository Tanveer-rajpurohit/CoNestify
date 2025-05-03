import NavBar from "./components/NavBar";

const Home = () => {
  return (
    <div className="w-full min-h-screen">
      
      <div className="relative w-full h-[100vh] bg-[#F1F1F1] px-2 py-1 font-mono overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 z-0 bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0%,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>

        
        <div className="relative z-10">
          <NavBar />
          

          
        </div>
      </div>

     

      
    </div>
  );
};

export default Home;
