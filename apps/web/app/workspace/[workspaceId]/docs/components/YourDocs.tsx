import {Plus, Search} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {fileTypeData} from "../../Data/FileIcon";

type FileType = "canvas" | "document" | "list";

export type ViewedDate = "today" | "yesterday" | "older";

export interface FileItem {
    id: string;
    name: string;
    type: FileType;
    viewedDate: ViewedDate;
    createdDate: Date;
    desc: string;
    sharedBy?: string;
}
const allFiles: FileItem[] = [
    {
        id: "1",
        name: "Notes Draft",
        type: "document",
        viewedDate: "yesterday",
        createdDate: new Date(2023, 3, 14),
        desc: "A design for the new project",
        sharedBy: "Tanveer Singh",
    },
    {
        id: "2",
        name: "Testing",
        type: "document",
        viewedDate: "yesterday",
        createdDate: new Date(2023, 1, 14),
        desc: "A design for the new project",
        sharedBy: "Tanveer Singh",
    },
    {
        id: "3",
        name: "CIE File",
        type: "document",
        viewedDate: "yesterday",
        createdDate: new Date(2023, 2, 14),
        desc: "A design for the new project",
        sharedBy: "Tanveer Singh",
    },
    {
        id: "4",
        name: "DSA Notes",
        type: "document",
        viewedDate: "yesterday",
        createdDate: new Date(2023, 2, 15),
        desc: "A design for the new project",
        sharedBy: "Unknown",
    },
];

interface YourDocsProps {
    onFileClick: (id: string, arg: number) => void;
}

const YourDocs = ({onFileClick}: YourDocsProps) => {
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreate, setIsCreate] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filterFiles = () => {
        return allFiles.filter((file) =>
            file.name.toLowerCase().includes(searchQuery.toLowerCase()) && file.sharedBy === "Tanveer Singh"
        );
    };

    const Files:FileItem[] = filterFiles();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setSearchOpen(false);
                setIsCreate(false);
            }
        };

        if (isSearchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        if (isCreate) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSearchOpen, isCreate]);

    return (
        <>
            <div className="p-6 md:p-8 lg:p-10 relative lg:px-28 h-full">
                <div className="w-full flex items-center justify-between mb-6 relative">
                    <h2 className="text-xl font-semibold text-gray-800">All Canvases</h2>
                    <div
                        ref={dropdownRef}
                        onClick={() => {
                            setIsCreate(!isCreate);
                        }}
                        className="create flex items-center justify-center gap-1 bg-[#007A5A] px-3 py-1 rounded-md transition-colors text-[#ffffff] hover:bg-[#007A5A]/80 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <h2 className="text-md">New</h2>
                    </div>

                    {isCreate && (
                        <div className="absolute right-0 top-[80%] py-2 bg-[#F8F8F8] rounded-lg flex flex-col items-start justify-start w-56 border border-[#d2d1d1] shadow-lg z-10 text-[#1f1f1fe8]">
                            <div className="px-5 hover:bg-[#837b73] w-full">
                                <h4>New Canvas</h4>
                            </div>
                            <div className="px-5 hover:bg-[#837b73] w-full">
                                <h4>Start From a Template</h4>
                            </div>
                        </div>
                    )}
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

                {/* file */}
                <div className="mt-4 flex flex-col gap-5">
                    {Object.entries(Files).length > 0 ? (
                        <div className="mb-6">
                            <div className="rounded-lg bg-white border border-gray-200 flex flex-col shadow-sm overflow-hidden">
                                {Files.map((file) => (
                                    <div
                                        onClick={() => onFileClick(file.id, 1)} 
                                        key={file.id}
                                        className="px-4 py-3 flex items-center gap-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
                                                fileTypeData[file.type].bg
                                            } shadow-sm`}
                                        >
                                            <div className="scale-125">
                                                {fileTypeData[file.type].icon}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 flex-grow">
                      <span className="truncate text-base font-medium text-gray-800">
                        {file.name}
                      </span>
                                            <span className="truncate text-xs text-gray-500">
                        {file.sharedBy && `Shared by ${file.sharedBy}`} ·{" "}
                                                {file.createdDate.toLocaleDateString()}
                      </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-lg">No files match your search criteria</p>
                            <p className="text-sm mt-2">
                                Try adjusting your filters or search term
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
export default YourDocs;
