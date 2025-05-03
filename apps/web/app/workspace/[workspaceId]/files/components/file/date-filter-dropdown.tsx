"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check, Calendar } from "lucide-react"
import type { DateFilter } from "./AllFilesList"

interface DateFilterDropdownProps {
  selectedDateFilter: DateFilter
  setDateFilter: (filter: DateFilter) => void
}

const DateFilterDropdown = ({ selectedDateFilter, setDateFilter }: DateFilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const dateFilterOptions: { value: DateFilter; label: string }[] = [
    { value: "any_time", label: "Any time" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last_7_days", label: "Last 7 days" },
    { value: "last_30_days", label: "Last 30 days" },
    { value: "last_3_months", label: "Last 3 months" },
    { value: "last_12_months", label: "Last 12 months" },
  ]

  const getSelectedLabel = () => {
    return dateFilterOptions.find((option) => option.value === selectedDateFilter)?.label || "Any time"
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
        <Calendar className="w-4 h-4" />
        <span>Date</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden animate-fadeIn">
          {dateFilterOptions.map((option) => (
            <div
              key={option.value}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors"
              onClick={() => {
                setDateFilter(option.value)
                setIsOpen(false)
              }}
            >
              <span className={selectedDateFilter === option.value ? "font-medium text-blue-600" : ""}>
                {option.label}
              </span>
              {selectedDateFilter === option.value && <Check className="w-4 h-4 text-blue-600" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DateFilterDropdown
