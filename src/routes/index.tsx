import { createFileRoute } from "@tanstack/react-router";

import { BenchmarkComparisonPage } from "../features/benchmark-comparison/benchmark-comparison-page";

export const Route = createFileRoute("/")({
  component: BenchmarkComparisonPage,
});
