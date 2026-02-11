import { TestResult } from '@nss-workshops/nss-core';

export const tests = [
  {
    name: "Check variable and string values",
    test: (code) => {
      try {
        const fn = new Function(`${code}; return { firstName, greeting, nameLength, upperName, lowerName, combo };`);
        const result = fn();
        const expected = {
          firstName: "Alex",
          greeting: "Hello, Alex!",
          nameLength: 4,
          upperName: "ALEX",
          lowerName: "alex",
          combo: "JS is fun",
        };
        return JSON.stringify(result) === JSON.stringify(expected)
          ? new TestResult({ passed: true })
          : new TestResult({ passed: false, message: `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}` });
      } catch (e) {
        return new TestResult({ passed: false, message: e.message });
      }
    },
    message: "Should define all variables with expected string values",
  },
  {
    name: "Greeting uses template literal",
    test: (code) => {
      try {
        if (!code.includes('`Hello, ${firstName}!`')) {
          return new TestResult({ passed: false, message: "Greeting must use template literal syntax" });
        }
        return new TestResult({ passed: true });
      } catch (e) {
        return new TestResult({ passed: false, message: e.message });
      }
    },
    message: "Should use template literal for greeting",
  },
]
