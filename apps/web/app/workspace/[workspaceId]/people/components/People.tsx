import {Search, User2Icon, X, Dot, Clock, MessageCircle, EllipsisVertical, Mail} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {FaUserLarge} from "react-icons/fa6";
import { InvitePeopleDialog } from "../../components/invite-people-dialog";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    status: string;
    createdDate: Date;
    bgColor: string;
}

const User: User[] = [
    {
        id: "1",
        name: "Tanveer singh",
        email: "Tanveer@gmail.com",
        role: "Admin",
        avatar: "https://robohash.org/1",
        status: "Active",
        createdDate: new Date(2023, 3, 14),
        bgColor: "#007A5A",
    },
    {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah.j@gmail.com",
        role: "Developer",
        avatar: "https://robohash.org/2",
        status: "Active",
        createdDate: new Date(2023, 5, 22),
        bgColor: "#2E86C1",
    },
    {
        id: "3",
        name: "Mike Brown",
        email: "mike.b@gmail.com",
        role: "Designer",
        avatar: "https://robohash.org/3",
        status: "Inactive",
        createdDate: new Date(2023, 7, 8),
        bgColor: "#8E44AD",
    },
    {
        id: "4",
        name: "Emily Davis",
        email: "emily.d@gmail.com",
        role: "Manager",
        avatar: "https://robohash.org/4",
        status: "Active",
        createdDate: new Date(2023, 9, 1),
        bgColor: "#D35400",
    },
    {
        id: "5",
        name: "Alex Wilson",
        email: "alex.w@gmail.com",
        role: "Developer",
        avatar: "https://robohash.org/5",
        status: "Active",
        createdDate: new Date(2023, 11, 15),
        bgColor: "#27AE60",
    },
    {
        id: "6",
        name: "Lisa Chen",
        email: "lisa.c@gmail.com",
        role: "Designer",
        avatar: "https://robohash.org/6",
        status: "Active",
        createdDate: new Date(2024, 1, 5),
        bgColor: "#E74C3C",
    },
    {
        id: "7",
        name: "David Kim",
        email: "david.k@gmail.com",
        role: "Developer",
        avatar: "https://robohash.org/7",
        status: "Inactive",
        createdDate: new Date(2024, 2, 20),
        bgColor: "#F39C12",
    },
    {
        id: "8",
        name: "Rachel Green",
        email: "rachel.g@gmail.com",
        role: "Manager",
        avatar: "https://robohash.org/8",
        status: "Active",
        createdDate: new Date(2024, 3, 10),
        bgColor: "#16A085",
    },
    {
        id: "9",
        name: "John Smith",
        email: "john.s@gmail.com",
        role: "Developer",
        avatar: "https://robohash.org/9",
        status: "Active",
        createdDate: new Date(2024, 3, 15),
        bgColor: "#8E44AD",
    },
    {
        id: "10",
        name: "Emma Wilson",
        email: "emma.w@gmail.com",
        role: "Designer",
        avatar: "https://robohash.org/10",
        status: "Active",
        createdDate: new Date(2024, 3, 20),
        bgColor: "#2E86C1",
    },
    {
        id: "11",
        name: "James Lee",
        email: "james.l@gmail.com",
        role: "Manager",
        avatar: "https://robohash.org/11",
        status: "Inactive",
        createdDate: new Date(2024, 3, 25),
        bgColor: "#27AE60",
    },
    {
        id: "12",
        name: "Sophie Taylor",
        email: "sophie.t@gmail.com",
        role: "Developer",
        avatar: "https://robohash.org/12",
        status: "Active",
        createdDate: new Date(2024, 3, 30),
        bgColor: "#E74C3C",
    }
];
const People = ()=>{

    const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isInvite, setIsInvite] = useState<boolean>(false);
    // const [isCopied, setIsCopied] = useState<boolean>(false);
    const [isProfile, setIsProfile] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);


    const filterFiles = () => {
        const   filtered = User.filter((user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return filtered;
    };

    const Users:User[] = filterFiles();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setSearchOpen(false);
            }
        };

        if (isSearchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        if (isInvite) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSearchOpen, isInvite]);

    return (
        <>
            <div className="p-6 md:p-8 lg:p-10 relative lg:px-28 h-full">
                <div className="w-full flex items-center justify-between mb-6 relative">
                    <h2 className="text-xl font-semibold text-gray-800">All Peoples</h2>
                    <div
                        ref={dropdownRef}
                        onClick={() => {
                            setIsInvite(!isInvite);
                        }}
                        className="create flex items-center justify-center gap-1 border border-gray-500  px-3 py-1 rounded-md transition-colors text-[#111111] cursor-pointer"
                    >
                        <h2 className="text-md">Invite People</h2>
                    </div>


                </div>

                {/* Search Bar */}
                <div
                    onClick={() => setSearchOpen(true)}
                    className="rounded-lg mb-6 bg-white border border-gray-300 px-4 py-1.5 flex items-center justify-between cursor-text hover:shadow-md transition-shadow"
                >
                    <input
                        type="text"
                        className="w-full outline-none text-base bg-transparent placeholder:text-gray-400"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="w-5 h-5 text-gray-500" />
                </div>

                <div className={`mt-8 pb-10 flex flex-col gap-5`}>
                    {Object.entries(Users).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Users.map((user) => (
                                <div
                                    key={user.id}
                                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                                    onClick={() => setIsProfile(true)}
                                >
                                    {/* Thumbnail or Preview */}
                                    <div className="h-44 bg-gray-100 relative overflow-hidden rounded-b-md">
                                        {user.avatar ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                            src={user.avatar ? user.avatar : "/placeholder.svg"}
                                            alt={user.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                          />

                                            
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                <div
                                                    className={`w-full h-full flex items-center justify-center `}
                                                >
                                                    <div className="scale-150">
                                                        <User2Icon className="w-24 h-24 text-gray-600" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                            
                                    <div className="px-4 py-3 flex items-center justify-between bg-[#FFFFFF]">
                                        <div className={"flex items-center justify-start gap-3"}>
                                            <h3 className={"text-lg"}>{user.name}</h3>
                                            {user.status === "Active" ? (
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            ):(
                                                <div className="w-2 h-2 border-2 border-gray-500 rounded-full"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ):(
                        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-lg">No member match your search criteria</p>
                            <p className="text-sm mt-2">
                                Try adjusting your filters or search term
                            </p>
                        </div>
                    )}
                </div>

            </div>


            {isInvite && (
                // <div className=" absolute -translate-y-1/2  left-1/3 top-[50%] py-3.5 px-4 bg-[#F8F8F8] rounded-lg flex flex-col items-start justify-start w-[32rem]  border border-[#d2d1d1] shadow-lg z-10 text-[#1f1f1fe8]">
                //     <div className="flex items-center justify-between w-full">
                //         <h2 className="text-lg font-semibold mb-2">Invite People</h2>
                //         <X className="w-5 h-5 text-gray-500 cursor-pointer" onClick={() => setIsInvite(false)}/>
                //     </div>

                //     <label>To:</label>
                //     <input type={"text"} className="w-full outline-none bg-transparent border border-gray-300 rounded-md px-3 pt-1.5 pb-8 mt-2 focus:border-2 focus:border-[#B7D0E3]" placeholder="name@gmail.com"/>

                //     <div className={"mt-4"}>
                //         <h4 className={"text-sm text-gray-500"}>Invite Link:</h4>
                //         <div className={"flex items-center justify-between gap-2 mt-2 px-4"}>
                //             <h5 className={"text-blue-400 hover:underline"}>http://localhost:8000</h5>
                //             <div
                //                 onClick={() => {
                //                     navigator.clipboard.writeText("http://localhost:8000");
                //                     setIsCopied(true);
                //                     setTimeout(() => setIsCopied(false), 3000);
                //                 }}
                //                 className="cursor-pointer hover:text-gray-700"
                //             >
                //                 {isCopied ? (
                //                     <Check className="h-5 w-5 text-green-500"/>
                //                 ) : (
                //                     <Copy className="h-5 w-5"/>
                //                 )}
                //             </div>

                //         </div>
                //     </div>
                // </div>

                <InvitePeopleDialog open={isInvite} onOpenChange={() => setIsInvite(false)} />
                
            )}

            {isProfile && (
                <div className="absolute z-20 h-full w-[30%] top-0 right-0 bg-[#FFFFFF] shadow-2xl px-4 py-3.5 rounded-sm">
                    <div className="data w-full flex items-center justify-between">
                        <h2 className="text-xl font-bold">Profile</h2>
                        <X
                            onClick={() => setIsProfile(false)}
                            className="w-5 h-5"
                        />
                    </div>

                    <div className="icon w-full flex items-center justify-center mt-8">
                        <div className="w-52 h-52 bg-[#44BEDF] rounded-xl flex items-end justify-center">
                            <FaUserLarge className="w-44 h-44 text-white" />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                        <h2 className="text-xl font-bold">tanveer</h2>
                        <div className=" flex items-center justify-start gap-2 text-gray-700">
                            <Dot className="w-4 h-4" />
                            Away
                        </div>
                        <div className=" flex items-center justify-start gap-2 text-gray-700">
                            <Clock className="w-4 h-4" />
                            6:32 PM local time
                        </div>
                    </div>

                    <div className="flex items-center justify-start gap-3 mt-3">
                        <button className="flex items-center justify-center gap-1 border border-[#cccccc] rounded-lg text-gray-800 w-[85%] py-0.5 hover:bg-[#F8F8F8]">
                            <MessageCircle className="w-[18px] h-[18px] rotate-y-180" />
                            <h4 className="text-lg">Message</h4>
                        </button>
                        <button className="flex items-center justify-center gap-1 border border-[#cccccc] rounded-lg text-gray-800 px-2 py-1.5 hover:bg-[#F8F8F8]">
                            <EllipsisVertical className="w-5 h-5 text-lg" />
                        </button>
                    </div>

                    <div className="contact mt-5">
                        <h4 className="text-md font-semibold">Contact information</h4>

                        <div className="flex items-start justify-start gap-3 mt-2">
                            <div className="px-2 py-1.5 bg-[#F6F6F6] rounded-md">
                                <Mail className="text-gray-800 w-[18px] h-[18px]" />
                            </div>
                            <div className="flex flex-col items-start justify-start">
                                <h4 className="text-gray-800 text-sm">Email Address</h4>
                                <h4 className="text-[#1264A3] hover:underline">tanveer@gmail.com</h4>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default People