import type { ModelSummary } from "../../data/benchmark-snapshot";

interface ModelSelectorProps {
  models: readonly ModelSummary[];
  onSelectedModelIdsChange: (modelIds: string[]) => void;
  selectedModelIds: readonly string[];
}

export function ModelSelector({
  models,
  selectedModelIds,
  onSelectedModelIdsChange,
}: ModelSelectorProps) {
  const selectedIds = new Set(selectedModelIds);

  function toggleModel(modelId: string) {
    if (selectedIds.has(modelId)) {
      onSelectedModelIdsChange(
        selectedModelIds.filter((selectedId) => selectedId !== modelId)
      );
      return;
    }

    onSelectedModelIdsChange([...selectedModelIds, modelId]);
  }

  return (
    <section aria-labelledby="model-selector-heading">
      <h2 id="model-selector-heading">Models</h2>
      <div>
        {models.map((model) => (
          <label key={model.id}>
            <input
              checked={selectedIds.has(model.id)}
              onChange={() => toggleModel(model.id)}
              type="checkbox"
            />{" "}
            {model.name} <span>{model.provider}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
