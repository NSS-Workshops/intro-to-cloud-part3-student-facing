// 01-variables-and-strings.js
// Super simple: practice variables, strings, and template literals.

// 1) Declare a variable called firstName and assign your name as a string.
const firstName = "Alex";

// 2) Make a greeting string: "Hello, <name>!"
const greeting = `Hello, ${firstName}!`;

// 3) Save the length of firstName in a variable called nameLength.
const nameLength = firstName.length;

// 4) Make all-caps and all-lowercase versions of firstName.
const upperName = firstName.toUpperCase();
const lowerName = firstName.toLowerCase();

// 5) Combine two strings: "JS" + " is fun"
const combo = "JS" + " is fun";

// ----------- Test output -----------
console.log({ firstName, greeting, nameLength, upperName, lowerName, combo });
// Expected:
// { firstName: 'Alex', greeting: 'Hello, Alex!', nameLength: 4, upperName: 'ALEX', lowerName: 'alex', combo: 'JS is fun' }
