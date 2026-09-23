import type { ReactNode } from 'react';

export interface DataColumn<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
}

interface DataListProps<T> {
  columns: DataColumn<T>[];
  data: T[];
  getKey: (item: T) => string | number;
  emptyMessage: string;
  loading?: boolean;
}

export default function DataList<T>({
  columns,
  data,
  getKey,
  emptyMessage,
  loading = false,
}: DataListProps<T>) {
  if (loading) {
    return <div className="state-box">Carregando dados...</div>;
  }

  if (data.length === 0) {
    return <div className="state-box">{emptyMessage}</div>;
  }

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={getKey(item)}>
              {columns.map((column) => (
                <td key={column.key} data-label={column.header}>
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
