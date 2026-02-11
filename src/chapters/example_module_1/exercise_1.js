// 01-variables-and-strings.js
// Super simple: practice variables, strings, and template literals.

// 1) Declare a variable called firstName and assign your name as a string.
const firstName = /* TODO: put your name here, e.g., "Alex" */ "Alex";

// 2) Make a greeting string: "Hello, <name>!"
const greeting = /* TODO: use template literals with firstName */ `Hello, ${firstName}!`;

// 3) Save the length of firstName in a variable called nameLength.
const nameLength = /* TODO: get string length */ firstName.length;

// 4) Make all-caps and all-lowercase versions of firstName.
const upperName = /* TODO */ firstName;
const lowerName = /* TODO */ firstName;

// 5) Combine two strings: "JS" + " is fun"
const combo = /* TODO: use + or template literals */ "JS" + " is fun";

// ----------- Test output -----------
console.log({ firstName, greeting, nameLength, upperName, lowerName, combo });
// Example expected:
// { firstName: 'Alex', greeting: 'Hello, Alex!', nameLength: 4, upperName: 'ALEX', lowerName: 'alex', combo: 'JS is fun' }
