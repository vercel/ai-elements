"use client";

import type { UIMessage } from "ai";
import {
  BarChartIcon,
  BoxIcon,
  CodeSquareIcon,
  GraduationCapIcon,
  NotepadTextIcon,
} from "lucide-react";
import { nanoid } from "nanoid";

// Mock messages as Map of user message text -> assistant message parts
export const mockMessages = new Map<string, UIMessage["parts"]>([
  [
    "Can you explain how to use React hooks effectively?",
    [
      {
        type: "source-url",
        sourceId: nanoid(),
        url: "https://react.dev/reference/react",
        title: "React Documentation",
      },
      {
        type: "source-url",
        sourceId: nanoid(),
        url: "https://react.dev/reference/react-dom",
        title: "React DOM Documentation",
      },
      //       {
      //         type: "tool-mcp",
      //         toolCallId: nanoid(),
      //         state: "output-available" as const,
      //         input: {
      //           query: "React hooks best practices",
      //           source: "react.dev",
      //         },
      //         output: `{
      //   "query": "React hooks best practices",
      //   "results": [
      //     {
      //       "title": "Rules of Hooks",
      //       "url": "https://react.dev/warnings/invalid-hook-call-warning",
      //       "snippet": "Hooks must be called at the top level of your React function components or custom hooks. Don't call hooks inside loops, conditions, or nested functions."
      //     },
      //     {
      //       "title": "useState Hook",
      //       "url": "https://react.dev/reference/react/useState",
      //       "snippet": "useState is a React Hook that lets you add state to your function components. It returns an array with two values: the current state and a function to update it."
      //     },
      //     {
      //       "title": "useEffect Hook",
      //       "url": "https://react.dev/reference/react/useEffect",
      //       "snippet": "useEffect lets you synchronize a component with external systems. It runs after render and can be used to perform side effects like data fetching."
      //     }
      //   ]
      // }`,
      //       },
      {
        type: "text",
        text: `# React Hooks Best Practices

React hooks are a powerful feature that let you use state and other React features without writing classes. Here are some tips for using them effectively:

## Rules of Hooks

1. **Only call hooks at the top level** of your component or custom hooks
2. **Don't call hooks inside loops, conditions, or nested functions**

## Common Hooks

- **useState**: For local component state
- **useEffect**: For side effects like data fetching
- **useContext**: For consuming context
- **useReducer**: For complex state logic
- **useCallback**: For memoizing functions
- **useMemo**: For memoizing values

## Example of useState and useEffect

\`\`\`jsx
function ProfilePage({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // This runs after render and when userId changes
    fetchUser(userId).then(userData => {
      setUser(userData);
    });
  }, [userId]);
  
  return user ? <Profile user={user} /> : <Loading />;
}
\`\`\`

Would you like me to explain any specific hook in more detail?`,
      },
    ],
  ],
  [
    "Yes, could you explain useCallback and useMemo in more detail? When should I use one over the other?",
    [
      {
        type: "reasoning",
        text: `The user is asking for a detailed explanation of useCallback and useMemo. I should provide a clear and concise explanation of each hook's purpose and how they differ.
      
The useCallback hook is used to memoize functions to prevent unnecessary re-renders of child components that receive functions as props.

The useMemo hook is used to memoize values to avoid expensive recalculations on every render.

Both hooks help with performance optimization, but they serve different purposes.`,
      },
      {
        type: "text",
        text: `## useCallback vs useMemo

Both hooks help with *performance optimization*, but they serve different purposes:

### useCallback

\`useCallback\` memoizes **functions** to prevent unnecessary re-renders of child components that receive functions as props.

\`\`\`jsx
// Without useCallback - a new function is created on every render
const handleClick = () => {
  console.log(count);
};

// With useCallback - the function is only recreated when dependencies change
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);
\`\`\`

### useMemo

\`useMemo\` memoizes **values** to avoid expensive recalculations on every render.

\`\`\`jsx
// Without useMemo - expensive calculation runs on every render
const sortedList = expensiveSort(items);

// With useMemo - calculation only runs when items change
const sortedList = useMemo(() => expensiveSort(items), [items]);
\`\`\`

### When to use which?

- Use **useCallback** when:
  - Passing callbacks to optimized child components that rely on reference equality
  - Working with event handlers that you pass to child components

- Use **useMemo** when:
  - You have computationally expensive calculations
  - You want to avoid recreating objects that are used as dependencies for other hooks

### Performance Note

Don't overuse these hooks! They come with their own overhead. Only use them when you have identified a genuine performance issue.

### ~~Deprecated Methods~~

Note that ~~class-based lifecycle methods~~ like \`componentDidMount\` are now replaced by the \`useEffect\` hook in modern React development.`,
      },
    ],
  ],
]);

export const userMessageTexts = Array.from(mockMessages.keys());

export const suggestions = [
  { icon: BarChartIcon, text: "Analyze data", color: "#76d0eb" },
  { icon: BoxIcon, text: "Surprise me", color: "#76d0eb" },
  { icon: NotepadTextIcon, text: "Summarize text", color: "#ea8444" },
  { icon: CodeSquareIcon, text: "Code", color: "#6c71ff" },
  { icon: GraduationCapIcon, text: "Get advice", color: "#76d0eb" },
  { icon: null, text: "More" },
];

export const mockResponses = [
  "That's a great question! Let me help you understand this concept better. The key thing to remember is that proper implementation requires careful consideration of the underlying principles and best practices in the field.",
  "I'd be happy to explain this topic in detail. From my understanding, there are several important factors to consider when approaching this problem. Let me break it down step by step for you.",
  "This is an interesting topic that comes up frequently. The solution typically involves understanding the core concepts and applying them in the right context. Here's what I recommend...",
  "Great choice of topic! This is something that many developers encounter. The approach I'd suggest is to start with the fundamentals and then build up to more complex scenarios.",
  "That's definitely worth exploring. From what I can see, the best way to handle this is to consider both the theoretical aspects and practical implementation details.",
];

export const getLastUserMessageText = (messages: UIMessage[]) => {
  const lastUserMessage = [...messages]
    .reverse()
    .find((msg) => msg.role === "user");
  const textPart = lastUserMessage?.parts.find((p) => p.type === "text");
  return textPart && "text" in textPart ? textPart.text : "";
};
