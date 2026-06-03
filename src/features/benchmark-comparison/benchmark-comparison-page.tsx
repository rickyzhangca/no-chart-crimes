import { useMemo, useState } from "react";

import {
  buildBenchmarkRows,
  DEFAULT_SELECTED_MODEL_IDS,
  getModelsByIds,
  modelSummaries,
} from "../../data/benchmark-snapshot";
import { BenchmarkTable } from "./benchmark-table";
import { ModelSelector } from "./model-selector";

export function BenchmarkComparisonPage() {
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    ...DEFAULT_SELECTED_MODEL_IDS,
  ]);

  const selectedModels = useMemo(
    () => getModelsByIds(selectedModelIds),
    [selectedModelIds]
  );
  const rows = useMemo(
    () => buildBenchmarkRows(selectedModelIds),
    [selectedModelIds]
  );

  return (
    <main>
      <header>
        <h1>No Chart Crimes</h1>
        <p>
          Compare AI model benchmark scores without charts, hidden axes, or
          vendor-written summaries.
        </p>
      </header>

      <ModelSelector
        models={modelSummaries}
        onSelectedModelIdsChange={setSelectedModelIds}
        selectedModelIds={selectedModelIds}
      />

      <BenchmarkTable rows={rows} selectedModels={selectedModels} />
    </main>
  );
}
