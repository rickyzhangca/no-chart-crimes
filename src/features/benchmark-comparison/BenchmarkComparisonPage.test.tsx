import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { BenchmarkComparisonPage } from './BenchmarkComparisonPage'

describe('BenchmarkComparisonPage', () => {
  it('shows the default selected models on first render', () => {
    render(<BenchmarkComparisonPage />)

    expect(
      screen.getByRole('heading', { name: 'No Chart Crimes' }),
    ).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Claude Opus 4.6' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Gemini 3.1 Pro' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'GPT-5.4' })).toBeVisible()
  })

  it('updates table columns when models are toggled', async () => {
    const user = userEvent.setup()

    render(<BenchmarkComparisonPage />)

    await user.click(screen.getByLabelText('GPT-5.4 OpenAI'))

    expect(screen.getByRole('columnheader', { name: 'Claude Opus 4.6' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Gemini 3.1 Pro' })).toBeVisible()
    expect(
      screen.queryByRole('columnheader', { name: 'GPT-5.4' }),
    ).not.toBeInTheDocument()
  })

  it('shows the empty table state when all default models are deselected', async () => {
    const user = userEvent.setup()

    render(<BenchmarkComparisonPage />)

    await user.click(screen.getByLabelText('Claude Opus 4.6 Anthropic'))
    await user.click(screen.getByLabelText('Gemini 3.1 Pro Google'))
    await user.click(screen.getByLabelText('GPT-5.4 OpenAI'))

    expect(screen.getByText('Select at least one model to compare.')).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Benchmarks' })).toBeVisible()
    expect(
      screen.queryByRole('columnheader', { name: 'Claude Opus 4.6' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('columnheader', { name: 'Gemini 3.1 Pro' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('columnheader', { name: 'GPT-5.4' }),
    ).not.toBeInTheDocument()
  })
})
