const codes = {
  A: 0x00, // 0000
  P: 0x01, // 0001
  Z: 0x02, // 0010
  L: 0x03, // 0011
  G: 0x04, // 0100
  I: 0x05, // 0101
  T: 0x06, // 0110
  Y: 0x07, // 0111
  E: 0x08, // 1000
  O: 0x09, // 1001
  X: 0x0A, // 1010
  U: 0x0B, // 1011
  K: 0x0C, // 1100
  S: 0x0D, // 1101
  V: 0x0E, // 1110
  N: 0x0F, // 1111
};

const ggcodeArray = new Int32Array(8);

const codeCache = {};
export function stringToCodeArray(codeString) {
  if (codeCache[codeString]) {
    for (let i = 0; i < codeString.length; ++i) {
      const code = codes[codeString[i]];
      if (code === undefined) {
        throw new Error('Invalid character in game genie code');
      }
      ggcodeArray[i] = code;
    }
    codeCache[codeString] = ggcodeArray;
  }

  return codeCache[codeString];
}

export function processGenieCode(mainboard, codeString, enable) {
  const length = codeString.length;

  if (length !== 6 && length !== 8) {
    throw new Error(`Invalid game genie code entered '${codeString}'`);
  }

  if (enable) {
    const code = stringToCodeArray(codeString);

    // Char # |   0   |   1   |   2   |   3   |   4   |   5   |
    // Bit  # |3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|
    // maps to|1|6|7|8|H|2|3|4|-|I|J|K|L|A|B|C|D|M|N|O|5|E|F|G|
    if (codeString.length === 6) {
      let value = (code[0] & 0x7); // 678
      value |= (code[5] & 0x8); // 5
      value |= (code[1] & 0x7) << 4; // 234
      value |= (code[0] & 0x8) << 4; // 1

      let address = (code[4] & 0x7); // MNO
      address |= (code[3] & 0x8); // L
      address |= (code[2] & 0x7) << 4; // IJK
      address |= (code[1] & 0x8) << 4; // H
      address |= (code[5] & 0x7) << 8; // EFG
      address |= (code[4] & 0x8) << 8; // D
      address |= (code[3] & 0x7) << 12; // ABC

      mainboard.cart.memoryMapper.gameGeniePoke(codeString, address + 0x8000, value, -1);
    } else if (codeString.length === 8) {
      // Note: Similar to 6 character code but '5' is in different place
      // Char # |   0   |   1   |   2   |   3   |   4   |   5   |   6   |   7   |
      // Bit  # |3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|
      // maps to|1|6|7|8|H|2|3|4|-|I|J|K|L|A|B|C|D|M|N|O|%|E|F|G|!|^|&|*|5|@|#|$|
      // compareValue = !@#$%^&*
      let value = (code[0] & 0x7); // 678
      value |= (code[7] & 0x8); // 5
      value |= (code[1] & 0x7) << 4; // 234
      value |= (code[0] & 0x8) << 4; // 1

      let address = (code[4] & 0x7); // MNO
      address |= (code[3] & 0x8); // L
      address |= (code[2] & 0x7) << 4; // IJK
      address |= (code[1] & 0x8) << 4; // H
      address |= (code[5] & 0x7) << 8; // EFG
      address |= (code[4] & 0x8) << 8; // D
      address |= (code[3] & 0x7) << 12; // ABC

      let compareValue = (code[6] & 0x7); // ^&*
      compareValue |= (code[5] & 0x8); // %
      compareValue |= (code[7] & 0x7) << 4; // @#$
      compareValue |= (code[6] & 0x8) << 4; // !

      // It then checks the value to be replaced with the compare
      // value, if they are the same it replaces the original value with the new
      // value if not the value remains the same.
      mainboard.cart.memoryMapper.gameGeniePoke(codeString, address + 0x8000, value, compareValue);
    }
  } else {
    mainboard.cart.memoryMapper.removeGameGeniePoke(codeString);
  }
}
