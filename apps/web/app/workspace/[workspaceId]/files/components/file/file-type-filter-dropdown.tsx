"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check, FileType } from "lucide-react"
import type { FileType as FileTypeEnum } from "./AllFilesList"

interface FileTypeFilterDropdownProps {
  selectedFileTypes: FileTypeEnum[]
  toggleFileType: (type: FileTypeEnum) => void
}

const FileTypeFilterDropdown = ({ selectedFileTypes, toggleFileType }: FileTypeFilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fileTypeOptions: { value: FileTypeEnum; label: string }[] = [
    { value: "list", label: "Lists" },
    { value: "canvas", label: "Canvases & Posts" },
    { value: "document", label: "Documents" },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-white  px-4 py-2 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
      >
        <FileType className="w-4 h-4" />
        <span>File type</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden animate-fadeIn">
          {fileTypeOptions.map((option) => (
            <div
              key={option.value}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
              onClick={() => toggleFileType(option.value)}
            >
              <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center bg-white">
                {selectedFileTypes.includes(option.value) && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </div>
              <span className={selectedFileTypes.includes(option.value) ? "font-medium" : ""}>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileTypeFilterDropdown
