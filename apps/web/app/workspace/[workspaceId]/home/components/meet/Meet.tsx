/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import type React from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  Settings,
  Users,
  Monitor,
  MessageSquare,
  MoreVertical,
  Grid3X3,
  Maximize2,
} from "lucide-react";

import { useSocketStore } from "@context/SocketContext";
import { selectedWorkspaceId } from "@context/workspaceContext";

// Define interfaces for the data structures
interface Peer {
  username: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  stream?: MediaStream;
}

interface Peers {
  [socketId: string]: Peer;
}

interface UserEvent {
  socketId: string;
  username: string;
}

interface ProducerEvent {
  producerId: string;
  socketId: string;
  username: string;
}

interface MediaToggleEvent {
  socketId: string;
  kind: "audio" | "video";
  enabled: boolean;
}

interface TransportInfo {
  id: string;
  iceParameters: any;
  iceCandidates: any;
  dtlsParameters: any;
}

interface ProduceResponse {
  id: string;
}

interface ConsumeResponse {
  kind: "audio" | "video";
  rtpParameters: any;
  error?: string;
}

interface PendingProducer {
  producerId: string;
  socketId: string;
}

function App() {
  const [roomId, setRoomId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [peers, setPeers] = useState<Peers>({});
  const [deviceInitialized, setDeviceInitialized] = useState<boolean>(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);
  const [mediaError, setMediaError] = useState<string>("");
  const [availableDevices, setAvailableDevices] = useState<{
    audio: boolean;
    video: boolean;
  }>({ audio: false, video: false });

  const workspaceId = selectedWorkspaceId((state) => state.value);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRefs = useRef<{ [socketId: string]: HTMLVideoElement | null }>(
    {}
  );

  const socket = useSocketStore((state) => state.socket);

  const deviceRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pendingProducers = useRef<PendingProducer[]>([]);

  // Check available devices on component mount
  useEffect(() => {
    checkAvailableDevices();
  }, []);

  const checkAvailableDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasAudio = devices.some((device) => device.kind === "audioinput");
      const hasVideo = devices.some((device) => device.kind === "videoinput");

      setAvailableDevices({ audio: hasAudio, video: hasVideo });
    } catch (error) {
      console.error("Error checking devices:", error);
    }
  };

  const getMediaWithFallback = async (): Promise<MediaStream | null> => {
    const strategies = [
      { audio: true, video: true, description: "audio + video" },
      { audio: true, video: false, description: "audio only" },
      { audio: false, video: true, description: "video only" },
    ];

    for (const strategy of strategies) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(strategy);

        const hasAudio = stream.getAudioTracks().length > 0;
        const hasVideo = stream.getVideoTracks().length > 0;

        setIsAudioEnabled(hasAudio);
        setIsVideoEnabled(hasVideo);
        setMediaError("");


        return stream;
      } catch (error: any) {
        console.warn(`Failed to get ${strategy.description}:`, error.message);

        if (error.name === "NotReadableError") {
          setMediaError(
            `Device busy - ${strategy.description} in use by another application`
          );
        } else if (error.name === "NotAllowedError") {
          setMediaError(
            "Permission denied - please allow camera/microphone access"
          );
        } else if (error.name === "NotFoundError") {
          setMediaError(`No ${strategy.description} devices found`);
        }
      }
    }

    return createFakeMediaStream();
  };

  const createFakeMediaStream = (): MediaStream => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d")!;

    const drawFrame = () => {
      const time = Date.now() / 1000;
      ctx.fillStyle = `hsl(${(time * 50) % 360}, 50%, 50%)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("FAKE VIDEO", canvas.width / 2, canvas.height / 2);
      ctx.fillText(
        `User: ${username}`,
        canvas.width / 2,
        canvas.height / 2 + 60
      );
    };

    const interval = setInterval(drawFrame, 100);
    const videoStream = canvas.captureStream(10);

    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);

    oscillator.start();

    const audioStream = audioContext.createMediaStreamDestination().stream;
    const combinedStream = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ]);

    combinedStream.addEventListener("inactive", () => {
      clearInterval(interval);
      audioContext.close();
    });

    setMediaError("Using simulated video for testing");
    setIsAudioEnabled(true);
    setIsVideoEnabled(true);

    return combinedStream;
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      //console.log("Connected to Socket.IO server");
    });

    socket.on("connect_error", (error: Error) => {
      console.error("Socket.IO connection error:", error);
    });

    socket.on("userJoined", ({ socketId, username }: UserEvent) => {
      setPeers((prev) => ({
        ...prev,
        [socketId]: { username, audioEnabled: true, videoEnabled: true },
      }));
    });

    socket.on("userDisconnected", ({ socketId }: { socketId: string }) => {
      // Enhanced cleanup for disconnected users
      setPeers((prev) => {
        const newPeers = { ...prev };

        // If the peer has a stream, stop all tracks
        if (newPeers[socketId]?.stream) {
          newPeers[socketId].stream
            ?.getTracks()
            .forEach((track) => track.stop());
        }

        // Remove the peer from the refs
        if (peerVideoRefs.current[socketId]) {
          const videoElement = peerVideoRefs.current[socketId];
          if (videoElement && videoElement.srcObject) {
            videoElement.srcObject = null;
          }
          delete peerVideoRefs.current[socketId];
        }

        // Remove the peer from state
        delete newPeers[socketId];
        return newPeers;
      });
    });

    socket.on(
      "newProducer",
      async ({ producerId, socketId, username }: ProducerEvent) => {
        setPeers((prev) => {
          if (!prev[socketId]) {
            return {
              ...prev,
              [socketId]: { username, audioEnabled: true, videoEnabled: true },
            };
          }
          return prev;
        });
        if (!deviceInitialized) {
          pendingProducers.current.push({ producerId, socketId });
        } else {
          await consumeMedia(producerId, socketId);
        }
      }
    );

    socket.on(
      "mediaToggled",
      ({ socketId, kind, enabled }: MediaToggleEvent) => {
       
        setPeers((prev) => {
          const peer = prev[socketId];
          if (!peer) return prev;
          return {
            ...prev,
            [socketId]: {
              ...peer,
              [kind === "audio" ? "audioEnabled" : "videoEnabled"]: enabled,
            },
          };
        });
      }
    );

    // Add window beforeunload event to notify server when user leaves
    const handleBeforeUnload = () => {
      if (joined && socket) {
        socket.emit("leaveRoom");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("userJoined");
      socket.off("userDisconnected");
      socket.off("newProducer");
      socket.off("mediaToggled");

      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [deviceInitialized, joined, socket]);

  useEffect(() => {
    if (joined && streamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = streamRef.current;
      localVideoRef.current.play().catch(console.error);
    }
  }, [joined]);

  useEffect(() => {
   
    Object.entries(peers).forEach(([socketId, peer]: [string, Peer]) => {
      if (peer.stream && peerVideoRefs.current[socketId]) {
        const videoElement = peerVideoRefs.current[
          socketId
        ] as HTMLVideoElement;
      

        if (videoElement.srcObject !== peer.stream) {
          videoElement.srcObject = peer.stream;
          videoElement
            .play()
            .catch((err) =>
              console.error(`Error playing video for ${socketId}:`, err)
            );
        }
      }
    });
  }, [peers, joined]);

  useEffect(() => {
    if (deviceInitialized && pendingProducers.current.length > 0) {
     
      pendingProducers.current.forEach(
        ({ producerId, socketId }: PendingProducer) => {
          consumeMedia(producerId, socketId);
        }
      );
      pendingProducers.current = [];
    }
  }, [deviceInitialized]);

  const toggleAudio = (): void => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        
        if (socket) {
          socket.emit("toggleMedia", {
            kind: "audio",
            enabled: audioTrack.enabled,
          });
        }
      }
    }
  };

  const toggleVideo = (): void => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      
        if (socket) {
          socket.emit("toggleMedia", {
            kind: "video",
            enabled: videoTrack.enabled,
          });
        }
      }
    }
  };

  const leaveRoom = () => {
   

    // Stop all local media tracks first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
       
        track.stop();
      });
    }

    // Clear local video
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    // Notify server that user is leaving BEFORE updating state
    if (socket && joined) {
      socket.emit("leaveRoom");
    
    }

    // Update local state
    setJoined(false);
    setPeers({});
    setDeviceInitialized(false);
    streamRef.current = null;

   
  };

  const joinRoom = async (): Promise<void> => {
    if (!socket) return;

    try {
      const currentRoomId = workspaceId + roomId;
     
      const rtpCapabilities = await new Promise<any>((resolve) => {
        socket.emit("joinRoom", { roomId: currentRoomId, username }, resolve);
      });
      
      const device = new (await import("mediasoup-client")).Device();
      await device.load({ routerRtpCapabilities: rtpCapabilities });
      deviceRef.current = device;
      
      setDeviceInitialized(true);

      const stream = await getMediaWithFallback();

      if (!stream) {
        throw new Error("No media stream acquired");
      }

      streamRef.current = stream;

      const videoTrack = stream.getVideoTracks()[0] || null;
      const audioTrack = stream.getAudioTracks()[0] || null;

      if (videoTrack) videoTrack.enabled = isVideoEnabled;
      if (audioTrack) audioTrack.enabled = isAudioEnabled;

     

      const transportInfo = await new Promise<TransportInfo>(
        (resolve, reject) => {
          socket.emit(
            "createTransport",
            { forProducerId: undefined },
            (response: any) => {
              if (response.error) {
                reject(new Error(response.error));
              } else {
                resolve(response);
              }
            }
          );
        }
      );
   

      const transport = device.createSendTransport(transportInfo);

      transport.on(
        "connect",
        ({ dtlsParameters }: { dtlsParameters: any }, callback: () => void) => {
         
          socket.emit(
            "connectTransport",
            { transportId: transport.id, dtlsParameters },
            callback
          );
        }
      );

      transport.on("connectionstatechange", (state: string) => {
       
        if (state === "failed") {
          console.error(`Send transport ${transport.id} failed to connect`);
        }
      });

      transport.on(
        "produce",
        async (
          { kind, rtpParameters }: { kind: string; rtpParameters: any },
          callback: (data: { id: string }) => void,
          errback: (err: Error) => void
        ) => {
          try {
            const { id } = await new Promise<ProduceResponse>((resolve) => {
              socket.emit(
                "produce",
                { transportId: transport.id, kind, rtpParameters },
                resolve
              );
            });
           
            callback({ id });
          } catch (err) {
            console.error(`Error producing ${kind}:`, err);
            errback(err as Error);
          }
        }
      );

      if (videoTrack) {
        const videoProducer = await transport.produce({ track: videoTrack });
      
      }
      if (audioTrack) {
        const audioProducer = await transport.produce({ track: audioTrack });
      
      }

      setJoined(true);
    } catch (error) {
      console.error("Error in joinRoom:", error);
      setMediaError(`Failed to join room: ${error}`);
    }
  };

  const consumeMedia = async (
    producerId: string,
    socketId: string
  ): Promise<void> => {
    try {
      if (!socket) return;
      const device = deviceRef.current;
      if (!device) {
        console.error("Device not initialized in consumeMedia");
        return;
      }

   

      const consumerTransportInfo = await new Promise<TransportInfo>(
        (resolve) => {
          socket.emit(
            "createTransport",
            { forProducerId: producerId },
            resolve
          );
        }
      );
      

      const consumerTransport = device.createRecvTransport(
        consumerTransportInfo
      );

      consumerTransport.on(
        "connect",
        (
          { dtlsParameters }: { dtlsParameters: any },
          callback: () => void,
          errback: (err: Error) => void
        ) => {
         
          socket.emit(
            "connectTransport",
            { transportId: consumerTransport.id, dtlsParameters },
            (err?: Error) => {
              if (err) {
                console.error("Error connecting consumer transport:", err);
                errback(err);
                return;
              }
              callback();
            }
          );
        }
      );

      consumerTransport.on("connectionstatechange", (state: string) => {
       
        if (state === "failed") {
          console.error(
            `Consumer transport ${consumerTransport.id} failed to connect`
          );
        }
      });

     

      const { kind, rtpParameters } = await new Promise<ConsumeResponse>(
        (resolve, reject) => {
          socket.emit(
            "consume",
            { producerId, rtpCapabilities: device.rtpCapabilities },
            (response: ConsumeResponse) => {
              if (response.error) {
                console.error("Error in consume:", response.error);
                reject(new Error(response.error));
              } else {
                resolve(response);
              }
            }
          );
        }
      );
     

      const consumer = await consumerTransport.consume({
        id: producerId,
        producerId,
        kind,
        rtpParameters,
      });

     

      // consumer.on("transportclose", () =>
      //   console.log(`Consumer ${consumer.id} transport closed`)
      // );
      // consumer.on("trackended", () =>
      //   console.log(`Track for consumer ${consumer.id} ended`)
      // );

      setPeers((prev) => {
        const existingPeer = prev[socketId] || {
          username: "",
          audioEnabled: true,
          videoEnabled: true,
        };
        const existingStream = existingPeer.stream || new MediaStream();
        existingStream.addTrack(consumer.track);

      

        return {
          ...prev,
          [socketId]: {
            username: existingPeer.username || "",
            audioEnabled: existingPeer.audioEnabled,
            videoEnabled: existingPeer.videoEnabled,
            stream: existingStream,
          },
        };
      });
    } catch (error) {
      console.error(
        `Error in consumeMedia for producer ${producerId} from ${socketId}:`,
        error
      );
    }
  };

  const peerCount = Object.keys(peers).length;
  const totalParticipants = peerCount + (joined ? 1 : 0);

  return (
    <div className="h-full bg-white overflow-y-scroll">
      {!joined ? (
        <div className="w-full bg-gradient-to-br from-[#BAB2AC] via-[#5b5755] to-slate-900 text-[#171717] h-full py-8 px-6">
          <div className="w-full h-[85vh] flex flex-col items-center justify-center">
            <div className="px-3 -space-y-0.5 py-1.5 border-t border-[#6FCF97] bg-[#304A36] flex items-center justify-center gap-2 rounded-xl">
              <Users className="w-4 h-4 fill-[#6FCF97] text-[#6FCF97]" />
              <h3 className="text-sm text-[#6FCF97]">Join Meet</h3>
            </div>

            <h2 className="text-2xl">
              Enter your details to join the video call
            </h2>

            <div className="space-y-6">
              <div className="flex flex-col">
                <label htmlFor="roomId" className="text-base font-semibold">
                  Meeting ID
                </label>
                <input
                  id="roomId"
                  type="text"
                  placeholder="Enter meeting ID"
                  value={roomId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRoomId(e.target.value)
                  }
                  className="w-96 mt-1 px-3 py-2 rounded-md text-sm bg-[#ffffff38] border border-[#D1D5DC] focus:outline-none text-[#171717]"
                />
              </div>

              <div className="mt-3 flex flex-col">
                <label htmlFor="username" className="text-base font-semibold">
                  Your Name
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                  className="w-96 mt-1 px-3 py-2 rounded-md text-sm bg-[#ffffff38] border border-[#D1D5DC] focus:outline-none text-[#171717]"
                />
              </div>

              <div className="mt-7 flex justify-center text-white">
                <button
                  onClick={joinRoom}
                  disabled={!roomId || !username}
                  className="w-[65%] bg-[#007A5A] rounded-md hover:bg-[#32947A] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 duration-200 flex items-center justify-center space-x-2"
                >
                  <Video className="w-5 h-5" />
                  <span>Join Meeting</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Modern Meeting Room UI
        <div className="h-full flex flex-col bg-gradient-to-br from-[#BAB2AC] via-[#5b5755] to-slate-900">
          {/* Modern Header */}
          <div className=" backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 flex items-center justify-between shadow-sm z-10 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-200">
                  {roomId}
                </h2>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <Users className="w-4 h-4 mr-1" />
                  {totalParticipants} participant
                  {totalParticipants !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={leaveRoom}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Phone className="w-4 h-4 rotate-[135deg]" />
                <span className="font-medium">Leave</span>
              </button>
            </div>
          </div>

          {/* Modern Video Grid */}
          <div className="flex-1 p-6 overflow-hidden">
            <div
              className={`h-full grid gap-6 ${
                totalParticipants === 1
                  ? "grid-cols-1"
                  : totalParticipants === 2
                    ? "grid-cols-2"
                    : totalParticipants <= 4
                      ? "grid-cols-2 grid-rows-2"
                      : totalParticipants <= 6
                        ? "grid-cols-3 grid-rows-2"
                        : "grid-cols-3 grid-rows-3"
              }`}
            >
              {/* Local Video - Enhanced */}
              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${!isVideoEnabled ? "hidden" : ""}`}
                  style={{ transform: "scaleX(-1)" }}
                />
                {!isVideoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-2xl font-bold text-white">
                          {username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-700/50 rounded-full backdrop-blur-sm">
                        <VideoOff className="w-6 h-6 text-slate-300" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced User Info Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium border border-white/20">
                        <span className="text-blue-300">You</span> • {username}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`p-2 rounded-lg backdrop-blur-sm border ${
                          isAudioEnabled
                            ? "bg-green-500/20 border-green-400/30 text-green-300"
                            : "bg-red-500/20 border-red-400/30 text-red-300"
                        }`}
                      >
                        {isAudioEnabled ? (
                          <Mic className="w-4 h-4" />
                        ) : (
                          <MicOff className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed hover overlay - now properly shows on hover */}
                <div className="absolute inset-0 bg-black/0 opacity-0 group-hover:bg-black/10 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  
                </div>
              </div>

              {/* Peer Videos - Enhanced */}
              {Object.entries(peers).map(([socketId, peer]: [string, Peer]) => (
                <div
                  key={socketId}
                  className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                >
                  <video
                    ref={(el: any) => (peerVideoRefs.current[socketId] = el)}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover ${!peer.videoEnabled ? "hidden" : ""}`}
                    style={{ transform: "scaleX(-1)" }}
                  />
                  {!peer.videoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <span className="text-2xl font-bold text-white">
                            {peer.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-700/50 rounded-full backdrop-blur-sm">
                          <VideoOff className="w-6 h-6 text-slate-300" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced User Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium border border-white/20">
                        {peer.username}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`p-2 rounded-lg backdrop-blur-sm border ${
                            peer.audioEnabled
                              ? "bg-green-500/20 border-green-400/30 text-green-300"
                              : "bg-red-500/20 border-red-400/30 text-red-300"
                          }`}
                        >
                          {peer.audioEnabled ? (
                            <Mic className="w-4 h-4" />
                          ) : (
                            <MicOff className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fixed hover overlay - now properly shows on hover */}
                  <div className="absolute inset-0 bg-black/0 opacity-0 group-hover:bg-black/10 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-200 transform scale-0 group-hover:scale-100">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Modern Controls - Enhanced */}
          <div className=" backdrop-blur-sm border-t border-gray-200/50 px-6 py-6 z-10">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <button
                onClick={toggleAudio}
                className={`relative p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 ${
                  isAudioEnabled
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                }`}
              >
                {isAudioEnabled ? (
                  <Mic className="w-6 h-6" />
                ) : (
                  <MicOff className="w-6 h-6" />
                )}
                <span className="sr-only">
                  {isAudioEnabled ? "Mute" : "Unmute"}
                </span>
                {isAudioEnabled && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              <button
                onClick={toggleVideo}
                className={`relative p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 ${
                  isVideoEnabled
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                }`}
              >
                {isVideoEnabled ? (
                  <Video className="w-6 h-6" />
                ) : (
                  <VideoOff className="w-6 h-6" />
                )}
                <span className="sr-only">
                  {isVideoEnabled ? "Turn off camera" : "Turn on camera"}
                </span>
                {isVideoEnabled && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </button>

             

              <div className="hidden sm:block w-px h-8 bg-gray-300 mx-2"></div>

              <button
                onClick={leaveRoom}
                className="p-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <Phone className="w-6 h-6 rotate-[135deg]" />
                <span className="sr-only">Leave meeting</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
