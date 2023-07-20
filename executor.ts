import { Worker } from "worker_threads";
import { ThreadEvents, WorkerDataType, WorkerTaskResponse } from "./models";

export const runWorkerThread = (command: string, clientId: string) => {
//   console.log(command, clientId);
  return new Promise((resolve, reject) => {
    const data: WorkerDataType = {
      command,
      clientId,
    };

    const worker = new Worker("./worker.js", { workerData: data });
    worker.on(ThreadEvents.MESSAGE, (threadResponse: WorkerTaskResponse) => {
      console.log("resolving", threadResponse.flag);
      //   myEmitter.emit(MyEmitterEvents.THREAD_RESPONSE, threadResponse);
      resolve(threadResponse);
    });

    worker.on("error", (err) => reject(err));
  });
};
