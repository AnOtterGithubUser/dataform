export function forDataset(dataset: string) {
  return new DatasetAssertion(dataset);
}

export class DatasetAssertion {
  private readonly dataset: string;
  private groupCols: string[] = [];
  constructor(dataset: string) {
    this.dataset = dataset;
  }

  public groupedBy(cols: string | string[]) {
    this.groupCols = typeof cols === "string" ? [cols] : cols;
    return this;
  }

  public getUniqueRowQuery(): string {
    return `
    WITH base AS (
    
    SELECT
      ${this.groupCols.map((field, i) => `${field} as c_${i}`).join(", ")},
      SUM(1) as row_count
    FROM ${this.dataset}
    GROUP BY 
      ${this.groupCols.map((field, i) => `${i+1}`).join(", ")}
    
    )
  
    SELECT
      *
    FROM
      base
    WHERE
      row_count > 1
    `
  }
}