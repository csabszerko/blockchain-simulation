let channel;

export function getBroadcastChannelInstance(channelName) {
  if (!channel) {
    channel = new BroadcastChannel(channelName);
  }
  return channel;
}
