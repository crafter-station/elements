"use client";

import { useState } from "react";

import { EnvEditor } from "@/registry/default/blocks/devtools/env-editor/components/elements/env-editor";

const initialEnvVars = [
  { key: "DATABASE_URL", value: "postgresql://localhost:5432/mydb" },
  { key: "API_KEY", value: "sk_live_abc123xyz" },
  { key: "NODE_ENV", value: "development" },
];

export default function EnvEditorDemo() {
  const [envVars, setEnvVars] = useState(initialEnvVars);

  return (
    <div className="w-full max-w-2xl p-4">
      <EnvEditor value={envVars} onChange={setEnvVars} masked />
    </div>
  );
}
