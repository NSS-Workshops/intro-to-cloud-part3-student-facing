// 02-arrays-and-loops.js
// Practice arrays, loop basics, and simple calculations.

const nums = [1, 3, 5, 2, 10];

// 1) Sum all numbers in nums and store in total.
let total = 0;
/* TODO: use a for...of loop to add each number to total */
for (const n of nums) total += n;

// 2) Find the largest number and store in maxNum.
let maxNum = /* TODO: start at first item */ nums[0];
/* TODO: loop through nums and update maxNum */
for (const n of nums) if (n > maxNum) maxNum = n;

// 3) Count how many numbers are even; store in evenCount.
let evenCount = 0;
/* TODO: loop and check n % 2 === 0 */
for (const n of nums) if (n % 2 === 0) evenCount++;

// 4) Make a new array doubled that has each value * 2.
const doubled = [];
/* TODO: push n*2 for each n into doubled */
for (const n of nums) doubled.push(n * 2);

// ----------- Test output -----------
console.log({ nums, total, maxNum, evenCount, doubled });
// Example expected:
// { nums: [1,3,5,2,10], total: 21, maxNum: 10, evenCount: 2, doubled: [2,6,10,4,20] }
