export const DEFAULT_SNIPPETS = {
  PYTHON: `# 기본 Python 코드 템플릿
user = {"name": "효상", "age": 27}
print(user["name"])
print(user["age"] + 3)
`,

  JAVA: `public class Main {
    public static void main(String[] args) {
        System.out.println("Java 기본 실행 코드!");
    }
}
`,
  CSS_HTML_JS: {
  html: `<div id="app">
  <h1>HCJ Playground</h1>
  <p class="desc">HTML · CSS · JavaScript 실시간 테스트</p>
  <button id="btn">Run Action</button>
</div>`,
  css: `:root {
  --bg: #0f172a;
  --card: #111827;
  --text: #e5e7eb;
  --accent: #4f46e5;
}

body {
  margin: 0;
  padding: 24px;
  background: var(--bg);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--text);
}

#app {
  max-width: 420px;
  margin: 0 auto;
  padding: 24px;
  background: var(--card);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

h1 {
  margin: 0 0 8px;
  font-size: 24px;
}

.desc {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 16px;
}

#btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  font-size: 14px;
  cursor: pointer;
}

#btn:hover {
  filter: brightness(1.1);
}`,
  js: `const btn = document.getElementById("btn");

btn.addEventListener("click", () => {
  btn.textContent = "Running...";
  btn.disabled = true;

  setTimeout(() => {
    alert("HCJ Playground 실행 완료");
    btn.textContent = "Run Action";
    btn.disabled = false;
  }, 600);
});`,
}



};