"use client"
import React from "react"

import { useState, useEffect, useRef } from "react"
import { X, Edit, Link } from 'lucide-react'
import Image from "next/image"

interface InvitePeopleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceName?: string
}

export function InvitePeopleDialog({ open, onOpenChange, workspaceName = "testing" }: InvitePeopleDialogProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("Member")
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const selectRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onOpenChange])

  // Handle click outside to close select
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false)
      }
    }

    if (isSelectOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSelectOpen])

  // Handle ESC key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [open, onOpenChange])

  const handleSend = () => {
    // Handle invitation logic here
    console.log("Sending invitation to:", { email, role })
    onOpenChange(false)
  }

  const handleSelectRole = (selectedRole: string) => {
    setRole(selectedRole)
    setIsSelectOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-[800px] max-w-[95vw] max-h-[95vh] p-6"
      >
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Invite people to {workspaceName}</h2>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">To:</label>
            <input
              type="email"
              placeholder="name@gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="text-center text-sm text-gray-500">OR</div>

          <button className="w-full py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center gap-2">
            <Image src="" alt="Google" className="h-5 w-5" />
            Continue with Google Workspace
          </button>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Invite as:</label>
            <div className="relative" ref={selectRef}>
              <button
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-left flex items-center justify-between"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
              >
                <span>{role}</span>
                <svg
                  className={`h-5 w-5 transition-transform ${isSelectOpen ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isSelectOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  <div
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectRole("Member")}
                  >
                    Member
                  </div>
                  <div
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectRole("Admin")}
                  >
                    Admin
                  </div>
                  <div
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectRole("Guest")}
                  >
                    Guest
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-100">
            <Edit className="h-5 w-5 text-blue-500" />
            <span className="text-blue-500 text-sm font-medium">Customize your invitation</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-blue-500">
            <Link className="h-4 w-4" />
            <span onClick={()=>{
              navigator.clipboard.writeText(`https://example.com/invite/${workspaceName}`)
              alert("Invite link copied to clipboard!")
            }} className="cursor-pointer hover:underline">Copy invite link</span>
            
          </div>

          <div className="flex justify-end">
            <button
              className={`py-2 px-4 rounded-md text-white ${
                email.trim() 
                  ? "bg-blue-500 hover:bg-blue-600" 
                  : "bg-blue-300 cursor-not-allowed"
              }`}
              onClick={handleSend}
              disabled={!email.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
