import io, { Socket } from "Socket.IO-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io("/", {});
