import { CodeBlock } from "@/components/ui/code-block";

export default function TestPage() {
  const code = `import ColorInput from "@/components/tinte/color-input";

export default function CustomForm() {
  const [color, setColor] = useState("oklch(0.7 0.15 180)");

  return (
    <ColorInput // [!code highlight]
      value={color}
      onChange={setColor}
    />
  );
}`;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Shiki Empty Lines</h1>
      <CodeBlock code={code} lang="tsx" />
    </div>
  );
}
