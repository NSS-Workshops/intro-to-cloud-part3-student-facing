// 02-arrays-and-loops.js
// Practice arrays, loop basics, and simple calculations.

const nums = [1, 3, 5, 2, 10];

// 1) Sum all numbers in nums and store in total.
let total = 0;
for (const n of nums) total += n;

// 2) Find the largest number and store in maxNum.
let maxNum = nums[0];
for (const n of nums) if (n > maxNum) maxNum = n;

// 3) Count how many numbers are even; store in evenCount.
let evenCount = 0;
for (const n of nums) if (n % 2 === 0) evenCount++;

// 4) Make a new array doubled that has each value * 2.
const doubled = [];
for (const n of nums) doubled.push(n * 2);

// ----------- Test output -----------
console.log({ nums, total, maxNum, evenCount, doubled });
// Expected:
// { nums: [1,3,5,2,10], total: 21, maxNum: 10, evenCount: 2, doubled: [2,6,10,4,20] }
