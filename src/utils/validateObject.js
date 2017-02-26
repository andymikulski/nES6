// There is almost definitely a better way/library to do this sort of validation.
// But, it works for now!

export default function validateObject(schema, object) {
  let passing = true;
  let reason = '';

  for (const prop in object) {
    const givenValue = object[prop];

    if (schema.hasOwnProperty(prop)) {
      const typeWanted = schema[prop];

      // if the validation has `is/with` properties, we check that the given value
      // _IS_ an instance of the type given, filled _WITH_ instances of whatever we need
      if (typeWanted.is) {
        passing = givenValue instanceof typeWanted.is || givenValue === typeWanted.is || typeof givenValue === (typeWanted.is.name || '').toLowerCase();

        // not passing = dont bother checking contents
        if (passing && typeWanted.with) {
          givenValue.forEach(val => {
            if (!(val instanceof typeWanted.with)) {
              passing = false;
              reason = `- Expected "${typeWanted.with.name}" inside array`
            }
          });
        }
        // if the validation is an array, they are a list acceptable values
      } else if (typeWanted instanceof Array) {
        passing = !!typeWanted.find(requiredValue => givenValue === requiredValue);
        reason = `- Expected a value of: ["${typeWanted.join('", "')}"]`
          // if the validation is a function, it's a custom deal that we just test
          // against the given value
      } else if (typeWanted instanceof Function) {
        passing = typeWanted(givenValue);
        // anything else, and we missed it!
      } else {
        throw new Error(`Validation error checking "${prop}"`);
      }

      if (!passing) {
        throw new Error(`Invalid value for nES6 option "${prop}" ${ reason }`);
      }

    } else if (!schema.hasOwnProperty(prop)) {
      throw new Error(`Unrecognized nES6 option "${prop}"`);
    }
  }

  return passing;
}
