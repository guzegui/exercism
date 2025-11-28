export class Matrix {
  private matrixData: number[][];

  constructor(input: string) {
    this.matrixData = input.split('\n').map(row =>
      row.split(' ').map(Number)
    );
  }

  get rows(): number[][] {
    return this.matrixData;
  }

  get columns(): number[][] {
    if (this.matrixData.length === 0) {
      return [];
    }

    const numColumns = this.matrixData[0].length;
    const columns: number[][] = Array.from({ length: numColumns }, () => []);

    for (let r = 0; r < this.matrixData.length; r++) {
      for (let c = 0; c < numColumns; c++) {
        columns[c].push(this.matrixData[r][c]);
      }
    }
    return columns;
  }
}
