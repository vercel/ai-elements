import type {
  ReasoningUIPart,
  SourceUrlUIPart,
  TextUIPart,
  ToolUIPart,
  UIMessage,
} from "ai";
import { isReasoningUIPart, isStaticToolUIPart, isTextUIPart } from "ai";
import type { LucideIcon } from "lucide-react";
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

// Ordered sequence of user messages for auto-play demo.
// useDemoChat sends the first message on mount, then auto-sends
// each subsequent message after the previous response completes.
export const scriptedUserMessages = [...mockMessages.keys()];

// Map of message text -> all versions (for MessageBranch UI)
const messageVersionsMap = new Map<string, string[]>([
  [
    "Yes, could you explain useCallback and useMemo in more detail? When should I use one over the other?",
    [
      "Yes, could you explain useCallback and useMemo in more detail? When should I use one over the other?",
      "I'm particularly interested in understanding when to use useCallback vs useMemo. Can you provide some practical examples?",
      "Thanks for the overview! Could you dive deeper into the performance optimization hooks? I want to understand the tradeoffs.",
    ],
  ],
]);

// Get alternative versions for a user message text
export function getMessageVersions(text: string): string[] | null {
  return messageVersionsMap.get(text) ?? null;
}

export type Suggestion = {
  icon: LucideIcon | null;
  text: string;
  color?: string;
};

export const suggestions: readonly Suggestion[] = [
  { icon: BarChartIcon, text: "Analyze data", color: "#76d0eb" },
  { icon: BoxIcon, text: "Surprise me", color: "#76d0eb" },
  { icon: NotepadTextIcon, text: "Summarize text", color: "#ea8444" },
  { icon: CodeSquareIcon, text: "Code", color: "#6c71ff" },
  { icon: GraduationCapIcon, text: "Get advice", color: "#76d0eb" },
  { icon: null, text: "More" },
];

export const mockResponses: readonly string[] = [
  "That's a great question! Let me help you understand this concept better. The key thing to remember is that proper implementation requires careful consideration of the underlying principles and best practices in the field.",
  "I'd be happy to explain this topic in detail. From my understanding, there are several important factors to consider when approaching this problem. Let me break it down step by step for you.",
  "This is an interesting topic that comes up frequently. The solution typically involves understanding the core concepts and applying them in the right context. Here's what I recommend...",
  "Great choice of topic! This is something that many developers encounter. The approach I'd suggest is to start with the fundamentals and then build up to more complex scenarios.",
  "That's definitely worth exploring. From what I can see, the best way to handle this is to consider both the theoretical aspects and practical implementation details.",
];

export function getLastUserMessageText(messages: UIMessage[]): string {
  const lastUserMessage = messages.findLast((msg) => msg.role === "user");
  const textPart = lastUserMessage?.parts.find(isTextUIPart);
  return textPart?.text ?? "";
}

// Categorized message parts with proper types
export type CategorizedParts = {
  sources: SourceUrlUIPart[];
  reasoning: ReasoningUIPart[];
  tools: ToolUIPart[];
  text: TextUIPart[];
};

// Categorization of message parts. We need this because of branching messages.
export function categorizeMessageParts(
  parts: UIMessage["parts"],
): CategorizedParts {
  const sources: SourceUrlUIPart[] = [];
  const reasoning: ReasoningUIPart[] = [];
  const tools: ToolUIPart[] = [];
  const text: TextUIPart[] = [];

  for (const p of parts) {
    if (isTextUIPart(p)) {
      text.push(p);
    } else if (isReasoningUIPart(p)) {
      reasoning.push(p);
    } else if (isStaticToolUIPart(p)) {
      tools.push(p);
    } else if (p.type === "source-url") {
      sources.push(p);
    }
  }

  return { sources, reasoning, tools, text };
}
