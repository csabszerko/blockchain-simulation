import { useEffect, useRef } from "react";
import { getBroadcastChannelInstance } from "../utils/broadcastChannel";

export function useBroadcastChannel(channelName, callback) {
  const channelRef = useRef(null);

  useEffect(() => {
    if (channelRef.current) return;
    const channel = getBroadcastChannelInstance(channelName);
    channelRef.current = channel;

    const handleMessage = (e) => {
      callback(e.data);
    };

    channel.addEventListener("message", handleMessage);

    return () => {
      channel.removeEventListener("message", handleMessage);
      channelRef.current = null;
    };
  }, [channelName, callback]);

  const broadcastMessage = (data) => {
    if (channelRef.current) {
      channelRef.current.postMessage(data);
    }
  };

  return broadcastMessage;
}
