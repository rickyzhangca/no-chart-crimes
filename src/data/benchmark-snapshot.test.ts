import { describe, expect, it } from "vitest";

import {
  benchmarkDefinitions,
  buildBenchmarkRows,
  DEFAULT_SELECTED_MODEL_IDS,
  getDefaultSelectedModels,
  getModelsByIds,
  modelSummaries,
} from "./benchmark-snapshot";

describe("benchmark snapshot helpers", () => {
  it("contains a small benchmark and model snapshot", () => {
    expect(modelSummaries.length).toBeGreaterThanOrEqual(4);
    expect(benchmarkDefinitions.length).toBeGreaterThanOrEqual(6);
  });

  it("has benchmark definitions for every vendored score key", () => {
    const benchmarkIds = new Set(
      benchmarkDefinitions.map((benchmark) => benchmark.id)
    );
    const scoreIds = new Set(
      modelSummaries.flatMap((model) => Object.keys(model.scores))
    );

    expect(
      [...scoreIds].filter((scoreId) => !benchmarkIds.has(scoreId))
    ).toEqual([]);
  });

  it("resolves default selected models in declared order", () => {
    const selected = getDefaultSelectedModels();

    expect(selected.map((model) => model.id)).toEqual(
      DEFAULT_SELECTED_MODEL_IDS
    );
  });

  it("builds benchmark rows for selected models and preserves missing scores", () => {
    const rows = buildBenchmarkRows(["claude-opus-4-6", "claude-opus-4-1"]);
    const sweVerified = rows.find((row) => row.benchmark.id === "swe_v");

    expect(sweVerified?.scores["claude-opus-4-6"]).toEqual({
      value: 80.8,
      measured: "2026-03",
      source: "https://scale.com/leaderboard",
    });
    expect(sweVerified?.scores["claude-opus-4-1"]).toBeUndefined();
  });

  it("resolves selected models in caller order", () => {
    const selected = getModelsByIds(["gpt-5-4", "claude-opus-4-6"]);

    expect(selected.map((model) => model.id)).toEqual([
      "gpt-5-4",
      "claude-opus-4-6",
    ]);
  });

  it("builds benchmark rows with score keys in selected model order", () => {
    const rows = buildBenchmarkRows(["gpt-5-4", "claude-opus-4-6"]);
    const sweVerified = rows.find((row) => row.benchmark.id === "swe_v");

    expect(Object.keys(sweVerified?.scores)).toEqual([
      "gpt-5-4",
      "claude-opus-4-6",
    ]);
  });
});
