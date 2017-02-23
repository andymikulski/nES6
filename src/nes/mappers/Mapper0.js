import BaseMapper from './BaseMapper.js';

export default class Mapper0 extends BaseMapper {
	reset() {
		if (this.get32kPrgBankCount() >= 1) {
			this.switch32kPrgBank(0);
		} else if (this.get16kPrgBankCount() == 1) {
			this.switch16kPrgBank(0, true);
			this.switch16kPrgBank(0, false);
		}

		if (this.get1kChrBankCount() === 0) {
			this.useVRAM();
		} else {
			this.switch8kChrBank(0);
		}

		this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);
	}
}

