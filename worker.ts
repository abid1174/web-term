import { parentPort, workerData, MessagePort } from "worker_threads";
import { exec, ChildProcess } from "child_process";
import { WorkerDataType, WorkerTaskResponse, ProcessFlags } from "./models";

const dataParameter: WorkerDataType = workerData as WorkerDataType;

const process: ChildProcess = exec(
  dataParameter.command,
  (error: any, data: string) => {
    const parent = parentPort as MessagePort;
    const processResponse: WorkerTaskResponse = {
      flag: ProcessFlags.DONE.toString(),
      pid: process.pid as number,
      data: data,
      clientId: dataParameter.clientId,
    };
    parent.postMessage(processResponse);
  }
);

if (process != null && process.stdout != null) {
  process.stdout.on("data", (data: string) => {
    // console.log("ONGOING", dataParameter.clientId, data);
    const parent = parentPort as MessagePort;
    const processResponse: WorkerTaskResponse = {
      flag: ProcessFlags.ONGOING.toString(),
      pid: process.pid as number,
      data: data,
      clientId: dataParameter.clientId,
    };
    parent.postMessage(processResponse);
  });
}
