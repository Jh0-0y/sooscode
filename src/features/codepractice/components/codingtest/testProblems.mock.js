// codepractice/codingtest/testProblems.mock.js

export const testProblems = [
  {
    id: 1,
    title: "n의 배수",
    difficulty: 1,
    description: `
정수 num과 n이 주어질 때,
num이 n의 배수이면 1을, 아니면 0을 반환하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  const [num, n] = input.split(" ").map(Number);
  return num % n === 0 ? 1 : 0;
}`
    },
    testCases: [
      { input: "98 2", output: "1" },
      { input: "34 3", output: "0" }
    ]
  },

  {
    id: 2,
    title: "문자열 길이 구하기",
    difficulty: 1,
    description: `
문자열이 주어질 때 문자열의 길이를 반환하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  return input.length;
}`
    },
    testCases: [
      { input: "hello", output: "5" },
      { input: "abcde", output: "5" }
    ]
  },

  {
    id: 3,
    title: "짝수 홀수 판별",
    difficulty: 1,
    description: `
정수 n이 주어질 때 짝수면 "even", 홀수면 "odd"를 반환하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  const n = Number(input);
  return n % 2 === 0 ? "even" : "odd";
}`
    },
    testCases: [
      { input: "4", output: "even" },
      { input: "7", output: "odd" }
    ]
  },

  {
    id: 4,
    title: "두 수의 합",
    difficulty: 1,
    description: `
두 정수가 주어질 때 두 수의 합을 반환하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  const [a, b] = input.split(" ").map(Number);
  return a + b;
}`
    },
    testCases: [
      { input: "3 5", output: "8" },
      { input: "10 20", output: "30" }
    ]
  },

  {
    id: 5,
    title: "최댓값 구하기",
    difficulty: 1,
    description: `
공백으로 구분된 숫자들 중 최댓값을 반환하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  const nums = input.split(" ").map(Number);
  return Math.max(...nums);
}`
    },
    testCases: [
      { input: "1 3 5 2", output: "5" },
      { input: "10 9 8", output: "10" }
    ]
  },

  {
    id: 6,
    title: "문자 포함 여부",
    difficulty: 1,
    description: `
문자열 s와 문자 c가 주어질 때,
s에 c가 포함되면 1, 아니면 0을 반환하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  const [s, c] = input.split(" ");
  return s.includes(c) ? 1 : 0;
}`
    },
    testCases: [
      { input: "hello e", output: "1" },
      { input: "world a", output: "0" }
    ]
  },

  {
    id: 7,
    title: "문자열 뒤집기",
    difficulty: 1,
    description: `
문자열을 뒤집어서 반환하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  return input.split("").reverse().join("");
}`
    },
    testCases: [
      { input: "abc", output: "cba" },
      { input: "hello", output: "olleh" }
    ]
  },

  {
    id: 8,
    title: "공백 제거",
    difficulty: 1,
    description: `
문자열의 모든 공백을 제거하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  return input.replace(/\\s/g, "");
}`
    },
    testCases: [
      { input: "a b c", output: "abc" },
      { input: " hello world ", output: "helloworld" }
    ]
  },

  {
    id: 9,
    title: "배열 길이",
    difficulty: 1,
    description: `
공백으로 구분된 값들의 개수를 반환하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  return input.split(" ").length;
}`
    },
    testCases: [
      { input: "1 2 3", output: "3" },
      { input: "a b c d", output: "4" }
    ]
  },

  {
    id: 10,
    title: "대문자 변환",
    difficulty: 1,
    description: `
문자열을 모두 대문자로 변환하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  return input.toUpperCase();
}`
    },
    testCases: [
      { input: "hello", output: "HELLO" },
      { input: "Code", output: "CODE" }
    ]
  },

  {
    id: 11,
    title: "소문자 변환",
    difficulty: 1,
    description: `
문자열을 모두 소문자로 변환하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  return input.toLowerCase();
}`
    },
    testCases: [
      { input: "HELLO", output: "hello" },
      { input: "Code", output: "code" }
    ]
  },

  {
    id: 12,
    title: "첫 글자 반환",
    difficulty: 1,
    description: `
문자열의 첫 글자를 반환하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  return input[0];
}`
    },
    testCases: [
      { input: "hello", output: "h" },
      { input: "world", output: "w" }
    ]
  },

  {
    id: 13,
    title: "마지막 글자 반환",
    difficulty: 1,
    description: `
문자열의 마지막 글자를 반환하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  return input[input.length - 1];
}`
    },
    testCases: [
      { input: "hello", output: "o" },
      { input: "abc", output: "c" }
    ]
  },

  {
    id: 14,
    title: "숫자 합 구하기",
    difficulty: 2,
    description: `
공백으로 구분된 숫자들의 합을 구하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  return input.split(" ").map(Number).reduce((a, b) => a + b, 0);
}`
    },
    testCases: [
      { input: "1 2 3", output: "6" },
      { input: "10 20", output: "30" }
    ]
  },

  {
    id: 15,
    title: "평균 구하기",
    difficulty: 2,
    description: `
공백으로 구분된 숫자들의 평균을 구하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  const nums = input.split(" ").map(Number);
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}`
    },
    testCases: [
      { input: "2 4 6", output: "4" },
      { input: "1 2 3 4", output: "2.5" }
    ]
  },

  {
    id: 16,
    title: "문자 개수 세기",
    difficulty: 2,
    description: `
문자열과 문자가 주어질 때 해당 문자의 개수를 반환하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  const [s, c] = input.split(" ");
  return [...s].filter(v => v === c).length;
}`
    },
    testCases: [
      { input: "hello l", output: "2" },
      { input: "banana a", output: "3" }
    ]
  },

  {
    id: 17,
    title: "문자열 반복",
    difficulty: 2,
    description: `
문자열과 숫자 n이 주어질 때 문자열을 n번 반복하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  const [s, n] = input.split(" ");
  return s.repeat(Number(n));
}`
    },
    testCases: [
      { input: "ab 3", output: "ababab" },
      { input: "x 5", output: "xxxxx" }
    ]
  },

  {
    id: 18,
    title: "배열 정렬",
    difficulty: 2,
    description: `
공백으로 구분된 숫자들을 오름차순으로 정렬하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  return input
    .split(" ")
    .map(Number)
    .sort((a, b) => a - b)
    .join(" ");
}`
    },
    testCases: [
      { input: "3 1 2", output: "1 2 3" },
      { input: "5 4 6", output: "4 5 6" }
    ]
  },

  {
    id: 19,
    title: "최소값 구하기",
    difficulty: 2,
    description: `
공백으로 구분된 숫자들 중 최소값을 반환하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  return Math.min(...input.split(" ").map(Number));
}`
    },
    testCases: [
      { input: "3 1 2", output: "1" },
      { input: "9 8 7", output: "7" }
    ]
  },

  {
    id: 20,
    title: "문자열 비교",
    difficulty: 2,
    description: `
두 문자열이 같으면 1, 다르면 0을 반환하세요.
    `,
    languages: ["js"],
    template: {
      js: `function solution(input) {
  const [a, b] = input.split(" ");
  return a === b ? 1 : 0;
}`
    },
    testCases: [
      { input: "hello hello", output: "1" },
      { input: "hello world", output: "0" }
    ]
  }
];
