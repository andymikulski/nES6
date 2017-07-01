const instructions_TRACE = [];
const formatData = { programCounter: 0, opcode: 0, opcodeParam: 0, operationParam: 0, regs: {} };

function BRK_NONE_0_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 0;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
	// dummy read of opcode after brk
  memory.read8(cpu.getPC());
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  memory.write8(0x100 + cpu.regS, ((cpu.getPC() >> 8)) & 0xFF);
  if (cpu.regS === 0) {
    cpu.regS = 0xFF;
  } else {
    cpu.regS--;
  }
  cpu.incrementSubcycle();
  memory.write8(0x100 + cpu.regS, (cpu.programCounter) & 0xFF);
  if (cpu.regS === 0) {
    cpu.regS = 0xFF;
  } else {
    cpu.regS--;
  }
  cpu.incrementSubcycle();
  memory.write8(0x100 + cpu.regS, ((cpu.statusRegToByte() | 0x30)) & 0xFF);
  if (cpu.regS === 0) {
    cpu.regS = 0xFF;
  } else {
    cpu.regS--;
  }
  cpu.setPC(cpu.read16FromMemNoWrap(CPU_IRQ_ADDRESS));
  cpu.setInterrupt(true);
  return cyclesTaken;
}
instructions_TRACE[0] = BRK_NONE_0_TRACE;
function ORA_INDIRECTX_1_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 1;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA |= operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[1] = ORA_INDIRECTX_1_TRACE;
function HLT_NONE_2_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 2;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions_TRACE[2] = HLT_NONE_2_TRACE;
function ASO_INDIRECTX_3_TRACE(cpu, memory) {
  const cyclesTaken = 8;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 3;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x80) > 0);
  const result = (operationModeData << 1) & 0xFF;
  cpu.regA |= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[3] = ASO_INDIRECTX_3_TRACE;
function SKB_ZEROPAGE_4_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 4;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[4] = SKB_ZEROPAGE_4_TRACE;
function ORA_ZEROPAGE_5_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 5;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA |= operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[5] = ORA_ZEROPAGE_5_TRACE;
function ASL_ZEROPAGE_6_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 6;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x80) > 0);
  const result = ((operationModeData & 0xFF) << 1) & 0xFF;
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[6] = ASL_ZEROPAGE_6_TRACE;
function ASO_ZEROPAGE_7_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 7;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x80) > 0);
  const result = (operationModeData << 1) & 0xFF;
  cpu.regA |= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[7] = ASO_ZEROPAGE_7_TRACE;
function PHP_NONE_8_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 8;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  memory.write8(0x100 + cpu.regS, ((cpu.statusRegToByte() | 0x10)) & 0xFF);
  if (cpu.regS === 0) {
    cpu.regS = 0xFF;
  } else {
    cpu.regS--;
  }
  return cyclesTaken;
}
instructions_TRACE[8] = PHP_NONE_8_TRACE;
function ORA_IMMEDIATE_9_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 9;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA |= readInValue & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[9] = ORA_IMMEDIATE_9_TRACE;
function ASL_ACCUMULATOR_10_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 10;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.regA;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.setCarry((readInValue & 0x80) > 0);
  const result = ((readInValue & 0xFF) << 1) & 0xFF;
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.regA = result & 0xFF;
  return cyclesTaken;
}
instructions_TRACE[10] = ASL_ACCUMULATOR_10_TRACE;
function ANC_IMMEDIATE_11_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 11;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA &= readInValue;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.setCarry(cpu.getSign());
  return cyclesTaken;
}
instructions_TRACE[11] = ANC_IMMEDIATE_11_TRACE;
function SKW_ABSOLUTE_12_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 12;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[12] = SKW_ABSOLUTE_12_TRACE;
function ORA_ABSOLUTE_13_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 13;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA |= operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[13] = ORA_ABSOLUTE_13_TRACE;
function ASL_ABSOLUTE_14_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 14;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x80) > 0);
  const result = ((operationModeData & 0xFF) << 1) & 0xFF;
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[14] = ASL_ABSOLUTE_14_TRACE;
function ASO_ABSOLUTE_15_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 15;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x80) > 0);
  const result = (operationModeData << 1) & 0xFF;
  cpu.regA |= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[15] = ASO_ABSOLUTE_15_TRACE;
function BPL_RELATIVE_16_TRACE(cpu, memory) {
  let cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 16;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
  formatData.opcodeParam = address;
  formatData.operationParam = (readInValue + 2) & 0xFFFF;
  const branchTaken = !cpu.getSign();
  if (branchTaken) {
    cpu.incrementSubcycle();
    if ((((cpu.getPC() + 2) & 0xff00) !== (((readInValue + 2)) & 0xff00))) {
      cyclesTaken += 1;
      cpu.incrementSubcycle();
    }
    cyclesTaken += 1;
    cpu.incrementSubcycle();
    cpu.setPC((readInValue + 2) & 0xFFFF);
  } else {
    cpu.incrementSubcycle();
    memory.read8((cpu.getPC() + 1) & 0xFFFF);
    cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  }
  return cyclesTaken;
}
instructions_TRACE[16] = BPL_RELATIVE_16_TRACE;
function ORA_INDIRECTY_17_TRACE(cpu, memory) {
  let cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 17;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA |= operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[17] = ORA_INDIRECTY_17_TRACE;
function HLT_NONE_18_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 18;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions_TRACE[18] = HLT_NONE_18_TRACE;
function ASO_INDIRECTY_19_TRACE(cpu, memory) {
  const cyclesTaken = 8;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 19;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x80) > 0);
  const result = (operationModeData << 1) & 0xFF;
  cpu.regA |= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[19] = ASO_INDIRECTY_19_TRACE;
function SKB_ZEROPAGEX_20_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 20;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[20] = SKB_ZEROPAGEX_20_TRACE;
function ORA_ZEROPAGEX_21_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 21;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA |= operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[21] = ORA_ZEROPAGEX_21_TRACE;
function ASL_ZEROPAGEX_22_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 22;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x80) > 0);
  const result = ((operationModeData & 0xFF) << 1) & 0xFF;
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[22] = ASL_ZEROPAGEX_22_TRACE;
function ASO_ZEROPAGEX_23_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 23;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x80) > 0);
  const result = (operationModeData << 1) & 0xFF;
  cpu.regA |= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[23] = ASO_ZEROPAGEX_23_TRACE;
function CLC_NONE_24_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 24;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.setCarry(false);
  return cyclesTaken;
}
instructions_TRACE[24] = CLC_NONE_24_TRACE;
function ORA_ABSOLUTEY_25_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 25;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA |= operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[25] = ORA_ABSOLUTEY_25_TRACE;
function NOP_NONE_26_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 26;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  return cyclesTaken;
}
instructions_TRACE[26] = NOP_NONE_26_TRACE;
function ASO_ABSOLUTEY_27_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 27;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x80) > 0);
  const result = (operationModeData << 1) & 0xFF;
  cpu.regA |= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[27] = ASO_ABSOLUTEY_27_TRACE;
