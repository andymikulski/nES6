import { saveAs } from 'file-saver';

export const trace_cpu = 0;
export const trace_cpuInstructions = 1;
export const trace_ppu = 2;
export const trace_mapper = 3;
export const trace_apu = 4;
export const trace_all = 5;

const tracer = {
  lines: [],
  running: false,
  enabledTypes: (new Array(trace_all + 1)).fill(0),
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
