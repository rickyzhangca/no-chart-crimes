import { createFileRoute } from '@tanstack/react-router'

import { BenchmarkComparisonPage } from '../features/benchmark-comparison/BenchmarkComparisonPage'

export const Route = createFileRoute('/')({
  component: BenchmarkComparisonPage,
})
