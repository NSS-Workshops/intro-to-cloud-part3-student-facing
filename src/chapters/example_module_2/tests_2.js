import { TestResult } from '@nss-workshops/nss-core';

export const tests = [
  {
    name: "Check total sum of numbers",
    test: (code) => {
      try {
        const fn = new Function(`${code}; return total;`);
        const result = fn();
        const expected = 21;
        return result === expected
          ? new TestResult({ passed: true })
          : new TestResult({ passed: false, message: `Expected total = ${expected}, got ${result}` });
      } catch (e) {
        return new TestResult({ passed: false, message: e.message });
      }
    },
    message: "Should correctly compute sum of array values",
  },
  {
    name: "Check maximum number and doubled array",
    test: (code) => {
      try {
        const fn = new Function(`${code}; return { maxNum, doubled };`);
        const result = fn();
        const expected = { maxNum: 10, doubled: [2, 6, 10, 4, 20] };
        return JSON.stringify(result) === JSON.stringify(expected)
          ? new TestResult({ passed: true })
          : new TestResult({ passed: false, message: `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}` });
      } catch (e) {
        return new TestResult({ passed: false, message: e.message });
      }
    },
    message: "Should find maximum and produce doubled array",
  },
  {
    name: "Check even number count",
    test: (code) => {
      try {
        const fn = new Function(`${code}; return evenCount;`);
        const result = fn();
        const expected = 2;
        return result === expected
          ? new TestResult({ passed: true })
          : new TestResult({ passed: false, message: `Expected evenCount = ${expected}, got ${result}` });
      } catch (e) {
        return new TestResult({ passed: false, message: e.message });
      }
    },
    message: "Should correctly count even numbers in array",
  },
]
