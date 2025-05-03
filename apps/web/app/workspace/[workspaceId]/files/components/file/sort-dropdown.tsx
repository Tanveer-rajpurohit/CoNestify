"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import type { SortOption } from "./AllFilesList"

interface SortDropdownProps {
  selectedSortOption: SortOption
  setSortOption: (option: SortOption) => void
}

const SortDropdown = ({ selectedSortOption, setSortOption }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "recently_viewed", label: "Recently viewed" },
    { value: "newest", label: "Newest file" },
    { value: "oldest", label: "Oldest file" },
    { value: "a_to_z", label: "A to Z" },
    { value: "z_to_a", label: "Z to A" },
  ]

  const getSelectedLabel = () => {
    return sortOptions.find((option) => option.value === selectedSortOption)?.label || "Recently viewed"
  }

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
        <span>{getSelectedLabel()}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden animate-fadeIn">
          {sortOptions.map((option) => (
            <div
              key={option.value}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors"
              onClick={() => {
                setSortOption(option.value)
                setIsOpen(false)
              }}
            >
              <span className={selectedSortOption === option.value ? "font-medium text-blue-600" : ""}>
                {option.label}
              </span>
              {selectedSortOption === option.value && <Check className="w-4 h-4 text-blue-600" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SortDropdown
