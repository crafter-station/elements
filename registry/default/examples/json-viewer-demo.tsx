"use client";

import { JsonViewer } from "@/registry/default/blocks/devtools/json-viewer/components/elements/json-viewer";

const sampleData = {
  name: "John Doe",
  age: 30,
  email: "john@example.com",
  address: {
    street: "123 Main St",
    city: "San Francisco",
    country: "USA",
  },
  hobbies: ["coding", "reading", "gaming"],
  active: true,
};

export default function JsonViewerDemo() {
  return (
    <div className="w-full max-w-xl p-4">
      <JsonViewer data={sampleData} searchable copyPath />
    </div>
  );
}
