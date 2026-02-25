export const JAVA_SNIPPETS = [
  /* ===================== 기본문법 (10) ===================== */
  {
    id: 1,
    language: "JAVA",
    category: "기본문법",
    title: "변수 선언",
    code: `public class Main {
    public static void main(String[] args) {
        int a = 10;
        String b = "hello";
        System.out.println(a);
        System.out.println(b);
    }
}`,
    isSystem: true,
  },
  {
    id: 2,
    language: "JAVA",
    category: "기본문법",
    title: "산술 연산",
    code: `public class Main {
    public static void main(String[] args) {
        int a = 5;
        int b = 3;
        System.out.println(a + b);
        System.out.println(a * b);
    }
}`,
    isSystem: true,
  },
  {
    id: 3,
    language: "JAVA",
    category: "기본문법",
    title: "if 조건문",
    code: `public class Main {
    public static void main(String[] args) {
        int n = 7;
        if (n % 2 == 0) {
            System.out.println("짝수");
        } else {
            System.out.println("홀수");
        }
    }
}`,
    isSystem: true,
  },
  {
    id: 4,
    language: "JAVA",
    category: "기본문법",
    title: "switch 문",
    code: `public class Main {
    public static void main(String[] args) {
        int day = 2;
        switch (day) {
            case 1 -> System.out.println("월");
            case 2 -> System.out.println("화");
            default -> System.out.println("기타");
        }
    }
}`,
    isSystem: true,
  },
  {
    id: 5,
    language: "JAVA",
    category: "기본문법",
    title: "for 반복문",
    code: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
    }
}`,
    isSystem: true,
  },
  {
    id: 6,
    language: "JAVA",
    category: "기본문법",
    title: "while 반복문",
    code: `public class Main {
    public static void main(String[] args) {
        int i = 1;
        while (i <= 5) {
            System.out.println(i);
            i++;
        }
    }
}`,
    isSystem: true,
  },
  {
    id: 7,
    language: "JAVA",
    category: "기본문법",
    title: "메서드 정의",
    code: `public class Main {

    static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println(add(3, 4));
    }
}`,
    isSystem: true,
  },
  {
    id: 8,
    language: "JAVA",
    category: "기본문법",
    title: "배열 선언",
    code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        System.out.println(arr[1]);
    }
}`,
    isSystem: true,
  },
  {
    id: 9,
    language: "JAVA",
    category: "기본문법",
    title: "문자열 비교",
    code: `public class Main {
    public static void main(String[] args) {
        String a = "hi";
        String b = "hi";
        System.out.println(a.equals(b));
    }
}`,
    isSystem: true,
  },
  {
    id: 10,
    language: "JAVA",
    category: "기본문법",
    title: "출력",
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java");
    }
}`,
    isSystem: true,
  },

  /* ===================== 자료구조 (10) ===================== */
  {
    id: 11,
    language: "JAVA",
    category: "자료구조",
    title: "배열 순회",
    code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4};
        for (int n : arr) {
            System.out.println(n);
        }
    }
}`,
    isSystem: true,
  },
  {
    id: 12,
    language: "JAVA",
    category: "자료구조",
    title: "ArrayList 생성",
    code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        System.out.println(list);
    }
}`,
    isSystem: true,
  },
  {
    id: 13,
    language: "JAVA",
    category: "자료구조",
    title: "ArrayList 순회",
    code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("A");
        list.add("B");
        for (String s : list) {
            System.out.println(s);
        }
    }
}`,
    isSystem: true,
  },
  {
    id: 14,
    language: "JAVA",
    category: "자료구조",
    title: "HashMap 사용",
    code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();
        map.put("a", 1);
        System.out.println(map.get("a"));
    }
}`,
    isSystem: true,
  },
  {
    id: 15,
    language: "JAVA",
    category: "자료구조",
    title: "HashMap 순회",
    code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();
        map.put("a", 1);
        map.put("b", 2);
        for (String k : map.keySet()) {
            System.out.println(k);
        }
    }
}`,
    isSystem: true,
  },
  {
    id: 16,
    language: "JAVA",
    category: "자료구조",
    title: "Stack",
    code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Stack<Integer> st = new Stack<>();
        st.push(1);
        st.push(2);
        System.out.println(st.pop());
    }
}`,
    isSystem: true,
  },
  {
    id: 17,
    language: "JAVA",
    category: "자료구조",
    title: "Queue",
    code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Queue<Integer> q = new LinkedList<>();
        q.add(1);
        q.add(2);
        System.out.println(q.poll());
    }
}`,
    isSystem: true,
  },
  {
    id: 18,
    language: "JAVA",
    category: "자료구조",
    title: "Set",
    code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Set<Integer> set = new HashSet<>();
        set.add(1);
        set.add(1);
        System.out.println(set.size());
    }
}`,
    isSystem: true,
  },
  {
    id: 19,
    language: "JAVA",
    category: "자료구조",
    title: "정렬",
    code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> list = Arrays.asList(3, 1, 2);
        Collections.sort(list);
        System.out.println(list);
    }
}`,
    isSystem: true,
  },
  {
    id: 20,
    language: "JAVA",
    category: "자료구조",
    title: "배열 복사",
    code: `public class Main {
    public static void main(String[] args) {
        int[] a = {1, 2, 3};
        int[] b = a.clone();
        System.out.println(b[0]);
    }
}`,
    isSystem: true,
  },

  /* ===================== 알고리즘 (10) ===================== */
  {
    id: 21,
    language: "JAVA",
    category: "알고리즘",
    title: "최댓값",
    code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {3, 5, 1};
        int max = arr[0];
        for (int n : arr) {
            if (n > max) max = n;
        }
        System.out.println(max);
    }
}`,
    isSystem: true,
  },
  {
    id: 22,
    language: "JAVA",
    category: "알고리즘",
    title: "합계",
    code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        int sum = 0;
        for (int n : arr) sum += n;
        System.out.println(sum);
    }
}`,
    isSystem: true,
  },
  {
    id: 23,
    language: "JAVA",
    category: "알고리즘",
    title: "평균",
    code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        int sum = 0;
        for (int n : arr) sum += n;
        System.out.println(sum / arr.length);
    }
}`,
    isSystem: true,
  },
  {
    id: 24,
    language: "JAVA",
    category: "알고리즘",
    title: "문자열 뒤집기",
    code: `public class Main {
    public static void main(String[] args) {
        String s = "abc";
        String r = "";
        for (int i = s.length() - 1; i >= 0; i--) {
            r += s.charAt(i);
        }
        System.out.println(r);
    }
}`,
    isSystem: true,
  },
  {
    id: 25,
    language: "JAVA",
    category: "알고리즘",
    title: "짝수 개수",
    code: `public class Main {
    public static void main(String[] args) {
        int[] a = {1, 2, 4, 5};
        int c = 0;
        for (int n : a) {
            if (n % 2 == 0) c++;
        }
        System.out.println(c);
    }
}`,
    isSystem: true,
  },
  {
    id: 26,
    language: "JAVA",
    category: "알고리즘",
    title: "피보나치",
    code: `public class Main {
    public static void main(String[] args) {
        int a = 0, b = 1;
        for (int i = 0; i < 5; i++) {
            System.out.println(a);
            int t = a + b;
            a = b;
            b = t;
        }
    }
}`,
    isSystem: true,
  },
  {
    id: 27,
    language: "JAVA",
    category: "알고리즘",
    title: "문자 길이",
    code: `public class Main {
    public static void main(String[] args) {
        String s = "hello";
        System.out.println(s.length());
    }
}`,
    isSystem: true,
  },
  {
    id: 28,
    language: "JAVA",
    category: "알고리즘",
    title: "최소값",
    code: `public class Main {
    public static void main(String[] args) {
        int[] a = {3, 2, 5};
        int m = a[0];
        for (int n : a) {
            if (n < m) m = n;
        }
        System.out.println(m);
    }
}`,
    isSystem: true,
  },
  {
    id: 29,
    language: "JAVA",
    category: "알고리즘",
    title: "문자 포함",
    code: `public class Main {
    public static void main(String[] args) {
        String s = "hello";
        System.out.println(s.contains("e"));
    }
}`,
    isSystem: true,
  },
  {
    id: 30,
    language: "JAVA",
    category: "알고리즘",
    title: "값 카운트",
    code: `public class Main {
    public static void main(String[] args) {
        int[] a = {1, 1, 2, 1};
        int cnt = 0;
        for (int n : a) {
            if (n == 1) cnt++;
        }
        System.out.println(cnt);
    }
}`,
    isSystem: true,
  },
];
