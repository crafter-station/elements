"use client";

import { SchemaViewer } from "@/registry/default/blocks/devtools/schema-viewer/components/elements/schema-viewer";

const sampleSchema = {
  title: "User",
  description: "A user in the system",
  type: "object",
  required: ["id", "email"],
  properties: {
    id: {
      type: "string",
      format: "uuid",
      description: "Unique identifier",
    },
    email: {
      type: "string",
      format: "email",
      description: "User email address",
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 100,
    },
    age: {
      type: "integer",
      minimum: 0,
      maximum: 150,
    },
    roles: {
      type: "array",
      items: {
        type: "string",
        enum: ["admin", "user", "guest"],
      },
    },
  },
};

export default function SchemaViewerDemo() {
  return (
    <div className="w-full max-w-xl p-4">
      <SchemaViewer schema={sampleSchema} showExamples />
    </div>
  );
}
