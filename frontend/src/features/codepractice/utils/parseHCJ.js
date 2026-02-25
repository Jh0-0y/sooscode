// Backend로부터 받은 fullHTML을 구조분해하는 함수

export function parseHCJ(fullHTML) {
  const htmlMatch = fullHTML.match(/<body[^>]*>([\s\S]*?)<script>/i);
  const cssMatch = fullHTML.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const jsMatch = fullHTML.match(/<script[^>]*>([\s\S]*?)<\/script>/i);

  return {
    html: htmlMatch?.[1]?.trim() || "",
    css: cssMatch?.[1]?.trim() || "",
    js: jsMatch?.[1]?.trim() || "",
  };
}

// 백엔드로 보내기 또는 FULL HTML 합칠때 사용하는 util

export function buildHCJ({ html = "", css = "", js = "" }) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${js}
  </script>
</body>
</html>`;
}
