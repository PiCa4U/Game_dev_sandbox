import http from "http";
import express from "express";
import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { MatchRoom } from "src/rooms/MatchRoom";

const app = express();
const server = http.createServer(app);

const gameServer = new Server({ transport: new WebSocketTransport({ server }) });
gameServer.define("match", MatchRoom);

const port = Number(process.env.PORT ?? 2567);
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on ws://localhost:${port}`);
});
