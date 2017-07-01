import {
	CPU_IRQ_ADDRESS,
} from '../../config/consts.js';

const instructions = [];

function BRK_NONE_0(cpu, memory) {
  const cyclesTaken = 7;
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
instructions[0] = BRK_NONE_0;
function ORA_INDIRECTX_1(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA |= operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[1] = ORA_INDIRECTX_1;
function HLT_NONE_2(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('HLT_NONE_2 illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions[2] = HLT_NONE_2;
function ASO_INDIRECTX_3(cpu, memory) {
  const cyclesTaken = 8;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[3] = ASO_INDIRECTX_3;
function SKB_ZEROPAGE_4(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[4] = SKB_ZEROPAGE_4;
function ORA_ZEROPAGE_5(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA |= operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[5] = ORA_ZEROPAGE_5;
function ASL_ZEROPAGE_6(cpu, memory) {
  const cyclesTaken = 5;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[6] = ASL_ZEROPAGE_6;
function ASO_ZEROPAGE_7(cpu, memory) {
  const cyclesTaken = 5;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[7] = ASO_ZEROPAGE_7;
function PHP_NONE_8(cpu, memory) {
  const cyclesTaken = 3;
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
instructions[8] = PHP_NONE_8;
function ORA_IMMEDIATE_9(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA |= readInValue & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[9] = ORA_IMMEDIATE_9;
function ASL_ACCUMULATOR_10(cpu, memory) {
  const cyclesTaken = 2;
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
instructions[10] = ASL_ACCUMULATOR_10;
function ANC_IMMEDIATE_11(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA &= readInValue;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.setCarry(cpu.getSign());
  return cyclesTaken;
}
instructions[11] = ANC_IMMEDIATE_11;
function SKW_ABSOLUTE_12(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[12] = SKW_ABSOLUTE_12;
function ORA_ABSOLUTE_13(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA |= operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[13] = ORA_ABSOLUTE_13;
function ASL_ABSOLUTE_14(cpu, memory) {
  const cyclesTaken = 6;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[14] = ASL_ABSOLUTE_14;
function ASO_ABSOLUTE_15(cpu, memory) {
  const cyclesTaken = 6;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[15] = ASO_ABSOLUTE_15;
function BPL_RELATIVE_16(cpu, memory) {
  let cyclesTaken = 2;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
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
instructions[16] = BPL_RELATIVE_16;
function ORA_INDIRECTY_17(cpu, memory) {
  let cyclesTaken = 5;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
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
  cpu.regA |= operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[17] = ORA_INDIRECTY_17;
function HLT_NONE_18(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('HLT_NONE_18 illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions[18] = HLT_NONE_18;
function ASO_INDIRECTY_19(cpu, memory) {
  const cyclesTaken = 8;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[19] = ASO_INDIRECTY_19;
function SKB_ZEROPAGEX_20(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[20] = SKB_ZEROPAGEX_20;
function ORA_ZEROPAGEX_21(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA |= operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[21] = ORA_ZEROPAGEX_21;
function ASL_ZEROPAGEX_22(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[22] = ASL_ZEROPAGEX_22;
function ASO_ZEROPAGEX_23(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[23] = ASO_ZEROPAGEX_23;
function CLC_NONE_24(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.setCarry(false);
  return cyclesTaken;
}
instructions[24] = CLC_NONE_24;
function ORA_ABSOLUTEY_25(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA |= operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[25] = ORA_ABSOLUTEY_25;
function NOP_NONE_26(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  return cyclesTaken;
}
instructions[26] = NOP_NONE_26;
function ASO_ABSOLUTEY_27(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[27] = ASO_ABSOLUTEY_27;
function SKW_ABSOLUTEX_28(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[28] = SKW_ABSOLUTEX_28;
function ORA_ABSOLUTEX_29(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA |= operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[29] = ORA_ABSOLUTEX_29;
function ASL_ABSOLUTEX_30(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[30] = ASL_ABSOLUTEX_30;
function ASO_ABSOLUTEX_31(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[31] = ASO_ABSOLUTEX_31;
function JSR_IMMEDIATE16_32(cpu, memory) {
  const cyclesTaken = 6;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
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
instructions[32] = JSR_IMMEDIATE16_32;
function AND_INDIRECTX_33(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA &= (operationModeData & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[33] = AND_INDIRECTX_33;
function HLT_NONE_34(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('HLT_NONE_34 illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions[34] = HLT_NONE_34;
function RLA_INDIRECTX_35(cpu, memory) {
  const cyclesTaken = 8;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[35] = RLA_INDIRECTX_35;
function BIT_ZEROPAGE_36(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  if ((readInValue & 0xE007) === 0x2002) { cpu.mainboard.ppu.bitOperationHappening(); } // BIT 2002 optimisation
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.setSign(((operationModeData & 0xFF) & 0x80) > 0);
  cpu.setZero((cpu.regA & (operationModeData & 0xFF) & 0xFF) === 0);
  cpu.setOverflow((operationModeData & 0x40) > 0);	// Copy bit 6 to OVERFLOW flag.
  return cyclesTaken;
}
instructions[36] = BIT_ZEROPAGE_36;
function AND_ZEROPAGE_37(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA &= (operationModeData & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[37] = AND_ZEROPAGE_37;
function ROL_ZEROPAGE_38(cpu, memory) {
  const cyclesTaken = 5;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[38] = ROL_ZEROPAGE_38;
function RLA_ZEROPAGE_39(cpu, memory) {
  const cyclesTaken = 5;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[39] = RLA_ZEROPAGE_39;
function PLP_NONE_40(cpu, memory) {
  const cyclesTaken = 4;
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
instructions[40] = PLP_NONE_40;
function AND_IMMEDIATE_41(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA &= (readInValue & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[41] = AND_IMMEDIATE_41;
function ROL_ACCUMULATOR_42(cpu, memory) {
  const cyclesTaken = 2;
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
instructions[42] = ROL_ACCUMULATOR_42;
function ANC_IMMEDIATE_43(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA &= readInValue;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  cpu.setCarry(cpu.getSign());
  return cyclesTaken;
}
instructions[43] = ANC_IMMEDIATE_43;
function BIT_ABSOLUTE_44(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  if ((readInValue & 0xE007) === 0x2002) { cpu.mainboard.ppu.bitOperationHappening(); } // BIT 2002 optimisation
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.setSign(((operationModeData & 0xFF) & 0x80) > 0);
  cpu.setZero((cpu.regA & (operationModeData & 0xFF) & 0xFF) === 0);
  cpu.setOverflow((operationModeData & 0x40) > 0);	// Copy bit 6 to OVERFLOW flag.
  return cyclesTaken;
}
instructions[44] = BIT_ABSOLUTE_44;
function AND_ABSOLUTE_45(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA &= (operationModeData & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[45] = AND_ABSOLUTE_45;
function ROL_ABSOLUTE_46(cpu, memory) {
  const cyclesTaken = 6;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[46] = ROL_ABSOLUTE_46;
function RLA_ABSOLUTE_47(cpu, memory) {
  const cyclesTaken = 6;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[47] = RLA_ABSOLUTE_47;
function BMI_RELATIVE_48(cpu, memory) {
  let cyclesTaken = 2;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
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
instructions[48] = BMI_RELATIVE_48;
function AND_INDIRECTY_49(cpu, memory) {
  let cyclesTaken = 5;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
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
  cpu.regA &= (operationModeData & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[49] = AND_INDIRECTY_49;
function HLT_NONE_50(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('HLT_NONE_50 illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions[50] = HLT_NONE_50;
function RLA_INDIRECTY_51(cpu, memory) {
  const cyclesTaken = 8;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[51] = RLA_INDIRECTY_51;
function SKB_ZEROPAGEX_52(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[52] = SKB_ZEROPAGEX_52;
function AND_ZEROPAGEX_53(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA &= (operationModeData & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[53] = AND_ZEROPAGEX_53;
function ROL_ZEROPAGEX_54(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[54] = ROL_ZEROPAGEX_54;
function RLA_ZEROPAGEX_55(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[55] = RLA_ZEROPAGEX_55;
function SEC_NONE_56(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.setCarry(true);
  return cyclesTaken;
}
instructions[56] = SEC_NONE_56;
function AND_ABSOLUTEY_57(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA &= (operationModeData & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[57] = AND_ABSOLUTEY_57;
function NOP_NONE_58(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  return cyclesTaken;
}
instructions[58] = NOP_NONE_58;
function RLA_ABSOLUTEY_59(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[59] = RLA_ABSOLUTEY_59;
function SKW_ABSOLUTEX_60(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[60] = SKW_ABSOLUTEX_60;
function AND_ABSOLUTEX_61(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA &= (operationModeData & 0xFF);
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[61] = AND_ABSOLUTEX_61;
function ROL_ABSOLUTEX_62(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[62] = ROL_ABSOLUTEX_62;
function RLA_ABSOLUTEX_63(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[63] = RLA_ABSOLUTEX_63;
function RTI_NONE_64(cpu, memory) {
  const cyclesTaken = 6;
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
instructions[64] = RTI_NONE_64;
function EOR_INDIRECTX_65(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = (cpu.regA ^ (operationModeData & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[65] = EOR_INDIRECTX_65;
function HLT_NONE_66(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('HLT_NONE_66 illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions[66] = HLT_NONE_66;
function LSE_INDIRECTX_67(cpu, memory) {
  const cyclesTaken = 8;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[67] = LSE_INDIRECTX_67;
function SKB_ZEROPAGE_68(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[68] = SKB_ZEROPAGE_68;
function EOR_ZEROPAGE_69(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = (cpu.regA ^ (operationModeData & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[69] = EOR_ZEROPAGE_69;
function LSR_ZEROPAGE_70(cpu, memory) {
  const cyclesTaken = 5;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[70] = LSR_ZEROPAGE_70;
function LSE_ZEROPAGE_71(cpu, memory) {
  const cyclesTaken = 5;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[71] = LSE_ZEROPAGE_71;
function PHA_NONE_72(cpu, memory) {
  const cyclesTaken = 3;
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
instructions[72] = PHA_NONE_72;
function EOR_IMMEDIATE_73(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA = (cpu.regA ^ (readInValue & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[73] = EOR_IMMEDIATE_73;
function LSR_ACCUMULATOR_74(cpu, memory) {
  const cyclesTaken = 2;
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
instructions[74] = LSR_ACCUMULATOR_74;
function ALR_IMMEDIATE_75(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA &= readInValue;
  cpu.setCarry((cpu.regA & 0x01) > 0);
  cpu.regA = (cpu.regA >> 1) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[75] = ALR_IMMEDIATE_75;
function JMP_IMMEDIATE16_76(cpu, memory) {
  const cyclesTaken = 3;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.setPC((readInValue) & 0xFFFF);
  return cyclesTaken;
}
instructions[76] = JMP_IMMEDIATE16_76;
function EOR_ABSOLUTE_77(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = (cpu.regA ^ (operationModeData & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[77] = EOR_ABSOLUTE_77;
function LSR_ABSOLUTE_78(cpu, memory) {
  const cyclesTaken = 6;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[78] = LSR_ABSOLUTE_78;
function LSE_ABSOLUTE_79(cpu, memory) {
  const cyclesTaken = 6;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[79] = LSE_ABSOLUTE_79;
function BVC_RELATIVE_80(cpu, memory) {
  let cyclesTaken = 2;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
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
instructions[80] = BVC_RELATIVE_80;
function EOR_INDIRECTY_81(cpu, memory) {
  let cyclesTaken = 5;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
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
  cpu.regA = (cpu.regA ^ (operationModeData & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[81] = EOR_INDIRECTY_81;
function HLT_NONE_82(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('HLT_NONE_82 illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions[82] = HLT_NONE_82;
function LSE_INDIRECTY_83(cpu, memory) {
  const cyclesTaken = 8;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[83] = LSE_INDIRECTY_83;
function SKB_ZEROPAGEX_84(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[84] = SKB_ZEROPAGEX_84;
function EOR_ZEROPAGEX_85(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = (cpu.regA ^ (operationModeData & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[85] = EOR_ZEROPAGEX_85;
function LSR_ZEROPAGEX_86(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[86] = LSR_ZEROPAGEX_86;
function LSE_ZEROPAGEX_87(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[87] = LSE_ZEROPAGEX_87;
function CLI_NONE_88(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.waitOneInstructionAfterCli = cpu.getInterrupt() === true;
  cpu.setInterrupt(false);
  return cyclesTaken;
}
instructions[88] = CLI_NONE_88;
function EOR_ABSOLUTEY_89(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = (cpu.regA ^ (operationModeData & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[89] = EOR_ABSOLUTEY_89;
function NOP_NONE_90(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  return cyclesTaken;
}
instructions[90] = NOP_NONE_90;
function LSE_ABSOLUTEY_91(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[91] = LSE_ABSOLUTEY_91;
function SKW_ABSOLUTEX_92(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[92] = SKW_ABSOLUTEX_92;
function EOR_ABSOLUTEX_93(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = (cpu.regA ^ (operationModeData & 0xFF)) & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[93] = EOR_ABSOLUTEX_93;
function LSR_ABSOLUTEX_94(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[94] = LSR_ABSOLUTEX_94;
function LSE_ABSOLUTEX_95(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[95] = LSE_ABSOLUTEX_95;
function RTS_NONE_96(cpu, memory) {
  const cyclesTaken = 6;
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
instructions[96] = RTS_NONE_96;
function ADC_INDIRECTX_97(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions[97] = ADC_INDIRECTX_97;
function HLT_NONE_98(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('HLT_NONE_98 illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions[98] = HLT_NONE_98;
function RRA_INDIRECTX_99(cpu, memory) {
  const cyclesTaken = 8;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[99] = RRA_INDIRECTX_99;
function SKB_ZEROPAGE_100(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[100] = SKB_ZEROPAGE_100;
function ADC_ZEROPAGE_101(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions[101] = ADC_ZEROPAGE_101;
function ROR_ZEROPAGE_102(cpu, memory) {
  const cyclesTaken = 5;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[102] = ROR_ZEROPAGE_102;
function RRA_ZEROPAGE_103(cpu, memory) {
  const cyclesTaken = 5;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[103] = RRA_ZEROPAGE_103;
function PLA_NONE_104(cpu, memory) {
  const cyclesTaken = 4;
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
instructions[104] = PLA_NONE_104;
function ADC_IMMEDIATE_105(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const temp = (readInValue & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (readInValue ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions[105] = ADC_IMMEDIATE_105;
function ROR_ACCUMULATOR_106(cpu, memory) {
  const cyclesTaken = 2;
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
instructions[106] = ROR_ACCUMULATOR_106;
function ARR_IMMEDIATE_107(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
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
instructions[107] = ARR_IMMEDIATE_107;
function JMP_INDIRECT_108(cpu, memory) {
  const cyclesTaken = 5;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.setPC((readInValue) & 0xFFFF);
  return cyclesTaken;
}
instructions[108] = JMP_INDIRECT_108;
function ADC_ABSOLUTE_109(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions[109] = ADC_ABSOLUTE_109;
function ROR_ABSOLUTE_110(cpu, memory) {
  const cyclesTaken = 6;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[110] = ROR_ABSOLUTE_110;
function RRA_ABSOLUTE_111(cpu, memory) {
  const cyclesTaken = 6;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[111] = RRA_ABSOLUTE_111;
function BVS_RELATIVE_112(cpu, memory) {
  let cyclesTaken = 2;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
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
instructions[112] = BVS_RELATIVE_112;
function ADC_INDIRECTY_113(cpu, memory) {
  let cyclesTaken = 5;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
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
  const temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions[113] = ADC_INDIRECTY_113;
function HLT_NONE_114(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('HLT_NONE_114 illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions[114] = HLT_NONE_114;
function RRA_INDIRECTY_115(cpu, memory) {
  const cyclesTaken = 8;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[115] = RRA_INDIRECTY_115;
function SKB_ZEROPAGEX_116(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[116] = SKB_ZEROPAGEX_116;
function ADC_ZEROPAGEX_117(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions[117] = ADC_ZEROPAGEX_117;
function ROR_ZEROPAGEX_118(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[118] = ROR_ZEROPAGEX_118;
function RRA_ZEROPAGEX_119(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[119] = RRA_ZEROPAGEX_119;
function SEI_NONE_120(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.setInterrupt(true);
  return cyclesTaken;
}
instructions[120] = SEI_NONE_120;
function ADC_ABSOLUTEY_121(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions[121] = ADC_ABSOLUTEY_121;
function NOP_NONE_122(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  return cyclesTaken;
}
instructions[122] = NOP_NONE_122;
function RRA_ABSOLUTEY_123(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[123] = RRA_ABSOLUTEY_123;
function SKW_ABSOLUTEX_124(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[124] = SKW_ABSOLUTEX_124;
function ADC_ABSOLUTEX_125(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
  cpu.setCarry(temp > 0xFF);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80));
  cpu.regA = temp & 0xFF;
  return cyclesTaken;
}
instructions[125] = ADC_ABSOLUTEX_125;
function ROR_ABSOLUTEX_126(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[126] = ROR_ABSOLUTEX_126;
function RRA_ABSOLUTEX_127(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[127] = RRA_ABSOLUTEX_127;
function SKB_IMMEDIATE_128(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  return cyclesTaken;
}
instructions[128] = SKB_IMMEDIATE_128;
function STA_INDIRECTX_129(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regA;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[129] = STA_INDIRECTX_129;
function SKB_IMMEDIATE_130(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  return cyclesTaken;
}
instructions[130] = SKB_IMMEDIATE_130;
function AXS_INDIRECTX_131(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regA & cpu.regX;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[131] = AXS_INDIRECTX_131;
function STY_ZEROPAGE_132(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regY;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[132] = STY_ZEROPAGE_132;
function STA_ZEROPAGE_133(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regA;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[133] = STA_ZEROPAGE_133;
function STX_ZEROPAGE_134(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regX;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[134] = STX_ZEROPAGE_134;
function AXS_ZEROPAGE_135(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regA & cpu.regX;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[135] = AXS_ZEROPAGE_135;
function DEY_NONE_136(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regY--;
  if (cpu.regY < 0) { cpu.regY = 0xFF; }
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions[136] = DEY_NONE_136;
function SKB_IMMEDIATE_137(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  return cyclesTaken;
}
instructions[137] = SKB_IMMEDIATE_137;
function TXA_NONE_138(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regA = cpu.regX;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[138] = TXA_NONE_138;
function XAA_IMMEDIATE_139(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA = cpu.regX & readInValue;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[139] = XAA_IMMEDIATE_139;
function STY_ABSOLUTE_140(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  const result = cpu.regY;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[140] = STY_ABSOLUTE_140;
function STA_ABSOLUTE_141(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  const result = cpu.regA;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[141] = STA_ABSOLUTE_141;
function STX_ABSOLUTE_142(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  const result = cpu.regX;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[142] = STX_ABSOLUTE_142;
function AXS_ABSOLUTE_143(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  const result = cpu.regA & cpu.regX;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[143] = AXS_ABSOLUTE_143;
function BCC_RELATIVE_144(cpu, memory) {
  let cyclesTaken = 2;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
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
instructions[144] = BCC_RELATIVE_144;
function STA_INDIRECTY_145(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
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
instructions[145] = STA_INDIRECTY_145;
function HLT_NONE_146(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('HLT_NONE_146 illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions[146] = HLT_NONE_146;
function AXA_INDIRECTY_147(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
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
instructions[147] = AXA_INDIRECTY_147;
function STY_ZEROPAGEX_148(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regY;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[148] = STY_ZEROPAGEX_148;
function STA_ZEROPAGEX_149(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regA;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[149] = STA_ZEROPAGEX_149;
function STX_ZEROPAGEY_150(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regX;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[150] = STX_ZEROPAGEY_150;
function AXS_ZEROPAGEY_151(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const result = cpu.regA & cpu.regX;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[151] = AXS_ZEROPAGEY_151;
function TYA_NONE_152(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regA = cpu.regY;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[152] = TYA_NONE_152;
function STA_ABSOLUTEY_153(cpu, memory) {
  const cyclesTaken = 5;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  const result = cpu.regA;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[153] = STA_ABSOLUTEY_153;
function TXS_NONE_154(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regS = cpu.regX;
  return cyclesTaken;
}
instructions[154] = TXS_NONE_154;
function TAS_ABSOLUTEY_155(cpu, memory) {
  const cyclesTaken = 5;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.regS = cpu.regX & cpu.regA;
  return cyclesTaken;
}
instructions[155] = TAS_ABSOLUTEY_155;
function SAY_SAY_156(cpu, memory) {
  const cyclesTaken = 5;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.SAYHighByte = memory.read8((cpu.getPC() + 2) & 0xFFFF);
  address |= (cpu.SAYHighByte) << 8;
  const readInValue = (address + cpu.regX) & 0xFFFF; // SAY writes to absolute X but needs the high byte of the address to operate on
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  const result = cpu.regY & ((cpu.SAYHighByte + 1) & 0xFF);
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions[156] = SAY_SAY_156;
function STA_ABSOLUTEX_157(cpu, memory) {
  const cyclesTaken = 5;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  const result = cpu.regA;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result);
  return cyclesTaken;
}
instructions[157] = STA_ABSOLUTEX_157;
function XAS_ABSOLUTEY_158(cpu, memory) {
  const cyclesTaken = 5;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
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
instructions[158] = XAS_ABSOLUTEY_158;
function AXA_ABSOLUTEY_159(cpu, memory) {
  const cyclesTaken = 5;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.incrementSubcycle();
  memory.write8(readInValue, operationModeData);
  const result = (cpu.regX & cpu.regA) & 0x7;
  cpu.incrementSubcycle();
  memory.write8(readInValue, result & 0xFF);
  return cyclesTaken;
}
instructions[159] = AXA_ABSOLUTEY_159;
function LDY_IMMEDIATE_160(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regY = readInValue & 0xFF;
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions[160] = LDY_IMMEDIATE_160;
function LDA_INDIRECTX_161(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[161] = LDA_INDIRECTX_161;
function LDX_IMMEDIATE_162(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regX = readInValue & 0xFF;
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions[162] = LDX_IMMEDIATE_162;
function LAX_INDIRECTX_163(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = operationModeData;
  cpu.regX = operationModeData;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[163] = LAX_INDIRECTX_163;
function LDY_ZEROPAGE_164(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regY = operationModeData & 0xFF;
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions[164] = LDY_ZEROPAGE_164;
function LDA_ZEROPAGE_165(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[165] = LDA_ZEROPAGE_165;
function LDX_ZEROPAGE_166(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regX = operationModeData & 0xFF;
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions[166] = LDX_ZEROPAGE_166;
function LAX_ZEROPAGE_167(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = operationModeData;
  cpu.regX = operationModeData;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[167] = LAX_ZEROPAGE_167;
function TAY_NONE_168(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regY = cpu.regA;
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions[168] = TAY_NONE_168;
function LDA_IMMEDIATE_169(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regA = readInValue & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[169] = LDA_IMMEDIATE_169;
function TAX_NONE_170(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regX = cpu.regA;
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions[170] = TAX_NONE_170;
function OAL_IMMEDIATE_171(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.regX = cpu.regA = readInValue & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[171] = OAL_IMMEDIATE_171;
function LDY_ABSOLUTE_172(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regY = operationModeData & 0xFF;
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions[172] = LDY_ABSOLUTE_172;
function LDA_ABSOLUTE_173(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[173] = LDA_ABSOLUTE_173;
function LDX_ABSOLUTE_174(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regX = operationModeData & 0xFF;
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions[174] = LDX_ABSOLUTE_174;
function LAX_ABSOLUTE_175(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = operationModeData;
  cpu.regX = operationModeData;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[175] = LAX_ABSOLUTE_175;
function BCS_RELATIVE_176(cpu, memory) {
  let cyclesTaken = 2;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
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
instructions[176] = BCS_RELATIVE_176;
function LDA_INDIRECTY_177(cpu, memory) {
  let cyclesTaken = 5;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
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
  cpu.regA = operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[177] = LDA_INDIRECTY_177;
function HLT_NONE_178(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('HLT_NONE_178 illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions[178] = HLT_NONE_178;
function LAX_INDIRECTY_179(cpu, memory) {
  let cyclesTaken = 5;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
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
  cpu.regA = operationModeData;
  cpu.regX = operationModeData;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[179] = LAX_INDIRECTY_179;
function LDY_ZEROPAGEX_180(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regY = operationModeData & 0xFF;
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions[180] = LDY_ZEROPAGEX_180;
function LDA_ZEROPAGEX_181(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[181] = LDA_ZEROPAGEX_181;
function LDX_ZEROPAGEY_182(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regX = operationModeData & 0xFF;
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions[182] = LDX_ZEROPAGEY_182;
function LAX_ZEROPAGEY_183(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = operationModeData;
  cpu.regX = operationModeData;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[183] = LAX_ZEROPAGEY_183;
function CLV_NONE_184(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.setOverflow(false);
  return cyclesTaken;
}
instructions[184] = CLV_NONE_184;
function LDA_ABSOLUTEY_185(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[185] = LDA_ABSOLUTEY_185;
function TSX_NONE_186(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regX = cpu.regS & 0xFF;
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions[186] = TSX_NONE_186;
function LAS_ABSOLUTEY_187(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const result = 0;
  console.log('illegal instruction LAS not implemented');
  return cyclesTaken;
}
instructions[187] = LAS_ABSOLUTEY_187;
function LDY_ABSOLUTEX_188(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regY = operationModeData & 0xFF;
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions[188] = LDY_ABSOLUTEX_188;
function LDA_ABSOLUTEX_189(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = operationModeData & 0xFF;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[189] = LDA_ABSOLUTEX_189;
function LDX_ABSOLUTEY_190(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regX = operationModeData & 0xFF;
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions[190] = LDX_ABSOLUTEY_190;
function LAX_ABSOLUTEY_191(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  cpu.regA = operationModeData;
  cpu.regX = operationModeData;
  cpu.setSign((cpu.regA & 0x80) > 0);
  cpu.setZero((cpu.regA & 0xFF) === 0);
  return cyclesTaken;
}
instructions[191] = LAX_ABSOLUTEY_191;
function CPY_IMMEDIATE_192(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const temp = cpu.regY - readInValue; // purposely not wrapped
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions[192] = CPY_IMMEDIATE_192;
function CMP_INDIRECTX_193(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regA - operationModeData;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions[193] = CMP_INDIRECTX_193;
function SKB_IMMEDIATE_194(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  return cyclesTaken;
}
instructions[194] = SKB_IMMEDIATE_194;
function DCM_INDIRECTX_195(cpu, memory) {
  const cyclesTaken = 8;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[195] = DCM_INDIRECTX_195;
function CPY_ZEROPAGE_196(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regY - operationModeData; // purposely not wrapped
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions[196] = CPY_ZEROPAGE_196;
function CMP_ZEROPAGE_197(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regA - operationModeData;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions[197] = CMP_ZEROPAGE_197;
function DEC_ZEROPAGE_198(cpu, memory) {
  const cyclesTaken = 5;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[198] = DEC_ZEROPAGE_198;
function DCM_ZEROPAGE_199(cpu, memory) {
  const cyclesTaken = 5;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[199] = DCM_ZEROPAGE_199;
function INY_NONE_200(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regY++;
  if (cpu.regY > 0xFF) { cpu.regY = 0; }
  cpu.setSign((cpu.regY & 0x80) > 0);
  cpu.setZero((cpu.regY & 0xFF) === 0);
  return cyclesTaken;
}
instructions[200] = INY_NONE_200;
function CMP_IMMEDIATE_201(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const temp = cpu.regA - readInValue;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions[201] = CMP_IMMEDIATE_201;
function DEX_NONE_202(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regX--;
  if (cpu.regX < 0) { cpu.regX = 0xFF; }
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions[202] = DEX_NONE_202;
function SAX_IMMEDIATE_203(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const temp = (cpu.regA & cpu.regX) - readInValue;
  cpu.regX = temp & 0xFF;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions[203] = SAX_IMMEDIATE_203;
function CPY_ABSOLUTE_204(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regY - operationModeData; // purposely not wrapped
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions[204] = CPY_ABSOLUTE_204;
function CMP_ABSOLUTE_205(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regA - operationModeData;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions[205] = CMP_ABSOLUTE_205;
function DEC_ABSOLUTE_206(cpu, memory) {
  const cyclesTaken = 6;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[206] = DEC_ABSOLUTE_206;
function DCM_ABSOLUTE_207(cpu, memory) {
  const cyclesTaken = 6;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[207] = DCM_ABSOLUTE_207;
function BNE_RELATIVE_208(cpu, memory) {
  let cyclesTaken = 2;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
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
instructions[208] = BNE_RELATIVE_208;
function CMP_INDIRECTY_209(cpu, memory) {
  let cyclesTaken = 5;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
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
  const temp = cpu.regA - operationModeData;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions[209] = CMP_INDIRECTY_209;
function HLT_NONE_210(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('HLT_NONE_210 illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions[210] = HLT_NONE_210;
function DCM_INDIRECTY_211(cpu, memory) {
  const cyclesTaken = 8;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[211] = DCM_INDIRECTY_211;
function SKB_ZEROPAGEX_212(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[212] = SKB_ZEROPAGEX_212;
function CMP_ZEROPAGEX_213(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regA - operationModeData;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions[213] = CMP_ZEROPAGEX_213;
function DEC_ZEROPAGEX_214(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[214] = DEC_ZEROPAGEX_214;
function DCM_ZEROPAGEX_215(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[215] = DCM_ZEROPAGEX_215;
function CLD_NONE_216(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.setDecimal(false);
  return cyclesTaken;
}
instructions[216] = CLD_NONE_216;
function CMP_ABSOLUTEY_217(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regA - operationModeData;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions[217] = CMP_ABSOLUTEY_217;
function NOP_NONE_218(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  return cyclesTaken;
}
instructions[218] = NOP_NONE_218;
function DCM_ABSOLUTEY_219(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[219] = DCM_ABSOLUTEY_219;
function SKW_ABSOLUTEX_220(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[220] = SKW_ABSOLUTEX_220;
function CMP_ABSOLUTEX_221(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regA - operationModeData;
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions[221] = CMP_ABSOLUTEX_221;
function DEC_ABSOLUTEX_222(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[222] = DEC_ABSOLUTEX_222;
function DCM_ABSOLUTEX_223(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[223] = DCM_ABSOLUTEX_223;
function CPX_IMMEDIATE_224(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const temp = cpu.regX - readInValue; // purposely not wrapped
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions[224] = CPX_IMMEDIATE_224;
function SBC_INDIRECTX_225(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ operationModeData) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions[225] = SBC_INDIRECTX_225;
function SKB_IMMEDIATE_226(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  return cyclesTaken;
}
instructions[226] = SKB_IMMEDIATE_226;
function INS_INDIRECTX_227(cpu, memory) {
  const cyclesTaken = 8;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  address = (address + cpu.regX) & 0xFF;
  const readInValue = cpu.read16FromMemWithWrap(address);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[227] = INS_INDIRECTX_227;
function CPX_ZEROPAGE_228(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regX - operationModeData; // purposely not wrapped
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions[228] = CPX_ZEROPAGE_228;
function SBC_ZEROPAGE_229(cpu, memory) {
  const cyclesTaken = 3;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ operationModeData) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions[229] = SBC_ZEROPAGE_229;
function INC_ZEROPAGE_230(cpu, memory) {
  const cyclesTaken = 5;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[230] = INC_ZEROPAGE_230;
function INS_ZEROPAGE_231(cpu, memory) {
  const cyclesTaken = 5;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[231] = INS_ZEROPAGE_231;
function INX_NONE_232(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.regX++;
  if (cpu.regX > 0xFF) { cpu.regX = 0; }
  cpu.setSign((cpu.regX & 0x80) > 0);
  cpu.setZero((cpu.regX & 0xFF) === 0);
  return cyclesTaken;
}
instructions[232] = INX_NONE_232;
function SBC_IMMEDIATE_233(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const temp = cpu.regA - readInValue - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ readInValue) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions[233] = SBC_IMMEDIATE_233;
function NOP_NONE_234(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  return cyclesTaken;
}
instructions[234] = NOP_NONE_234;
function SBC_IMMEDIATE_235(cpu, memory) {
  const cyclesTaken = 2;
  cpu.incrementSubcycle();
  const readInValue = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  const temp = cpu.regA - readInValue - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ readInValue) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions[235] = SBC_IMMEDIATE_235;
function CPX_ABSOLUTE_236(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regX - operationModeData; // purposely not wrapped
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  return cyclesTaken;
}
instructions[236] = CPX_ABSOLUTE_236;
function SBC_ABSOLUTE_237(cpu, memory) {
  const cyclesTaken = 4;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ operationModeData) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions[237] = SBC_ABSOLUTE_237;
function INC_ABSOLUTE_238(cpu, memory) {
  const cyclesTaken = 6;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[238] = INC_ABSOLUTE_238;
function INS_ABSOLUTE_239(cpu, memory) {
  const cyclesTaken = 6;
  const readInValue = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[239] = INS_ABSOLUTE_239;
function BEQ_RELATIVE_240(cpu, memory) {
  let cyclesTaken = 2;
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = cpu.calculateRelativeDifference((cpu.getPC() | 0), (address | 0));
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
instructions[240] = BEQ_RELATIVE_240;
function SBC_INDIRECTY_241(cpu, memory) {
  let cyclesTaken = 5;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
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
  const temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ operationModeData) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions[241] = SBC_INDIRECTY_241;
function HLT_NONE_242(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  const result = 0;
  console.log('HLT_NONE_242 illegal instruction HLT not implemented');
  return cyclesTaken;
}
instructions[242] = HLT_NONE_242;
function INS_INDIRECTY_243(cpu, memory) {
  const cyclesTaken = 8;
  cpu.incrementSubcycle();
  let address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  address = cpu.read16FromMemWithWrap(address);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[243] = INS_INDIRECTY_243;
function SKB_ZEROPAGEX_244(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[244] = SKB_ZEROPAGEX_244;
function SBC_ZEROPAGEX_245(cpu, memory) {
  const cyclesTaken = 4;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ operationModeData) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions[245] = SBC_ZEROPAGEX_245;
function INC_ZEROPAGEX_246(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[246] = INC_ZEROPAGEX_246;
function INS_ZEROPAGEX_247(cpu, memory) {
  const cyclesTaken = 6;
  cpu.incrementSubcycle();
  const address = memory.read8((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 2) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[247] = INS_ZEROPAGEX_247;
function SED_NONE_248(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  cpu.setDecimal(true);
  return cyclesTaken;
}
instructions[248] = SED_NONE_248;
function SBC_ABSOLUTEY_249(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  if (((address + cpu.regY) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ operationModeData) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions[249] = SBC_ABSOLUTEY_249;
function NOP_NONE_250(cpu, memory) {
  const cyclesTaken = 2;
  cpu.setPC((cpu.getPC() + 1) & 0xFFFF);
  cpu.incrementSubcycle();
  return cyclesTaken;
}
instructions[250] = NOP_NONE_250;
function INS_ABSOLUTEY_251(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regY) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regY) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[251] = INS_ABSOLUTEY_251;
function SKW_ABSOLUTEX_252(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  return cyclesTaken;
}
instructions[252] = SKW_ABSOLUTEX_252;
function SBC_ABSOLUTEX_253(cpu, memory) {
  let cyclesTaken = 4;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  if (((address + cpu.regX) & 0xFF00) !== (address & 0xFF00)) { // Only do dummy read if page boundary crossed
    cyclesTaken++;
    cpu.incrementSubcycle();
    memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  }
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
  const temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
  cpu.setSign((temp & 0x80) > 0);
  cpu.setZero((temp & 0xFF) === 0);
  cpu.setOverflow(((cpu.regA ^ temp) & 0x80) && ((cpu.regA ^ operationModeData) & 0x80));
  cpu.setCarry(temp >= 0 && temp < 0x100);
  cpu.regA = (temp & 0xFF);
  return cyclesTaken;
}
instructions[253] = SBC_ABSOLUTEX_253;
function INC_ABSOLUTEX_254(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[254] = INC_ABSOLUTEX_254;
function INS_ABSOLUTEX_255(cpu, memory) {
  const cyclesTaken = 7;
  const address = cpu.read16FromMemNoWrap((cpu.getPC() + 1) & 0xFFFF);
  const readInValue = (address + cpu.regX) & 0xFFFF;
  cpu.incrementSubcycle();
  memory.read8((address & 0xFF00) | ((address + cpu.regX) & 0xFF));
  cpu.setPC((cpu.getPC() + 3) & 0xFFFF);
  cpu.incrementSubcycle();
  const operationModeData = memory.read8(readInValue);
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
instructions[255] = INS_ABSOLUTEX_255;

export default instructions;
