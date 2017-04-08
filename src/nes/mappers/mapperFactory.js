/* Estimated number of games with mapper (other mappers had <10 games)
✓ Mapper 004: 569
✓ Mapper 001: 481
✓ Mapper 000: 260
✓ Mapper 002: 200
Mapper 003: 145
Mapper 007: 56
Mapper 011: 35
Mapper 019: 32
Mapper 016: 26
Mapper 099: 25
Mapper 005: 24
Mapper 018: 16
Mapper 066: 16
Mapper 033: 15
Mapper 079: 15
Mapper 045: 14
Mapper 071: 14
Mapper 113: 12
Mapper 245: 11
Mapper 023: 11
Mapper 069: 11
*/


import Mapper0 from './Mapper0';
import Mapper1 from './Mapper1';
import Mapper2 from './Mapper2';
import Mapper4 from './Mapper4';
import Mapper5 from './Mapper5';
import Mapper7 from './Mapper7';
import Mapper9 from './Mapper9';

const mapperDict = {
	0: Mapper0,
	1: Mapper1,
	2: Mapper2,
	4: Mapper4,
	5: Mapper5,
	7: Mapper7,
	9: Mapper9,
};

export default function mapperFactory( mapperId, mainboard, mirroringMethod ) {
	return new Promise((resolve, reject) => {
		var MapperClass = mapperDict[mapperId];
		if (!mapperDict.hasOwnProperty(mapperId) || !MapperClass ) {
			throw new Error( 'Mapper id ' + mapperId + ' is not supported' );
		}

		var mapper = new MapperClass(mainboard, mirroringMethod);
		if (mapper.init) {
			mapper.init();
		}

		resolve(mapper);
	});
}
