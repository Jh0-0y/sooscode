export const HCJ_SNIPPETS = [
  /* ===================== 기본문법 (3) ===================== */
  {
    id: 1,
    language: "CSS_HTML_JS",
    category: "기본문법",
    title: "변수 선언",
    description: "JS 변수 선언과 출력",
    code: {
      html: "<div id='app'>Open Console</div>",
      css: "",
      js: "let a = 10;\nconst b = 20;\nconsole.log(a + b);",
    },
    isSystem: true,
  },
  {
    id: 2,
    language: "CSS_HTML_JS",
    category: "기본문법",
    title: "조건문 if",
    description: "조건 분기 처리",
    code: {
      html: "<div>Check Console</div>",
      css: "",
      js: "let n = 7;\nif (n % 2 === 0) {\n  console.log('짝수');\n} else {\n  console.log('홀수');\n}",
    },
    isSystem: true,
  },
  {
    id: 3,
    language: "CSS_HTML_JS",
    category: "기본문법",
    title: "이벤트 처리",
    description: "버튼 클릭 이벤트",
    code: {
      html: "<button id='btn'>Click</button>",
      css: "button { padding: 8px 16px; }",
      js: "document.getElementById('btn').addEventListener('click', () => {\n  alert('clicked');\n});",
    },
    isSystem: true,
  },

  /* ===================== 자료구조 (3) ===================== */
  {
    id: 4,
    language: "CSS_HTML_JS",
    category: "자료구조",
    title: "배열 순회",
    description: "Array forEach",
    code: {
      html: "<div>Array Example</div>",
      css: "",
      js: "const arr = [1, 2, 3, 4];\narr.forEach(n => console.log(n));",
    },
    isSystem: true,
  },
  {
    id: 5,
    language: "CSS_HTML_JS",
    category: "자료구조",
    title: "객체(Object)",
    description: "key-value 구조",
    code: {
      html: "<div>Object Example</div>",
      css: "",
      js: "const user = { name: 'HCJ', age: 27 };\nconsole.log(user.name);\nconsole.log(user.age);",
    },
    isSystem: true,
  },
  {
    id: 6,
    language: "CSS_HTML_JS",
    category: "자료구조",
    title: "Map 사용",
    description: "Map 자료구조",
    code: {
      html: "<div>Map Example</div>",
      css: "",
      js: "const map = new Map();\nmap.set('a', 1);\nmap.set('b', 2);\nconsole.log(map.get('a'));",
    },
    isSystem: true,
  },

  /* ===================== 알고리즘 (3) ===================== */
  {
    id: 7,
    language: "CSS_HTML_JS",
    category: "알고리즘",
    title: "최댓값 찾기",
    description: "배열에서 최대값",
    code: {
      html: "<div>Max Value</div>",
      css: "",
      js: "const arr = [3, 7, 2, 9, 4];\nlet max = arr[0];\nfor (const n of arr) {\n  if (n > max) max = n;\n}\nconsole.log(max);",
    },
    isSystem: true,
  },
  {
    id: 8,
    language: "CSS_HTML_JS",
    category: "알고리즘",
    title: "합계 계산",
    description: "배열 요소 합산",
    code: {
      html: "<div>Sum</div>",
      css: "",
      js: "const arr = [1, 2, 3, 4, 5];\nlet sum = 0;\nfor (const n of arr) sum += n;\nconsole.log(sum);",
    },
    isSystem: true,
  },
  {
    id: 9,
    language: "CSS_HTML_JS",
    category: "알고리즘",
    title: "문자열 뒤집기",
    description: "문자열 처리 알고리즘",
    code: {
      html: "<div>Reverse String</div>",
      css: "",
      js: "const s = 'hello';\nlet r = '';\nfor (let i = s.length - 1; i >= 0; i--) {\n  r += s[i];\n}\nconsole.log(r);",
    },
    isSystem: true,
  },
];
