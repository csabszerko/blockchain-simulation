let channel: BroadcastChannel;

export function getBroadcastChannelInstance(
  channelName: string
): BroadcastChannel {
  if (!channel) {
    channel = new BroadcastChannel(channelName);
  }
  return channel;
}
