/* eslint-disable @next/next/no-img-element */
"use client"
import React from "react"
import { useState, useEffect, useRef } from "react"
import { X } from 'lucide-react'

interface AddChannelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddChannelDialog({ open, onOpenChange }: AddChannelDialogProps) {
  const [channelName, setChannelName] = useState("")
  const [visibility, setVisibility] = useState("public")
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close
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

  const handleSubmit = () => {
    // Handle channel creation logic here
    console.log("Creating channel:", { channelName, visibility })
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg overflow-hidden w-[1180px] max-w-[95vw] max-h-[95vh] flex"
      >
        {/* Left side - Form */}
        <div className="w-[39%] p-6">
          <div className="mb-4">
            <div className="flex items-center">
              <button 
                className="mr-2 text-gray-500 hover:text-gray-700" 
                onClick={() => onOpenChange(false)}
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold">Channel details</h2>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="channel-name" className="block text-sm font-medium">
                Channel name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">#</span>
                <input
                  id="channel-name"
                  type="text"
                  placeholder="e.g. plan-budget"
                  className="w-full px-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                />
                <span className="absolute right-3 top-2.5 text-gray-500 text-sm">{80 - channelName.length}</span>
              </div>
              <p className="text-sm text-gray-500">
                Channels are where conversations happen around a topic. Use a name that is easy to find and
                understand.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Visibility</label>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="public"
                    name="visibility"
                    value="public"
                    checked={visibility === "public"}
                    onChange={() => setVisibility("public")}
                    className="mt-1"
                  />
                  <div className="grid gap-1">
                    <label htmlFor="public" className="font-medium">
                      Public — anyone in testing
                    </label>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="private"
                    name="visibility"
                    value="private"
                    checked={visibility === "private"}
                    onChange={() => setVisibility("private")}
                    className="mt-1"
                  />
                  <div className="grid gap-1">
                    <label htmlFor="private" className="font-medium">
                      Private — only specific people
                    </label>
                    <p className="text-sm text-gray-500">Can only be viewed or joined by invitation</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              className={`w-full py-2 px-4 rounded-md text-white ${
                channelName.trim() 
                  ? "bg-blue-500 hover:bg-blue-600" 
                  : "bg-blue-300 cursor-not-allowed"
              }`}
              onClick={handleSubmit}
              disabled={!channelName.trim()}
            >
              Create
            </button>
          </div>
        </div>

        {/* Right side - Preview */}
        <div className="w-[61%] bg-purple-50 p-6 flex flex-col">
          <div className="flex justify-between mb-4">
            <div></div>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 flex-1">
                <img src={"/channelPlaceHolder.png"} alt="img" className="w-full h-full object-contain"/>
          </div>
        </div>
      </div>
    </div>
  )
}
