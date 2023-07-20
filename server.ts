import express, { Express, Request, Response } from "express";
import cors from "cors";

import { runWorkerThread } from "./executor";

const app: Express = express();
app.use(express.json());
app.use(cors());

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
app.listen(port, function () {
  console.log("listening on localhost:" + port);
});
