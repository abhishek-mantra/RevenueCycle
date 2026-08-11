export function exportToCsv<T extends Record<string, any>>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T; label: string }[]
) {
  if (!rows || !rows.length) return;

  const keys = headers ? headers.map((h) => h.key) : (Object.keys(rows[0]) as (keyof T)[]);
  const headerLabels = headers ? headers.map((h) => h.label) : keys.map(String);

  const csvLines: string[] = [];
  csvLines.push(headerLabels.map((l) => `"${l.replace(/"/g, '""')}"`).join(","));

  for (const row of rows) {
    const values = keys.map((k) => {
      const val = row[k];
      if (val === null || val === undefined) return '""';
      if (typeof val === "object") return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvLines.push(values.join(","));
  }

  const csvString = csvLines.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
