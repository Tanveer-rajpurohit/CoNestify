import { useRouter } from "next/navigation";


const HeroSection = () => {

  const router = useRouter()
  const handelnavigate = ()=>{
    const token = localStorage.getItem('authToken');
    if(token){
      router.push('/workspace')
    }else{
      router.push('/login')
    }
  }
  return (
    <div className="w-full min-h-screen relative  ">
      <div className="w-full h-full flex items-center justify-center py-20 px-4">
        <div className="text-center relative z-20 max-w-4xl mx-auto">
          <div className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6">
            <h2 className="text-[#007A5A] drop-shadow-[0_2px_4px_rgba(148,219,255,0.4)]">
              Create Workspace
            </h2>
            <h2 className="text-black drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]">
              work together,
            </h2>
          </div>
          <p className="text-xl md:text-2xl lg:text-3xl text-[#007A5A] font-medium mt-7 drop-shadow-[0_1px_2px_rgba(190,192,195,0.4)]">
            and manage projects together.
          </p>
          <div
           onClick={(e)=> {
            e.preventDefault()
            handelnavigate()
          }}
           className="mt-12">
            <button className="px-6 py-3 bg-[#007A5A] text-[#171717] font-semibold rounded-md hover:bg-[#32947A] transition-colors duration-300 shadow-lg text-white">
              Get Started
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-[40%] left-[5%] z-10 ">
        <img
          src="https://cdn.vectopus.com/getillustrations/illustrations/BAF4860C727A/F95994FDBBC7/icons-conference-call-online-meeting-group-chat-communication-team-woman-man-512.png"
          alt="Decorative shape 1"
          width={400}
          height={400}
          className="w-full h-auto max-w-[250px]"
        />
      </div>
      <div className="absolute top-[5%] left-[10%] z-10">
        <img
          src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQRnnIPfyGBNT-hqPtRTldaIfFLb4lWldOtVwVezGfBqaXwFRmW"
          alt="Decorative shape 2"
          width={400}
          height={400}
          className="w-full h-auto max-w-[150px]"
        />
      </div>
      <div className="absolute top-[30%] right-[5%] z-10 ">
        <img
          src="https://img.freepik.com/premium-photo/collaborative-work-discussion-three-individuals-showcasing-teamwork-communication-scene-highlights-engagement-idea-sharing-modern-workspace_68339-3195.jpg"
          alt="Decorative shape 3"
          width={200}
          height={200}
          className="w-full h-auto max-w-[200]"
        />
      </div>
    </div>
  );
};

export default HeroSection;

