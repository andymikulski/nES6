/* global Blob */
import { saveAs } from 'file-saver';

// #TODO make this an enum
export const traceCpu = 0;
export const traceCpuInstructions = 1;
export const tracePpu = 2;
export const traceMapper = 3;
export const traceApu = 4;
export const traceAll = 5;

const tracer = {
  lines: [],
  running: false,
  enabledTypes: (new Array(traceAll + 1)).fill(0),
};


export function enabled() {
  return tracer.running;
}


export function enableType(traceType, checked) {
  tracer.enabledTypes[traceType] = checked ? 1 : 0;
}


export function writeLine(traceType, line) {
  if (tracer.running) {
    if (tracer.enabledTypes[traceType] === 1) {
      tracer.lines.push(`${line}\r\n`);
    }
  }
}

export function start() {
  tracer.running = true;
}

export function stop() {
  tracer.running = false;

  // save to file
  if (tracer.lines.length > 0) {
    const blob = new Blob(tracer.lines, {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(blob, 'trace.txt');
    tracer.lines.length = 0;
  }
}
