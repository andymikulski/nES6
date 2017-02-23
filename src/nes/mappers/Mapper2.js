import BaseMapper from './BaseMapper.js';

export default class Mapper2 extends BaseMapper {
	reset() {
		this.switch16kPrgBank( 0, true );
		this.switch16kPrgBank( this.get16kPrgBankCount() - 1, false );
		this.useVRAM();
		this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
	}

	write8PrgRom( offset, data ) {
	//	this.mainboard.synchroniser.synchronise();
		this.switch16kPrgBank( data, true );
	}
}
