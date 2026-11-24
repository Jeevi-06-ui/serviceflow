/**
 * Utility for exporting data to CSV format and triggering browser download.
 */
export function exportToCSV<T>(
  filename: string,
  data: T[],
  columns: { header: string; key: keyof T | ((row: T) => any) }[]
) {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const headers = columns.map((col) => `"${col.header.replace(/"/g, '""')}"`).join(',');
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const val = typeof col.key === 'function' ? col.key(row) : (row as any)[col.key];
        const strVal = val === undefined || val === null ? '' : String(val);
        return `"${strVal.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
