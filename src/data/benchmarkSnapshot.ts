export type BenchmarkScore = {
  value: number
  measured: string
  source: string
  notes?: string
}

export type ModelSummary = {
  id: string
  name: string
  provider: string
  tier: number
  scores: Partial<Record<string, BenchmarkScore>>
}

export type BenchmarkDefinition = {
  id: string
  name: string
  category: string
  maxScore: number | null
  lifecycle: string
}

export type BenchmarkRow = {
  benchmark: BenchmarkDefinition
  scores: Record<string, BenchmarkScore | undefined>
}

export const DEFAULT_SELECTED_MODEL_IDS = [
  'claude-opus-4-6',
  'gemini-3-1-pro',
  'gpt-5-4',
] as const

export const benchmarkDefinitions: BenchmarkDefinition[] = [
  { id: 'swe_v', name: 'SWE-Bench Verified', category: 'coding', maxScore: 100, lifecycle: 'active' },
  { id: 'swe_pro', name: 'SWE-Bench Pro', category: 'coding', maxScore: 100, lifecycle: 'active' },
  { id: 'gpqa', name: 'GPQA Diamond', category: 'reasoning', maxScore: 100, lifecycle: 'active' },
  { id: 'hle', name: "HLE (Humanity's Last Exam)", category: 'reasoning', maxScore: 100, lifecycle: 'active' },
  { id: 'arc_agi_2', name: 'ARC-AGI-2', category: 'reasoning', maxScore: 100, lifecycle: 'active' },
  { id: 'terminal_bench_2', name: 'Terminal-Bench 2', category: 'agentic', maxScore: 100, lifecycle: 'active' },
  { id: 'bfcl', name: 'BFCL V4', category: 'tools', maxScore: 100, lifecycle: 'active' },
  { id: 'benchlm', name: 'BenchLM', category: 'general', maxScore: 100, lifecycle: 'active' },
  { id: 'lmarena', name: 'LMArena (ELO)', category: 'preference', maxScore: null, lifecycle: 'active' },
]

export const modelSummaries: ModelSummary[] = [
  {
    id: 'claude-opus-4-6',
    name: 'Claude Opus 4.6',
    provider: 'Anthropic',
    tier: 1,
    scores: {
      swe_v: { value: 80.8, measured: '2026-03', source: 'https://scale.com/leaderboard' },
      swe_pro: { value: 45.9, measured: '2026-03', source: 'https://scale.com/leaderboard' },
      gpqa: { value: 91.3, measured: '2026-03', source: 'https://artificialanalysis.ai/models' },
      hle: { value: 40, measured: '2026-03', source: 'https://www-cdn.anthropic.com/78073f739564e986ff3e28522761a7a0b4484f84.pdf' },
      arc_agi_2: { value: 68.8, measured: '2026-03', source: 'https://arcprize.org' },
      terminal_bench_2: { value: 48.5, measured: '2026-03', source: 'https://github.com/harbor-framework/terminal-bench-2' },
      benchlm: { value: 76, measured: '2026-03', source: 'https://benchlm.ai' },
      lmarena: { value: 1476, measured: '2026-03', source: 'https://lmarena.ai/leaderboard' },
    },
  },
  {
    id: 'gemini-3-1-pro',
    name: 'Gemini 3.1 Pro',
    provider: 'Google',
    tier: 1,
    scores: {
      swe_v: { value: 80.6, measured: '2026-03', source: 'https://scale.com/leaderboard' },
      swe_pro: { value: 43.3, measured: '2026-03', source: 'https://scale.com/leaderboard' },
      gpqa: { value: 94.1, measured: '2026-03', source: 'https://artificialanalysis.ai/models' },
      hle: { value: 37.2, measured: '2026-03', source: 'https://lastexam.ai' },
      arc_agi_2: { value: 77.1, measured: '2026-03', source: 'https://arcprize.org' },
      benchlm: { value: 83, measured: '2026-03', source: 'https://benchlm.ai' },
    },
  },
  {
    id: 'gpt-5-4',
    name: 'GPT-5.4',
    provider: 'OpenAI',
    tier: 1,
    scores: {
      swe_v: { value: 80, measured: '2026-03', source: 'https://scale.com/leaderboard', notes: 'estimated' },
      swe_pro: { value: 41.8, measured: '2026-03', source: 'https://scale.com/leaderboard' },
      gpqa: { value: 92, measured: '2026-03', source: 'https://artificialanalysis.ai/models' },
      hle: { value: 41.6, measured: '2026-03', source: 'https://lastexam.ai' },
      arc_agi_2: { value: 73.3, measured: '2026-03', source: 'https://arcprize.org' },
      terminal_bench_2: { value: 57.6, measured: '2026-03', source: 'https://github.com/harbor-framework/terminal-bench-2' },
      benchlm: { value: 80, measured: '2026-03', source: 'https://benchlm.ai' },
    },
  },
  {
    id: 'claude-opus-4-1',
    name: 'Claude Opus 4.1',
    provider: 'Anthropic',
    tier: 1,
    scores: {
      bfcl: { value: 70.4, measured: '2026-03', source: 'https://gorilla.cs.berkeley.edu/leaderboard.html' },
    },
  },
]

export function getDefaultSelectedModels() {
  return DEFAULT_SELECTED_MODEL_IDS.map((modelId) => {
    const model = modelSummaries.find((candidate) => candidate.id === modelId)

    if (!model) {
      throw new Error(`Default model "${modelId}" is missing from the snapshot`)
    }

    return model
  })
}

export function getModelsByIds(modelIds: readonly string[]) {
  return modelIds
    .map((modelId) => modelSummaries.find((candidate) => candidate.id === modelId))
    .filter((model): model is ModelSummary => Boolean(model))
}

export function buildBenchmarkRows(modelIds: readonly string[]): BenchmarkRow[] {
  const selectedModels = getModelsByIds(modelIds)

  return benchmarkDefinitions.map((benchmark) => ({
    benchmark,
    scores: Object.fromEntries(
      selectedModels.map((model) => [model.id, model.scores[benchmark.id]]),
    ),
  }))
}
