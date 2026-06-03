import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import type { BenchmarkRow, ModelSummary } from "../../data/benchmark-snapshot";

interface BenchmarkTableProps {
  rows: readonly BenchmarkRow[];
  selectedModels: readonly ModelSummary[];
}

export function BenchmarkTable({ rows, selectedModels }: BenchmarkTableProps) {
  const columns = useMemo<ColumnDef<BenchmarkRow>[]>(
    () => [
      {
        id: "benchmark",
        header: "Benchmark",
        cell: ({ row }) => row.original.benchmark.name,
      },
      ...selectedModels.map<ColumnDef<BenchmarkRow>>((model) => ({
        id: model.id,
        header: model.name,
        cell: ({ row }) => {
          const score = row.original.scores[model.id];

          return score ? String(score.value) : "-";
        },
      })),
    ],
    [selectedModels]
  );

  const table = useReactTable({
    columns,
    data: [...rows],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section aria-labelledby="benchmark-table-heading">
      <h2 id="benchmark-table-heading">Benchmarks</h2>
      {selectedModels.length === 0 ? (
        <p>Select at least one model to compare.</p>
      ) : (
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} scope="col">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const cellContent = flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  );

                  if (cell.column.id === "benchmark") {
                    return (
                      <th key={cell.id} scope="row">
                        {cellContent}
                      </th>
                    );
                  }

                  return <td key={cell.id}>{cellContent}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
