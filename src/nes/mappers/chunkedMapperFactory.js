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


const loadedMappers = {};

export default function mapperFactory( mapperId, mainboard, mirroringMethod ) {
	return new Promise((resolve, reject) => {
		var MapperClass = loadedMappers[mapperId];

		if (!MapperClass) {
			import(`./Mapper${mapperId}`).then(Mapper => {
				if (!Mapper){
					return reject();
				}

				loadedMappers[mapperId] = Mapper.default;

				var mapper = new loadedMappers[mapperId](mainboard, mirroringMethod);
				if (mapper.init) {
					mapper.init();
				}

				resolve(mapper);
			}).catch(err => {
				reject();
				throw new Error(err);
			});
		} else {
			var mapper = new MapperClass(mainboard, mirroringMethod);
			if (mapper.init) {
				mapper.init();
			}

			resolve(mapper);
		}
	});
}
