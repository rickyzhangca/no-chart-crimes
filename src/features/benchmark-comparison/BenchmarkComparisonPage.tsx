import { useMemo, useState } from 'react'

import {
  DEFAULT_SELECTED_MODEL_IDS,
  buildBenchmarkRows,
  getModelsByIds,
  modelSummaries,
} from '../../data/benchmarkSnapshot'
import { BenchmarkTable } from './BenchmarkTable'
import { ModelSelector } from './ModelSelector'

export function BenchmarkComparisonPage() {
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    ...DEFAULT_SELECTED_MODEL_IDS,
  ])

  const selectedModels = useMemo(
    () => getModelsByIds(selectedModelIds),
    [selectedModelIds],
  )
  const rows = useMemo(
    () => buildBenchmarkRows(selectedModelIds),
    [selectedModelIds],
  )

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
        selectedModelIds={selectedModelIds}
        onSelectedModelIdsChange={setSelectedModelIds}
      />

      <BenchmarkTable rows={rows} selectedModels={selectedModels} />
    </main>
  )
}
