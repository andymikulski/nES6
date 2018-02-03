import BaseMapper from './BaseMapper.js';
import {
	PPU_MIRRORING_SINGLESCREEN_NT0,
	PPU_MIRRORING_SINGLESCREEN_NT1,
} from '../../config/consts.js';

export default class Mapper7 extends BaseMapper {
	reset() {
		this.switch32kPrgBank( 0 );

		if ( this.get8kChrBankCount() === 0 ) {
			this.useVRAM();
		} else {
			this.switch8kChrBank( 0 );
		}

		this.mirroringMethod = PPU_MIRRORING_SINGLESCREEN_NT0;
		this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
	}

	write8PrgRom( offset, data ) {
		this.mainboard.synchroniser.synchronise();
		this.switch32kPrgBank( data & 0xFF );

		var mirroringMethod;
		if ( ( data & 0x10 ) > 0 ){
			mirroringMethod = PPU_MIRRORING_SINGLESCREEN_NT1;
		} else {
			mirroringMethod = PPU_MIRRORING_SINGLESCREEN_NT0;
		}

		this.mainboard.ppu.changeMirroringMethod( mirroringMethod );
	}
}
