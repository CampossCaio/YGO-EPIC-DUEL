import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io("/", {
  autoConnect: true,
});
