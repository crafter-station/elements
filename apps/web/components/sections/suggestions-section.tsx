import { ElementSuggestionForm } from "@/components/element-suggestion-form";

export function SuggestionsSection() {
  return (
    <div
      id="suggest"
      className="w-full border-t border-border border-dotted px-8 py-16"
    >
      <div className="max-w-2xl mx-auto">
        <ElementSuggestionForm />
      </div>
    </div>
  );
}
