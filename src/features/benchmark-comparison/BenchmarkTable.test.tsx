import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  buildBenchmarkRows,
  modelSummaries,
} from '../../data/benchmarkSnapshot'
import { BenchmarkTable } from './BenchmarkTable'

describe('BenchmarkTable', () => {
  it('renders benchmark rows and selected model columns', () => {
    const selectedModels = modelSummaries.filter((model) =>
      ['claude-opus-4-6', 'gemini-3-1-pro'].includes(model.id),
    )

    render(
      <BenchmarkTable
        rows={buildBenchmarkRows(selectedModels.map((model) => model.id))}
        selectedModels={selectedModels}
      />,
    )

    expect(screen.getByRole('columnheader', { name: 'Benchmark' })).toBeVisible()
    expect(
      screen.getByRole('columnheader', { name: 'Claude Opus 4.6' }),
    ).toBeVisible()
    expect(
      screen.getByRole('columnheader', { name: 'Gemini 3.1 Pro' }),
    ).toBeVisible()
    expect(
      screen.getByRole('rowheader', { name: 'SWE-Bench Verified' }),
    ).toBeVisible()

    const sweRow = screen.getByRole('row', {
      name: /SWE-Bench Verified 80.8 80.6/,
    })
    expect(within(sweRow).getByText('80.8')).toBeVisible()
    expect(within(sweRow).getByText('80.6')).toBeVisible()
  })

  it('renders a dash for missing scores', () => {
    const selectedModels = modelSummaries.filter((model) =>
      ['claude-opus-4-6', 'claude-opus-4-1'].includes(model.id),
    )

    render(
      <BenchmarkTable
        rows={buildBenchmarkRows(selectedModels.map((model) => model.id))}
        selectedModels={selectedModels}
      />,
    )

    const sweRow = screen.getByRole('row', {
      name: /SWE-Bench Verified 80.8 -/,
    })
    expect(within(sweRow).getByText('-')).toBeVisible()
  })

  it('shows an empty state when no models are selected', () => {
    render(<BenchmarkTable rows={buildBenchmarkRows([])} selectedModels={[]} />)

    expect(screen.getByRole('heading', { name: 'Benchmarks' })).toBeVisible()
    expect(screen.getByText('Select at least one model to compare.')).toBeVisible()
  })

  it('preserves selected model order in column headers', () => {
    const selectedModels = ['gemini-3-1-pro', 'claude-opus-4-6'].map((modelId) => {
      const model = modelSummaries.find((candidate) => candidate.id === modelId)

      if (!model) {
        throw new Error(`Missing test model: ${modelId}`)
      }

      return model
    })

    render(
      <BenchmarkTable
        rows={buildBenchmarkRows(selectedModels.map((model) => model.id))}
        selectedModels={selectedModels}
      />,
    )

    expect(
      screen.getAllByRole('columnheader').map((header) => header.textContent),
    ).toEqual(['Benchmark', 'Gemini 3.1 Pro', 'Claude Opus 4.6'])
  })
})
