
import { FaUserLarge } from "react-icons/fa6";
import { UserProfileVisiable } from "@context/UserProfile";
const UserInfo = () => {
  const { value: userProfile, set: setUserProfile } = UserProfileVisiable();

  const handelVisiableUserData = ()=>{
    setUserProfile(!userProfile)
  }
  return (
    <>
      <div className="w-full mt-10 px-4">
        <div className="user flex items-center justify-start gap-2">
          <div className="icon w-24 h-24 rounded-xl bg-[#44BEDF] text-[#ECF8FC] flex items-end justify-center">
            <FaUserLarge className="w-20 h-20" />
          </div>
          <h2 className="text-xl">tanveer</h2>
        </div>

        <h4 className="mt-2 text-xl font-extralight">
          This conversation is just between{" "}
          <span className="bg-[#E8F5FA] px-1 py-0.5 text-[#0f7490] rounded-md hover:bg-[#D2EBF6] hover:text-[#376673]">
            @tanveer
          </span>{" "}
          and you. Check out their profile to learn more about them.
        </h4>

        <div className="mt-4">
          <button
          onClick={handelVisiableUserData}
          className="text-lg px-3 py-0.5 border border-[#c4c4c4] rounded-lg hover:bg-[#F8F8F8]">
            View Profile
          </button>
        </div>

      
      </div>
    </>
  );
};
export default UserInfo;
