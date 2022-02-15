import WebSocket from "ws";
import tinyMsgpack from "tiny-msgpack";

WebSocket.prototype.sendRibbonPacket = (command, counter) => {
  ws.send(tinyMsgpack.encode(command));
}