function SKW_ABSOLUTEX_28_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 28;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[28] = SKW_ABSOLUTEX_28_TRACE;
function ORA_ABSOLUTEX_29_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 29;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA |= operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[29] = ORA_ABSOLUTEX_29_TRACE;
function ASL_ABSOLUTEX_30_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 30;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x80) > 0);
  const result = ((operationModeData & 0xFF) << 1) & 0xFF;
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[30] = ASL_ABSOLUTEX_30_TRACE;
function ASO_ABSOLUTEX_31_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 31;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x80) > 0);
  const result = (operationModeData << 1) & 0xFF;
  cpu.regA |= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[31] = ASO_ABSOLUTEX_31_TRACE;
function JSR_IMMEDIATE16_32_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 32;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  let result = cpu.getPC() - 1;
  if (result < 0) { result = 0xFFFF; }
  cpu.incrementSubcycle();
  memory.write8(0x100 + cpu.regS, ((result >> 8)) & 0xFF);
  if (cpu.regS === 0) {
    cpu.regS = 0xFF;
  } else {
    cpu.regS--;
  }
  cpu.incrementSubcycle();
  memory.write8(0x100 + cpu.regS, (result) & 0xFF);
  if (cpu.regS === 0) {
    cpu.regS = 0xFF;
  } else {
    cpu.regS--;
  }
  cpu.incrementSubcycle();
  cpu.setPC((readInValue) & 0xFFFF);
  return cyclesTaken;
}
instructions_TRACE[32] = JSR_IMMEDIATE16_32_TRACE;
function AND_INDIRECTX_33_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 33;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA &= (operationModeData & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[33] = AND_INDIRECTX_33_TRACE;
function HLT_NONE_34_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 34;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions_TRACE[34] = HLT_NONE_34_TRACE;
function RLA_INDIRECTX_35_TRACE(cpu, memory) {
  const cyclesTaken = 8;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 35;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = (operationModeData << 1) | (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(result > 0xFF);
  result &= 0xff;
  cpu.regA &= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[35] = RLA_INDIRECTX_35_TRACE;
function BIT_ZEROPAGE_36_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 36;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  if ((readInValue & 0xE007) === 0x2002) { cpu.mainboard.ppu.bitOperationHappening(); } // BIT 2002 optimisation
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.setSign(((operationModeData & 0xFF) & 0x80) > 0);
  cpu.setZero((cpu.regA & (operationModeData & 0xFF) & 0xFF) === 0);
  cpu.setOverflow((operationModeData & 0x40) > 0);	// Copy bit 6 to OVERFLOW flag.
  return cyclesTaken;
}
instructions_TRACE[36] = BIT_ZEROPAGE_36_TRACE;
function AND_ZEROPAGE_37_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 37;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA &= (operationModeData & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[37] = AND_ZEROPAGE_37_TRACE;
function ROL_ZEROPAGE_38_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 38;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = ((operationModeData & 0xFF) << 1) | (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(result > 0xFF);
  result &= 0xff;
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[38] = ROL_ZEROPAGE_38_TRACE;
function RLA_ZEROPAGE_39_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 39;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = (operationModeData << 1) | (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(result > 0xFF);
  result &= 0xff;
  cpu.regA &= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[39] = RLA_ZEROPAGE_39_TRACE;
function PLP_NONE_40_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 40;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.waitOneInstructionAfterCli = cpu.getInterrupt() === true;
  cpu.incrementSubcycle();
  memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  if (cpu.regS === 0xFF) {
    cpu.regS = 0;
  } else {
    cpu.regS++;
  }
  cpu.incrementSubcycle();
  const temp = memory.read8(0x100 + cpu.regS);
  cpu.statusRegFromByte(temp);
  cpu.setBreak(true); // TODO: this was true before in original port, put it back for some reason?
  cpu.setUnused(true);
  if (cpu.waitOneInstructionAfterCli) { cpu.waitOneInstructionAfterCli = cpu.getInterrupt() === false; }
  return cyclesTaken;
}
instructions_TRACE[40] = PLP_NONE_40_TRACE;
function AND_IMMEDIATE_41_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 41;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA &= (readInValue & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[41] = AND_IMMEDIATE_41_TRACE;
function ROL_ACCUMULATOR_42_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 42;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.regA;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  let result = ((readInValue & 0xFF) << 1) | (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(result > 0xFF);
  result &= 0xff;
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.regA = result & 0xFF;
  return cyclesTaken;
}
instructions_TRACE[42] = ROL_ACCUMULATOR_42_TRACE;
function ANC_IMMEDIATE_43_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 43;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA &= readInValue;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.setCarry(cpu.getSign());
  return cyclesTaken;
}
instructions_TRACE[43] = ANC_IMMEDIATE_43_TRACE;
function BIT_ABSOLUTE_44_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 44;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  if ((readInValue & 0xE007) === 0x2002) { cpu.mainboard.ppu.bitOperationHappening(); } // BIT 2002 optimisation
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.setSign(((operationModeData & 0xFF) & 0x80) > 0);
  cpu.setZero((cpu.regA & (operationModeData & 0xFF) & 0xFF) === 0);
  cpu.setOverflow((operationModeData & 0x40) > 0);	// Copy bit 6 to OVERFLOW flag.
  return cyclesTaken;
}
instructions_TRACE[44] = BIT_ABSOLUTE_44_TRACE;
function AND_ABSOLUTE_45_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 45;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA &= (operationModeData & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[45] = AND_ABSOLUTE_45_TRACE;
function ROL_ABSOLUTE_46_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 46;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = ((operationModeData & 0xFF) << 1) | (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(result > 0xFF);
  result &= 0xff;
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[46] = ROL_ABSOLUTE_46_TRACE;
function RLA_ABSOLUTE_47_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 47;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = (operationModeData << 1) | (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(result > 0xFF);
  result &= 0xff;
  cpu.regA &= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[47] = RLA_ABSOLUTE_47_TRACE;
function BMI_RELATIVE_48_TRACE(cpu, memory) {
  let cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 48;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
  formatData.opcodeParam = address;
  formatData.operationParam = (readInValue + 2) & 0xFFFF;
  const branchTaken = cpu.getSign();
  if (branchTaken) {
    cpu.incrementSubcycle();
    if ((((cpu.getPC() + 2) & 0xff00) !== (((readInValue + 2)) & 0xff00))) {
      cyclesTaken += 1;
      cpu.incrementSubcycle();
    }
    cyclesTaken += 1;
    cpu.incrementSubcycle();
    cpu.setPC((readInValue + 2) & 0xFFFF);
  } else {
    cpu.incrementSubcycle();
    memory.read8((cpu.getPC() + 1) & 0xFFFF);
    cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  }
  return cyclesTaken;
}
instructions_TRACE[48] = BMI_RELATIVE_48_TRACE;
function AND_INDIRECTY_49_TRACE(cpu, memory) {
  let cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 49;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA &= (operationModeData & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[49] = AND_INDIRECTY_49_TRACE;
function HLT_NONE_50_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 50;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions_TRACE[50] = HLT_NONE_50_TRACE;
function RLA_INDIRECTY_51_TRACE(cpu, memory) {
  const cyclesTaken = 8;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 51;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = (operationModeData << 1) | (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(result > 0xFF);
  result &= 0xff;
  cpu.regA &= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[51] = RLA_INDIRECTY_51_TRACE;
function SKB_ZEROPAGEX_52_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 52;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[52] = SKB_ZEROPAGEX_52_TRACE;
function AND_ZEROPAGEX_53_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 53;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA &= (operationModeData & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[53] = AND_ZEROPAGEX_53_TRACE;
function ROL_ZEROPAGEX_54_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 54;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = ((operationModeData & 0xFF) << 1) | (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(result > 0xFF);
  result &= 0xff;
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[54] = ROL_ZEROPAGEX_54_TRACE;
function RLA_ZEROPAGEX_55_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 55;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = (operationModeData << 1) | (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(result > 0xFF);
  result &= 0xff;
  cpu.regA &= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[55] = RLA_ZEROPAGEX_55_TRACE;
function SEC_NONE_56_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 56;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.setCarry(true);
  return cyclesTaken;
}
instructions_TRACE[56] = SEC_NONE_56_TRACE;
function AND_ABSOLUTEY_57_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 57;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA &= (operationModeData & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[57] = AND_ABSOLUTEY_57_TRACE;
function NOP_NONE_58_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 58;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  return cyclesTaken;
}
instructions_TRACE[58] = NOP_NONE_58_TRACE;
function RLA_ABSOLUTEY_59_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 59;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = (operationModeData << 1) | (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(result > 0xFF);
  result &= 0xff;
  cpu.regA &= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[59] = RLA_ABSOLUTEY_59_TRACE;
function SKW_ABSOLUTEX_60_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 60;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[60] = SKW_ABSOLUTEX_60_TRACE;
function AND_ABSOLUTEX_61_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 61;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA &= (operationModeData & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[61] = AND_ABSOLUTEX_61_TRACE;
function ROL_ABSOLUTEX_62_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 62;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = ((operationModeData & 0xFF) << 1) | (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(result > 0xFF);
  result &= 0xff;
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[62] = ROL_ABSOLUTEX_62_TRACE;
function RLA_ABSOLUTEX_63_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 63;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = (operationModeData << 1) | (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(result > 0xFF);
  result &= 0xff;
  cpu.regA &= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[63] = RLA_ABSOLUTEX_63_TRACE;
function RTI_NONE_64_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 64;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
	// dummy read
  cpu.incrementSubcycle();
  memory.read8(cpu.getPC());
  cpu.incrementSubcycle();
  if (cpu.regS === 0xFF) {
    cpu.regS = 0;
  } else {
    cpu.regS++;
  }
  cpu.incrementSubcycle();
  let temp = memory.read8(0x100 + cpu.regS);
  cpu.statusRegFromByte(temp);
  if (cpu.regS === 0xFF) {
    cpu.regS = 0;
  } else {
    cpu.regS++;
  }
  cpu.incrementSubcycle();
  cpu.programCounter = memory.read8(0x100 + cpu.regS);
  if (cpu.regS === 0xFF) {
    cpu.regS = 0;
  } else {
    cpu.regS++;
  }
  cpu.incrementSubcycle();
  temp = memory.read8(0x100 + cpu.regS);
  cpu.programCounter |= (temp & 0xFF) << 8;
  cpu.setBreak(true);
  cpu.setUnused(true);
  return cyclesTaken;
}
instructions_TRACE[64] = RTI_NONE_64_TRACE;
function EOR_INDIRECTX_65_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 65;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = (cpu.regA ^ (operationModeData & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[65] = EOR_INDIRECTX_65_TRACE;
function HLT_NONE_66_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 66;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions_TRACE[66] = HLT_NONE_66_TRACE;
function LSE_INDIRECTX_67_TRACE(cpu, memory) {
  const cyclesTaken = 8;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 67;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x01) > 0);
  const result = (operationModeData >> 1) & 0xFF;
  cpu.regA ^= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[67] = LSE_INDIRECTX_67_TRACE;
function SKB_ZEROPAGE_68_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 68;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[68] = SKB_ZEROPAGE_68_TRACE;
function EOR_ZEROPAGE_69_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 69;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = (cpu.regA ^ (operationModeData & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[69] = EOR_ZEROPAGE_69_TRACE;
function LSR_ZEROPAGE_70_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 70;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x01) > 0);
  const result = (operationModeData & 0xFF) >> 1;
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[70] = LSR_ZEROPAGE_70_TRACE;
function LSE_ZEROPAGE_71_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 71;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x01) > 0);
  const result = (operationModeData >> 1) & 0xFF;
  cpu.regA ^= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[71] = LSE_ZEROPAGE_71_TRACE;
function PHA_NONE_72_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 72;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  memory.write8(0x100 + cpu.regS, (cpu.regA) & 0xFF);
  if (cpu.regS === 0) {
    cpu.regS = 0xFF;
  } else {
    cpu.regS--;
  }
  return cyclesTaken;
}
instructions_TRACE[72] = PHA_NONE_72_TRACE;
function EOR_IMMEDIATE_73_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 73;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA = (cpu.regA ^ (readInValue & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[73] = EOR_IMMEDIATE_73_TRACE;
function LSR_ACCUMULATOR_74_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 74;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.regA;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.setCarry((readInValue & 0x01) > 0);
  const result = (readInValue & 0xFF) >> 1;
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.regA = result & 0xFF;
  return cyclesTaken;
}
instructions_TRACE[74] = LSR_ACCUMULATOR_74_TRACE;
function ALR_IMMEDIATE_75_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 75;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA &= readInValue;
  cpu.setCarry((cpu.regA & 0x01) > 0);
  cpu.regA = (cpu.regA >> 1) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[75] = ALR_IMMEDIATE_75_TRACE;
function JMP_IMMEDIATE16_76_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 76;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.setPC((readInValue) & 0xFFFF);
  return cyclesTaken;
}
instructions_TRACE[76] = JMP_IMMEDIATE16_76_TRACE;
function EOR_ABSOLUTE_77_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 77;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = (cpu.regA ^ (operationModeData & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[77] = EOR_ABSOLUTE_77_TRACE;
function LSR_ABSOLUTE_78_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 78;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x01) > 0);
  const result = (operationModeData & 0xFF) >> 1;
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[78] = LSR_ABSOLUTE_78_TRACE;
function LSE_ABSOLUTE_79_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 79;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x01) > 0);
  const result = (operationModeData >> 1) & 0xFF;
  cpu.regA ^= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[79] = LSE_ABSOLUTE_79_TRACE;
function BVC_RELATIVE_80_TRACE(cpu, memory) {
  let cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 80;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
  formatData.opcodeParam = address;
  formatData.operationParam = (readInValue + 2) & 0xFFFF;
  const branchTaken = !cpu.getOverflow();
  if (branchTaken) {
    cpu.incrementSubcycle();
    if ((((cpu.getPC() + 2) & 0xff00) !== (((readInValue + 2)) & 0xff00))) {
      cyclesTaken += 1;
      cpu.incrementSubcycle();
    }
    cyclesTaken += 1;
    cpu.incrementSubcycle();
    cpu.setPC((readInValue + 2) & 0xFFFF);
  } else {
    cpu.incrementSubcycle();
    memory.read8((cpu.getPC() + 1) & 0xFFFF);
    cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  }
  return cyclesTaken;
}
instructions_TRACE[80] = BVC_RELATIVE_80_TRACE;
function EOR_INDIRECTY_81_TRACE(cpu, memory) {
  let cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 81;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = (cpu.regA ^ (operationModeData & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[81] = EOR_INDIRECTY_81_TRACE;
function HLT_NONE_82_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 82;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions_TRACE[82] = HLT_NONE_82_TRACE;
function LSE_INDIRECTY_83_TRACE(cpu, memory) {
  const cyclesTaken = 8;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 83;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x01) > 0);
  const result = (operationModeData >> 1) & 0xFF;
  cpu.regA ^= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[83] = LSE_INDIRECTY_83_TRACE;
function SKB_ZEROPAGEX_84_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 84;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[84] = SKB_ZEROPAGEX_84_TRACE;
function EOR_ZEROPAGEX_85_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 85;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = (cpu.regA ^ (operationModeData & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[85] = EOR_ZEROPAGEX_85_TRACE;
function LSR_ZEROPAGEX_86_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 86;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x01) > 0);
  const result = (operationModeData & 0xFF) >> 1;
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[86] = LSR_ZEROPAGEX_86_TRACE;
function LSE_ZEROPAGEX_87_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 87;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x01) > 0);
  const result = (operationModeData >> 1) & 0xFF;
  cpu.regA ^= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[87] = LSE_ZEROPAGEX_87_TRACE;
function CLI_NONE_88_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 88;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.waitOneInstructionAfterCli = cpu.getInterrupt() === true;
  cpu.setInterrupt(false);
  return cyclesTaken;
}
instructions_TRACE[88] = CLI_NONE_88_TRACE;
function EOR_ABSOLUTEY_89_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 89;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = (cpu.regA ^ (operationModeData & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[89] = EOR_ABSOLUTEY_89_TRACE;
function NOP_NONE_90_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 90;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  return cyclesTaken;
}
instructions_TRACE[90] = NOP_NONE_90_TRACE;
function LSE_ABSOLUTEY_91_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 91;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x01) > 0);
  const result = (operationModeData >> 1) & 0xFF;
  cpu.regA ^= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[91] = LSE_ABSOLUTEY_91_TRACE;
function SKW_ABSOLUTEX_92_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 92;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[92] = SKW_ABSOLUTEX_92_TRACE;
function EOR_ABSOLUTEX_93_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 93;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = (cpu.regA ^ (operationModeData & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[93] = EOR_ABSOLUTEX_93_TRACE;
function LSR_ABSOLUTEX_94_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 94;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x01) > 0);
  const result = (operationModeData & 0xFF) >> 1;
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[94] = LSR_ABSOLUTEX_94_TRACE;
function LSE_ABSOLUTEX_95_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 95;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  cpu.setCarry((operationModeData & 0x01) > 0);
  const result = (operationModeData >> 1) & 0xFF;
  cpu.regA ^= result;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[95] = LSE_ABSOLUTEX_95_TRACE;
function RTS_NONE_96_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 96;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
	// dummy read
  cpu.incrementSubcycle();
  memory.read8(cpu.getPC());
  cpu.incrementSubcycle();
  if (cpu.regS === 0xFF) {
    cpu.regS = 0;
  } else {
    cpu.regS++;
  }
  cpu.incrementSubcycle();
  cpu.programCounter = memory.read8(0x100 + cpu.regS);
  if (cpu.regS === 0xFF) {
    cpu.regS = 0;
  } else {
    cpu.regS++;
  }
  cpu.incrementSubcycle();
  const temp = memory.read8(0x100 + cpu.regS);
  cpu.programCounter |= (temp & 0xFF) << 8;
  cpu.incrementSubcycle();
  cpu.programCounter = (cpu.getPC() + 1) & 0xFFFF;
  return cyclesTaken;
}
instructions_TRACE[96] = RTS_NONE_96_TRACE;
function ADC_INDIRECTX_97_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 97;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions_TRACE[97] = ADC_INDIRECTX_97_TRACE;
function HLT_NONE_98_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 98;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions_TRACE[98] = HLT_NONE_98_TRACE;
function RRA_INDIRECTX_99_TRACE(cpu, memory) {
  const cyclesTaken = 8;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 99;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = (operationModeData >> 1) | (cpu.getCarry() ? 0x80 : 0);
  cpu.setCarry((operationModeData & 0x1) > 0);
  const temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (result ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  result &= 0xFF;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[99] = RRA_INDIRECTX_99_TRACE;
function SKB_ZEROPAGE_100_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 100;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[100] = SKB_ZEROPAGE_100_TRACE;
function ADC_ZEROPAGE_101_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 101;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions_TRACE[101] = ADC_ZEROPAGE_101_TRACE;
function ROR_ZEROPAGE_102_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 102;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  const result = ((operationModeData & 0xFF) >> 1) | (cpu.getCarry() ? 0x80 : 0);
  cpu.setCarry(operationModeData & 0x1);
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[102] = ROR_ZEROPAGE_102_TRACE;
function RRA_ZEROPAGE_103_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 103;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = (operationModeData >> 1) | (cpu.getCarry() ? 0x80 : 0);
  cpu.setCarry((operationModeData & 0x1) > 0);
  const temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (result ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  result &= 0xFF;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[103] = RRA_ZEROPAGE_103_TRACE;
function PLA_NONE_104_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 104;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  if (cpu.regS === 0xFF) {
    cpu.regS = 0;
  } else {
    cpu.regS++;
  }
  cpu.incrementSubcycle();
  cpu.regA = memory.read8(0x100 + cpu.regS);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[104] = PLA_NONE_104_TRACE;
function ADC_IMMEDIATE_105_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 105;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const temp = (readInValue & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (readInValue ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions_TRACE[105] = ADC_IMMEDIATE_105_TRACE;
function ROR_ACCUMULATOR_106_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 106;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.regA;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  const result = ((readInValue & 0xFF) >> 1) | (cpu.getCarry() ? 0x80 : 0);
  cpu.setCarry(readInValue & 0x1);
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.regA = result & 0xFF;
  return cyclesTaken;
}
instructions_TRACE[106] = ROR_ACCUMULATOR_106_TRACE;
function ARR_IMMEDIATE_107_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 107;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA &= readInValue & 0xFF;
  cpu.regA = ((cpu.regA >> 1) & 0xFF) | (cpu.getCarry() ? 0x80 : 0);
  cpu.setCarry((cpu.regA & 0x1) > 0);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.setOverflow(false);
  cpu.setCarry(false);
  switch (cpu.regA & 0x60)	{
    case 0x20: cpu.setOverflow(true); break;
    case 0x40: cpu.setOverflow(true);
      cpu.setCarry(true); break;
    case 0x60: cpu.setCarry(true); break;
  }
  return cyclesTaken;
}
instructions_TRACE[107] = ARR_IMMEDIATE_107_TRACE;
function JMP_INDIRECT_108_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 108;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.setPC((readInValue) & 0xFFFF);
  return cyclesTaken;
}
instructions_TRACE[108] = JMP_INDIRECT_108_TRACE;
function ADC_ABSOLUTE_109_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 109;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions_TRACE[109] = ADC_ABSOLUTE_109_TRACE;
function ROR_ABSOLUTE_110_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 110;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  const result = ((operationModeData & 0xFF) >> 1) | (cpu.getCarry() ? 0x80 : 0);
  cpu.setCarry(operationModeData & 0x1);
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[110] = ROR_ABSOLUTE_110_TRACE;
function RRA_ABSOLUTE_111_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 111;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = (operationModeData >> 1) | (cpu.getCarry() ? 0x80 : 0);
  cpu.setCarry((operationModeData & 0x1) > 0);
  const temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (result ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  result &= 0xFF;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[111] = RRA_ABSOLUTE_111_TRACE;
function BVS_RELATIVE_112_TRACE(cpu, memory) {
  let cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 112;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
  formatData.opcodeParam = address;
  formatData.operationParam = (readInValue + 2) & 0xFFFF;
  const branchTaken = cpu.getOverflow();
  if (branchTaken) {
    cpu.incrementSubcycle();
    if ((((cpu.getPC() + 2) & 0xff00) !== (((readInValue + 2)) & 0xff00))) {
      cyclesTaken += 1;
      cpu.incrementSubcycle();
    }
    cyclesTaken += 1;
    cpu.incrementSubcycle();
    cpu.setPC((readInValue + 2) & 0xFFFF);
  } else {
    cpu.incrementSubcycle();
    memory.read8((cpu.getPC() + 1) & 0xFFFF);
    cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  }
  return cyclesTaken;
}
instructions_TRACE[112] = BVS_RELATIVE_112_TRACE;
function ADC_INDIRECTY_113_TRACE(cpu, memory) {
  let cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 113;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions_TRACE[113] = ADC_INDIRECTY_113_TRACE;
function HLT_NONE_114_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 114;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions_TRACE[114] = HLT_NONE_114_TRACE;
function RRA_INDIRECTY_115_TRACE(cpu, memory) {
  const cyclesTaken = 8;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 115;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = (operationModeData >> 1) | (cpu.getCarry() ? 0x80 : 0);
  cpu.setCarry((operationModeData & 0x1) > 0);
  const temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (result ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  result &= 0xFF;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[115] = RRA_INDIRECTY_115_TRACE;
function SKB_ZEROPAGEX_116_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 116;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[116] = SKB_ZEROPAGEX_116_TRACE;
function ADC_ZEROPAGEX_117_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 117;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions_TRACE[117] = ADC_ZEROPAGEX_117_TRACE;
function ROR_ZEROPAGEX_118_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 118;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  const result = ((operationModeData & 0xFF) >> 1) | (cpu.getCarry() ? 0x80 : 0);
  cpu.setCarry(operationModeData & 0x1);
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[118] = ROR_ZEROPAGEX_118_TRACE;
function RRA_ZEROPAGEX_119_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 119;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = (operationModeData >> 1) | (cpu.getCarry() ? 0x80 : 0);
  cpu.setCarry((operationModeData & 0x1) > 0);
  const temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (result ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  result &= 0xFF;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[119] = RRA_ZEROPAGEX_119_TRACE;
function SEI_NONE_120_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 120;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.setInterrupt(true);
  return cyclesTaken;
}
instructions_TRACE[120] = SEI_NONE_120_TRACE;
function ADC_ABSOLUTEY_121_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 121;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions_TRACE[121] = ADC_ABSOLUTEY_121_TRACE;
function NOP_NONE_122_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 122;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  return cyclesTaken;
}
instructions_TRACE[122] = NOP_NONE_122_TRACE;
function RRA_ABSOLUTEY_123_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 123;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = (operationModeData >> 1) | (cpu.getCarry() ? 0x80 : 0);
  cpu.setCarry((operationModeData & 0x1) > 0);
  const temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (result ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  result &= 0xFF;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[123] = RRA_ABSOLUTEY_123_TRACE;
function SKW_ABSOLUTEX_124_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 124;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[124] = SKW_ABSOLUTEX_124_TRACE;
function ADC_ABSOLUTEX_125_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 125;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions_TRACE[125] = ADC_ABSOLUTEX_125_TRACE;
function ROR_ABSOLUTEX_126_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 126;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  const result = ((operationModeData & 0xFF) >> 1) | (cpu.getCarry() ? 0x80 : 0);
  cpu.setCarry(operationModeData & 0x1);
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[126] = ROR_ABSOLUTEX_126_TRACE;
function RRA_ABSOLUTEX_127_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 127;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = (operationModeData >> 1) | (cpu.getCarry() ? 0x80 : 0);
  cpu.setCarry((operationModeData & 0x1) > 0);
  const temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (result ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  result &= 0xFF;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[127] = RRA_ABSOLUTEX_127_TRACE;
function SKB_IMMEDIATE_128_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 128;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  return cyclesTaken;
}
instructions_TRACE[128] = SKB_IMMEDIATE_128_TRACE;
function STA_INDIRECTX_129_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 129;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regA;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[129] = STA_INDIRECTX_129_TRACE;
function SKB_IMMEDIATE_130_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 130;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  return cyclesTaken;
}
instructions_TRACE[130] = SKB_IMMEDIATE_130_TRACE;
function AXS_INDIRECTX_131_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 131;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regA & cpu.regX;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[131] = AXS_INDIRECTX_131_TRACE;
function STY_ZEROPAGE_132_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 132;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regY;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[132] = STY_ZEROPAGE_132_TRACE;
function STA_ZEROPAGE_133_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 133;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regA;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[133] = STA_ZEROPAGE_133_TRACE;
function STX_ZEROPAGE_134_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 134;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regX;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[134] = STX_ZEROPAGE_134_TRACE;
function AXS_ZEROPAGE_135_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 135;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regA & cpu.regX;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[135] = AXS_ZEROPAGE_135_TRACE;
function DEY_NONE_136_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 136;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regY--;
  if (cpu.regY < 0) { cpu.regY = 0xFF; }
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[136] = DEY_NONE_136_TRACE;
function SKB_IMMEDIATE_137_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 137;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  return cyclesTaken;
}
instructions_TRACE[137] = SKB_IMMEDIATE_137_TRACE;
function TXA_NONE_138_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 138;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regA = cpu.regX;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[138] = TXA_NONE_138_TRACE;
function XAA_IMMEDIATE_139_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 139;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA = cpu.regX & readInValue;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[139] = XAA_IMMEDIATE_139_TRACE;
function STY_ABSOLUTE_140_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 140;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  const result = cpu.regY;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[140] = STY_ABSOLUTE_140_TRACE;
function STA_ABSOLUTE_141_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 141;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  const result = cpu.regA;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[141] = STA_ABSOLUTE_141_TRACE;
function STX_ABSOLUTE_142_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 142;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  const result = cpu.regX;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[142] = STX_ABSOLUTE_142_TRACE;
function AXS_ABSOLUTE_143_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 143;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  const result = cpu.regA & cpu.regX;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[143] = AXS_ABSOLUTE_143_TRACE;
function BCC_RELATIVE_144_TRACE(cpu, memory) {
  let cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 144;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
  formatData.opcodeParam = address;
  formatData.operationParam = (readInValue + 2) & 0xFFFF;
  const branchTaken = !cpu.getCarry();
  if (branchTaken) {
    cpu.incrementSubcycle();
    if ((((cpu.getPC() + 2) & 0xff00) !== (((readInValue + 2)) & 0xff00))) {
      cyclesTaken += 1;
      cpu.incrementSubcycle();
    }
    cyclesTaken += 1;
    cpu.incrementSubcycle();
    cpu.setPC((readInValue + 2) & 0xFFFF);
  } else {
    cpu.incrementSubcycle();
    memory.read8((cpu.getPC() + 1) & 0xFFFF);
    cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  }
  return cyclesTaken;
}
instructions_TRACE[144] = BCC_RELATIVE_144_TRACE;
function STA_INDIRECTY_145_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 145;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regA;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[145] = STA_INDIRECTY_145_TRACE;
function HLT_NONE_146_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 146;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions_TRACE[146] = HLT_NONE_146_TRACE;
function AXA_INDIRECTY_147_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 147;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = (cpu.regX & cpu.regA) & 0x7;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[147] = AXA_INDIRECTY_147_TRACE;
function STY_ZEROPAGEX_148_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 148;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regY;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[148] = STY_ZEROPAGEX_148_TRACE;
function STA_ZEROPAGEX_149_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 149;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regA;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[149] = STA_ZEROPAGEX_149_TRACE;
function STX_ZEROPAGEY_150_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 150;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regX;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[150] = STX_ZEROPAGEY_150_TRACE;
function AXS_ZEROPAGEY_151_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 151;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regA & cpu.regX;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[151] = AXS_ZEROPAGEY_151_TRACE;
function TYA_NONE_152_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 152;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regA = cpu.regY;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[152] = TYA_NONE_152_TRACE;
function STA_ABSOLUTEY_153_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 153;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  const result = cpu.regA;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[153] = STA_ABSOLUTEY_153_TRACE;
function TXS_NONE_154_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 154;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regS = cpu.regX;
  return cyclesTaken;
}
instructions_TRACE[154] = TXS_NONE_154_TRACE;
function TAS_ABSOLUTEY_155_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 155;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.regS = cpu.regX & cpu.regA;
  return cyclesTaken;
}
instructions_TRACE[155] = TAS_ABSOLUTEY_155_TRACE;
function SAY_SAY_156_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 156;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.SAYHighByte = memory.read8((cpu.getPC() + 2) & 0xFFFF);
  address |= (cpu.SAYHighByte) << 8;
  const readInValue = (address + cpu.regX) & 0xFFFF; // SAY writes to absolute X but needs the high byte of the address to operate on
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  const result = cpu.regY & ((cpu.SAYHighByte + 1) & 0xFF);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[156] = SAY_SAY_156_TRACE;
function STA_ABSOLUTEX_157_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 157;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  const result = cpu.regA;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[157] = STA_ABSOLUTEX_157_TRACE;
function XAS_ABSOLUTEY_158_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 158;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  const result = 0;
  console.log('illegal instruction XAS not implemented');
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions_TRACE[158] = XAS_ABSOLUTEY_158_TRACE;
function AXA_ABSOLUTEY_159_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 159;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  const result = (cpu.regX & cpu.regA) & 0x7;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[159] = AXA_ABSOLUTEY_159_TRACE;
function LDY_IMMEDIATE_160_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 160;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regY = readInValue & 0xFF;
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[160] = LDY_IMMEDIATE_160_TRACE;
function LDA_INDIRECTX_161_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 161;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[161] = LDA_INDIRECTX_161_TRACE;
function LDX_IMMEDIATE_162_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 162;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regX = readInValue & 0xFF;
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[162] = LDX_IMMEDIATE_162_TRACE;
function LAX_INDIRECTX_163_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 163;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = operationModeData;
  cpu.regX = operationModeData;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[163] = LAX_INDIRECTX_163_TRACE;
function LDY_ZEROPAGE_164_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 164;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regY = operationModeData & 0xFF;
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[164] = LDY_ZEROPAGE_164_TRACE;
function LDA_ZEROPAGE_165_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 165;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[165] = LDA_ZEROPAGE_165_TRACE;
function LDX_ZEROPAGE_166_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 166;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regX = operationModeData & 0xFF;
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[166] = LDX_ZEROPAGE_166_TRACE;
function LAX_ZEROPAGE_167_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 167;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = operationModeData;
  cpu.regX = operationModeData;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[167] = LAX_ZEROPAGE_167_TRACE;
function TAY_NONE_168_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 168;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regY = cpu.regA;
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[168] = TAY_NONE_168_TRACE;
function LDA_IMMEDIATE_169_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 169;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA = readInValue & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[169] = LDA_IMMEDIATE_169_TRACE;
function TAX_NONE_170_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 170;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regX = cpu.regA;
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[170] = TAX_NONE_170_TRACE;
function OAL_IMMEDIATE_171_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 171;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regX = cpu.regA = readInValue & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[171] = OAL_IMMEDIATE_171_TRACE;
function LDY_ABSOLUTE_172_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 172;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regY = operationModeData & 0xFF;
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[172] = LDY_ABSOLUTE_172_TRACE;
function LDA_ABSOLUTE_173_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 173;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[173] = LDA_ABSOLUTE_173_TRACE;
function LDX_ABSOLUTE_174_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 174;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regX = operationModeData & 0xFF;
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[174] = LDX_ABSOLUTE_174_TRACE;
function LAX_ABSOLUTE_175_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 175;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = operationModeData;
  cpu.regX = operationModeData;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[175] = LAX_ABSOLUTE_175_TRACE;
function BCS_RELATIVE_176_TRACE(cpu, memory) {
  let cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 176;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
  formatData.opcodeParam = address;
  formatData.operationParam = (readInValue + 2) & 0xFFFF;
  const branchTaken = cpu.getCarry();
  if (branchTaken) {
    cpu.incrementSubcycle();
    if ((((cpu.getPC() + 2) & 0xff00) !== (((readInValue + 2)) & 0xff00))) {
      cyclesTaken += 1;
      cpu.incrementSubcycle();
    }
    cyclesTaken += 1;
    cpu.incrementSubcycle();
    cpu.setPC((readInValue + 2) & 0xFFFF);
  } else {
    cpu.incrementSubcycle();
    memory.read8((cpu.getPC() + 1) & 0xFFFF);
    cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  }
  return cyclesTaken;
}
instructions_TRACE[176] = BCS_RELATIVE_176_TRACE;
function LDA_INDIRECTY_177_TRACE(cpu, memory) {
  let cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 177;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[177] = LDA_INDIRECTY_177_TRACE;
function HLT_NONE_178_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 178;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions_TRACE[178] = HLT_NONE_178_TRACE;
function LAX_INDIRECTY_179_TRACE(cpu, memory) {
  let cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 179;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = operationModeData;
  cpu.regX = operationModeData;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[179] = LAX_INDIRECTY_179_TRACE;
function LDY_ZEROPAGEX_180_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 180;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regY = operationModeData & 0xFF;
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[180] = LDY_ZEROPAGEX_180_TRACE;
function LDA_ZEROPAGEX_181_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 181;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[181] = LDA_ZEROPAGEX_181_TRACE;
function LDX_ZEROPAGEY_182_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 182;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regX = operationModeData & 0xFF;
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[182] = LDX_ZEROPAGEY_182_TRACE;
function LAX_ZEROPAGEY_183_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 183;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = operationModeData;
  cpu.regX = operationModeData;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[183] = LAX_ZEROPAGEY_183_TRACE;
function CLV_NONE_184_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 184;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.setOverflow(false);
  return cyclesTaken;
}
instructions_TRACE[184] = CLV_NONE_184_TRACE;
function LDA_ABSOLUTEY_185_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 185;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[185] = LDA_ABSOLUTEY_185_TRACE;
function TSX_NONE_186_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 186;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regX = cpu.regS & 0xFF;
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[186] = TSX_NONE_186_TRACE;
function LAS_ABSOLUTEY_187_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 187;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const result = 0;
  console.log('illegal instruction LAS not implemented');
  return cyclesTaken;
}
instructions_TRACE[187] = LAS_ABSOLUTEY_187_TRACE;
function LDY_ABSOLUTEX_188_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 188;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regY = operationModeData & 0xFF;
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[188] = LDY_ABSOLUTEX_188_TRACE;
function LDA_ABSOLUTEX_189_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 189;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[189] = LDA_ABSOLUTEX_189_TRACE;
function LDX_ABSOLUTEY_190_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 190;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regX = operationModeData & 0xFF;
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[190] = LDX_ABSOLUTEY_190_TRACE;
function LAX_ABSOLUTEY_191_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 191;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.regA = operationModeData;
  cpu.regX = operationModeData;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[191] = LAX_ABSOLUTEY_191_TRACE;
function CPY_IMMEDIATE_192_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 192;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const temp = cpu.regY - readInValue; // purposely not wrapped
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[192] = CPY_IMMEDIATE_192_TRACE;
function CMP_INDIRECTX_193_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 193;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regA - operationModeData;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[193] = CMP_INDIRECTX_193_TRACE;
function SKB_IMMEDIATE_194_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 194;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  return cyclesTaken;
}
instructions_TRACE[194] = SKB_IMMEDIATE_194_TRACE;
function DCM_INDIRECTX_195_TRACE(cpu, memory) {
  const cyclesTaken = 8;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 195;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData - 1;
  if (result < 0) { result = 0xFF; }
  const temp = cpu.regA - result;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[195] = DCM_INDIRECTX_195_TRACE;
function CPY_ZEROPAGE_196_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 196;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regY - operationModeData; // purposely not wrapped
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[196] = CPY_ZEROPAGE_196_TRACE;
function CMP_ZEROPAGE_197_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 197;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regA - operationModeData;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[197] = CMP_ZEROPAGE_197_TRACE;
function DEC_ZEROPAGE_198_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 198;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData - 1;
  if (result < 0) { result = 0xFF; }
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[198] = DEC_ZEROPAGE_198_TRACE;
function DCM_ZEROPAGE_199_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 199;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData - 1;
  if (result < 0) { result = 0xFF; }
  const temp = cpu.regA - result;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[199] = DCM_ZEROPAGE_199_TRACE;
function INY_NONE_200_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 200;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regY++;
  if (cpu.regY > 0xFF) { cpu.regY = 0; }
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[200] = INY_NONE_200_TRACE;
function CMP_IMMEDIATE_201_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 201;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const temp = cpu.regA - readInValue;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[201] = CMP_IMMEDIATE_201_TRACE;
function DEX_NONE_202_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 202;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regX--;
  if (cpu.regX < 0) { cpu.regX = 0xFF; }
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[202] = DEX_NONE_202_TRACE;
function SAX_IMMEDIATE_203_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 203;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const temp = (cpu.regA & cpu.regX) - readInValue;
  cpu.regX = temp & 0xFF;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[203] = SAX_IMMEDIATE_203_TRACE;
function CPY_ABSOLUTE_204_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 204;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regY - operationModeData; // purposely not wrapped
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[204] = CPY_ABSOLUTE_204_TRACE;
function CMP_ABSOLUTE_205_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 205;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regA - operationModeData;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[205] = CMP_ABSOLUTE_205_TRACE;
function DEC_ABSOLUTE_206_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 206;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData - 1;
  if (result < 0) { result = 0xFF; }
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[206] = DEC_ABSOLUTE_206_TRACE;
function DCM_ABSOLUTE_207_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 207;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData - 1;
  if (result < 0) { result = 0xFF; }
  const temp = cpu.regA - result;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[207] = DCM_ABSOLUTE_207_TRACE;
function BNE_RELATIVE_208_TRACE(cpu, memory) {
  let cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 208;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
  formatData.opcodeParam = address;
  formatData.operationParam = (readInValue + 2) & 0xFFFF;
  const branchTaken = !cpu.getZero();
  if (branchTaken) {
    cpu.incrementSubcycle();
    if ((((cpu.getPC() + 2) & 0xff00) !== (((readInValue + 2)) & 0xff00))) {
      cyclesTaken += 1;
      cpu.incrementSubcycle();
    }
    cyclesTaken += 1;
    cpu.incrementSubcycle();
    cpu.setPC((readInValue + 2) & 0xFFFF);
  } else {
    cpu.incrementSubcycle();
    memory.read8((cpu.getPC() + 1) & 0xFFFF);
    cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  }
  return cyclesTaken;
}
instructions_TRACE[208] = BNE_RELATIVE_208_TRACE;
function CMP_INDIRECTY_209_TRACE(cpu, memory) {
  let cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 209;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regA - operationModeData;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[209] = CMP_INDIRECTY_209_TRACE;
function HLT_NONE_210_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 210;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions_TRACE[210] = HLT_NONE_210_TRACE;
function DCM_INDIRECTY_211_TRACE(cpu, memory) {
  const cyclesTaken = 8;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 211;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData - 1;
  if (result < 0) { result = 0xFF; }
  const temp = cpu.regA - result;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[211] = DCM_INDIRECTY_211_TRACE;
function SKB_ZEROPAGEX_212_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 212;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[212] = SKB_ZEROPAGEX_212_TRACE;
function CMP_ZEROPAGEX_213_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 213;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regA - operationModeData;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[213] = CMP_ZEROPAGEX_213_TRACE;
function DEC_ZEROPAGEX_214_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 214;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData - 1;
  if (result < 0) { result = 0xFF; }
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[214] = DEC_ZEROPAGEX_214_TRACE;
function DCM_ZEROPAGEX_215_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 215;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData - 1;
  if (result < 0) { result = 0xFF; }
  const temp = cpu.regA - result;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[215] = DCM_ZEROPAGEX_215_TRACE;
function CLD_NONE_216_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 216;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.setDecimal(false);
  return cyclesTaken;
}
instructions_TRACE[216] = CLD_NONE_216_TRACE;
function CMP_ABSOLUTEY_217_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 217;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regA - operationModeData;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[217] = CMP_ABSOLUTEY_217_TRACE;
function NOP_NONE_218_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 218;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  return cyclesTaken;
}
instructions_TRACE[218] = NOP_NONE_218_TRACE;
function DCM_ABSOLUTEY_219_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 219;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData - 1;
  if (result < 0) { result = 0xFF; }
  const temp = cpu.regA - result;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[219] = DCM_ABSOLUTEY_219_TRACE;
function SKW_ABSOLUTEX_220_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 220;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[220] = SKW_ABSOLUTEX_220_TRACE;
function CMP_ABSOLUTEX_221_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 221;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regA - operationModeData;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[221] = CMP_ABSOLUTEX_221_TRACE;
function DEC_ABSOLUTEX_222_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 222;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData - 1;
  if (result < 0) { result = 0xFF; }
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[222] = DEC_ABSOLUTEX_222_TRACE;
function DCM_ABSOLUTEX_223_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 223;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData - 1;
  if (result < 0) { result = 0xFF; }
  const temp = cpu.regA - result;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[223] = DCM_ABSOLUTEX_223_TRACE;
function CPX_IMMEDIATE_224_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 224;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const temp = cpu.regX - readInValue; // purposely not wrapped
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[224] = CPX_IMMEDIATE_224_TRACE;
function SBC_INDIRECTX_225_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 225;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ operationModeData) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[225] = SBC_INDIRECTX_225_TRACE;
function SKB_IMMEDIATE_226_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 226;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  return cyclesTaken;
}
instructions_TRACE[226] = SKB_IMMEDIATE_226_TRACE;
function INS_INDIRECTX_227_TRACE(cpu, memory) {
  const cyclesTaken = 8;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 227;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData + 1;
  if (result > 0xFF) { result = 0; }
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  const temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ result) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = temp & 0xFF;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[227] = INS_INDIRECTX_227_TRACE;
function CPX_ZEROPAGE_228_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 228;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regX - operationModeData; // purposely not wrapped
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[228] = CPX_ZEROPAGE_228_TRACE;
function SBC_ZEROPAGE_229_TRACE(cpu, memory) {
  const cyclesTaken = 3;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 229;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ operationModeData) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[229] = SBC_ZEROPAGE_229_TRACE;
function INC_ZEROPAGE_230_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 230;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData + 1;
  if (result > 0xFF) { result = 0; }
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[230] = INC_ZEROPAGE_230_TRACE;
function INS_ZEROPAGE_231_TRACE(cpu, memory) {
  const cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 231;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData + 1;
  if (result > 0xFF) { result = 0; }
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  const temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ result) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = temp & 0xFF;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[231] = INS_ZEROPAGE_231_TRACE;
function INX_NONE_232_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 232;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regX++;
  if (cpu.regX > 0xFF) { cpu.regX = 0; }
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[232] = INX_NONE_232_TRACE;
function SBC_IMMEDIATE_233_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 233;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const temp = cpu.regA - readInValue - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ readInValue) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[233] = SBC_IMMEDIATE_233_TRACE;
function NOP_NONE_234_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 234;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  return cyclesTaken;
}
instructions_TRACE[234] = NOP_NONE_234_TRACE;
function SBC_IMMEDIATE_235_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 235;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const temp = cpu.regA - readInValue - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ readInValue) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[235] = SBC_IMMEDIATE_235_TRACE;
function CPX_ABSOLUTE_236_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 236;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regX - operationModeData; // purposely not wrapped
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions_TRACE[236] = CPX_ABSOLUTE_236_TRACE;
function SBC_ABSOLUTE_237_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 237;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ operationModeData) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[237] = SBC_ABSOLUTE_237_TRACE;
function INC_ABSOLUTE_238_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 238;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData + 1;
  if (result > 0xFF) { result = 0; }
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[238] = INC_ABSOLUTE_238_TRACE;
function INS_ABSOLUTE_239_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 239;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = readInValue;
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData + 1;
  if (result > 0xFF) { result = 0; }
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  const temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ result) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = temp & 0xFF;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[239] = INS_ABSOLUTE_239_TRACE;
function BEQ_RELATIVE_240_TRACE(cpu, memory) {
  let cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 240;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
  formatData.opcodeParam = address;
  formatData.operationParam = (readInValue + 2) & 0xFFFF;
  const branchTaken = cpu.getZero();
  if (branchTaken) {
    cpu.incrementSubcycle();
    if ((((cpu.getPC() + 2) & 0xff00) !== (((readInValue + 2)) & 0xff00))) {
      cyclesTaken += 1;
      cpu.incrementSubcycle();
    }
    cyclesTaken += 1;
    cpu.incrementSubcycle();
    cpu.setPC((readInValue + 2) & 0xFFFF);
  } else {
    cpu.incrementSubcycle();
    memory.read8((cpu.getPC() + 1) & 0xFFFF);
    cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  }
  return cyclesTaken;
}
instructions_TRACE[240] = BEQ_RELATIVE_240_TRACE;
function SBC_INDIRECTY_241_TRACE(cpu, memory) {
  let cyclesTaken = 5;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 241;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ operationModeData) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[241] = SBC_INDIRECTY_241_TRACE;
function HLT_NONE_242_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 242;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions_TRACE[242] = HLT_NONE_242_TRACE;
function INS_INDIRECTY_243_TRACE(cpu, memory) {
  const cyclesTaken = 8;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 243;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData + 1;
  if (result > 0xFF) { result = 0; }
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  const temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ result) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = temp & 0xFF;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[243] = INS_INDIRECTY_243_TRACE;
function SKB_ZEROPAGEX_244_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 244;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[244] = SKB_ZEROPAGEX_244_TRACE;
function SBC_ZEROPAGEX_245_TRACE(cpu, memory) {
  const cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 245;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ operationModeData) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[245] = SBC_ZEROPAGEX_245_TRACE;
function INC_ZEROPAGEX_246_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 246;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData + 1;
  if (result > 0xFF) { result = 0; }
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[246] = INC_ZEROPAGEX_246_TRACE;
function INS_ZEROPAGEX_247_TRACE(cpu, memory) {
  const cyclesTaken = 6;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 247;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData + 1;
  if (result > 0xFF) { result = 0; }
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  const temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ result) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = temp & 0xFF;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[247] = INS_ZEROPAGEX_247_TRACE;
function SED_NONE_248_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 248;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.setDecimal(true);
  return cyclesTaken;
}
instructions_TRACE[248] = SED_NONE_248_TRACE;
function SBC_ABSOLUTEY_249_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 249;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ operationModeData) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[249] = SBC_ABSOLUTEY_249_TRACE;
function NOP_NONE_250_TRACE(cpu, memory) {
  const cyclesTaken = 2;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 250;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  return cyclesTaken;
}
instructions_TRACE[250] = NOP_NONE_250_TRACE;
function INS_ABSOLUTEY_251_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 251;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData + 1;
  if (result > 0xFF) { result = 0; }
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  const temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ result) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = temp & 0xFF;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[251] = INS_ABSOLUTEY_251_TRACE;
function SKW_ABSOLUTEX_252_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 252;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  return cyclesTaken;
}
instructions_TRACE[252] = SKW_ABSOLUTEX_252_TRACE;
function SBC_ABSOLUTEX_253_TRACE(cpu, memory) {
  let cyclesTaken = 4;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 253;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  const temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ operationModeData) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[253] = SBC_ABSOLUTEX_253_TRACE;
function INC_ABSOLUTEX_254_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 254;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData + 1;
  if (result > 0xFF) { result = 0; }
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[254] = INC_ABSOLUTEX_254_TRACE;
function INS_ABSOLUTEX_255_TRACE(cpu, memory) {
  const cyclesTaken = 7;
  formatData.programCounter = cpu.getPC();
  formatData.opcode = 255;
  formatData.regs.a = cpu.regA;
  formatData.regs.x = cpu.regX;
  formatData.regs.y = cpu.regY;
  formatData.regs.p = cpu.statusRegToByte();
  formatData.regs.sp = cpu.regS;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  formatData.opcodeParam = address;
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  formatData.operationParam = operationModeData;
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  let result = operationModeData + 1;
  if (result > 0xFF) { result = 0; }
  cpu.setSign((result & 0x80) > 0);
  cpu.setZero((result & 0xFF) === 0);
  const temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ result) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = temp & 0xFF;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions_TRACE[255] = INS_ABSOLUTEX_255_TRACE;

export const cpuInstructionsTrace = instructions_TRACE;
export const cpuTrace = formatData;

