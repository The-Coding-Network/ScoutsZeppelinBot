import { usernameSaverEvt } from "../types";
import { updateUsername } from "../updateUsername";

export const MessageCreateUpdateUsernameEvt = usernameSaverEvt({
  event: "messageCreate",

  async listener(meta) {
    if (meta.args.message.author.bot) return;
    meta.pluginData.state.updateQueue.add(() => updateUsername(meta.pluginData, meta.args.message.author));
  },
});

export const VoiceChannelJoinUpdateUsernameEvt = usernameSaverEvt({
  event: "voiceChannelJoin",

  async listener(meta) {
    if (meta.args.member.bot) return;
    meta.pluginData.state.updateQueue.add(() => updateUsername(meta.pluginData, meta.args.member.user));
  },
});
