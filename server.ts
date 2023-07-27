import express, { Express, Request, Response } from "express";
import cors from "cors";
// import { Server, Socket } from "socket.io";
// import http from "http";
import { SocketEvents, MyEmitterEvents, WorkerTaskResponse } from "./models";
import EventEmitter from "./myEmitter";
const { EventEmitterInstance: myEmitter } = EventEmitter;

import { runWorkerThread } from "./executor";

const app: Express = express();
app.use(express.json());
app.use(cors());

const http = require("http").Server(app);
const io = require("socket.io")(http);

io.on("connection", (socket: any) => {
  console.log("connected", socket.id);
  socket.emit(SocketEvents.MESSAGE, `hello ${socket.id}`);
});

myEmitter.on(
  MyEmitterEvents.THREAD_RESPONSE,
  (threadResponse: WorkerTaskResponse) => {
    console.log("an event occurred!", threadResponse.flag);
    io.to(threadResponse.clientId).emit(SocketEvents.MESSAGE, threadResponse);
  }
);

app.get("/health", function (req: Request, res: Response) {
  res.send(`Hello World! ${new Date()}`);
});

app.post("/execute", function (req: Request, res: Response) {
  const command = req.body.command;
  const clientId = req.body.id;
  runWorkerThread(command, clientId)
    .then(function (result) {
      res.status(200).send(result);
    })
    .catch(function (err) {
      res.send(err);
    });
});

const port = 4000;
http.listen(port, function () {
  console.log("listening on localhost:" + port);
});
