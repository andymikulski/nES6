'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trace_all = exports.trace_apu = exports.trace_mapper = exports.trace_ppu = exports.trace_cpuInstructions = exports.trace_cpu = undefined;
exports.enabled = enabled;
exports.enableType = enableType;
exports.writeLine = writeLine;
exports.start = start;
exports.stop = stop;

var _fileSaver = require('file-saver');

var trace_cpu = exports.trace_cpu = 0;
var trace_cpuInstructions = exports.trace_cpuInstructions = 1;
var trace_ppu = exports.trace_ppu = 2;
var trace_mapper = exports.trace_mapper = 3;
var trace_apu = exports.trace_apu = 4;
var trace_all = exports.trace_all = 5;

var tracer = {
  lines: [],
  running: false,
  enabledTypes: new Array(trace_all + 1).fill(0)
};

function enabled() {
  return tracer.running;
}

function enableType(traceType, checked) {
  tracer.enabledTypes[traceType] = checked ? 1 : 0;
}

function writeLine(traceType, line) {
  if (tracer.running) {
    if (tracer.enabledTypes[traceType] === 1) {
      tracer.lines.push(line + '\r\n');
    }
  }
}

function start() {
  tracer.running = true;
}

function stop() {
  tracer.running = false;

  // save to file
  if (tracer.lines.length > 0) {
    var blob = new Blob(tracer.lines, {
      type: "text/plain;charset=utf-8"
    });
    (0, _fileSaver.saveAs)(blob, "trace.txt");
    tracer.lines.length = 0;
  }
}