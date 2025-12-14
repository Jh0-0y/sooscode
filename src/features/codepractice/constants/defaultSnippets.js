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
      html: `<div id="app">...</div>`,
      css: `body { ... }`,
      js: `document.getElementById("btn")...`,
    }


};