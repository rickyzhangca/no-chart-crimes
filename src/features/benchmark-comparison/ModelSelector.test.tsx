import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { modelSummaries } from '../../data/benchmarkSnapshot'
import { ModelSelector } from './ModelSelector'

describe('ModelSelector', () => {
  it('renders one checkbox per model with provider labels', () => {
    const selectedModelIds = ['claude-opus-4-6']
    const selectedIds = new Set(selectedModelIds)

    render(
      <ModelSelector
        models={modelSummaries}
        selectedModelIds={selectedModelIds}
        onSelectedModelIdsChange={() => undefined}
      />,
    )

    expect(screen.getAllByRole('checkbox')).toHaveLength(modelSummaries.length)

    for (const model of modelSummaries) {
      const checkbox = screen.getByLabelText(`${model.name} ${model.provider}`)

      if (selectedIds.has(model.id)) {
        expect(checkbox).toBeChecked()
      } else {
        expect(checkbox).not.toBeChecked()
      }
    }
  })

  it('adds and removes model ids when checkboxes change', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    function ControlledModelSelector() {
      const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
        'claude-opus-4-6',
      ])

      return (
        <ModelSelector
          models={modelSummaries}
          selectedModelIds={selectedModelIds}
          onSelectedModelIdsChange={(nextSelectedModelIds) => {
            onChange(nextSelectedModelIds)
            setSelectedModelIds(nextSelectedModelIds)
          }}
        />
      )
    }

    render(<ControlledModelSelector />)

    const claudeCheckbox = screen.getByLabelText('Claude Opus 4.6 Anthropic')
    const geminiCheckbox = screen.getByLabelText('Gemini 3.1 Pro Google')

    await user.click(geminiCheckbox)
    expect(claudeCheckbox).toBeChecked()
    expect(geminiCheckbox).toBeChecked()
    expect(onChange).toHaveBeenLastCalledWith([
      'claude-opus-4-6',
      'gemini-3-1-pro',
    ])

    await user.click(claudeCheckbox)
    expect(claudeCheckbox).not.toBeChecked()
    expect(geminiCheckbox).toBeChecked()
    expect(onChange).toHaveBeenLastCalledWith(['gemini-3-1-pro'])
  })
})
