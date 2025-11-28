export class GradeSchool {
  private _roster: Map<number, string[]>;

  constructor() {
    this._roster = new Map<number, string[]>();
  }

  roster(): Record<number, string[]> {
    const sortedGrades = Array.from(this._roster.keys()).sort((a, b) => a - b);
    const result: Record<number, string[]> = {};

    for (const grade of sortedGrades) {
      // Return a copy of the array to prevent external modification
      result[grade] = [...(this._roster.get(grade) || [])];
    }
    return result;
  }

  add(name: string, grade: number) {
    // Remove student from any other grade they might be in
    for (const [g, students] of this._roster.entries()) {
      if (students.includes(name)) {
        this._roster.set(g, students.filter(s => s !== name));
      }
    }

    // Add student to the specified grade
    let studentsInGrade = this._roster.get(grade) || [];
    if (!studentsInGrade.includes(name)) { // Prevent adding the same student twice to the same grade
        studentsInGrade.push(name);
        studentsInGrade.sort(); // Keep students in grade sorted alphabetically
        this._roster.set(grade, studentsInGrade);
    }
  }

  grade(grade: number): string[] {
    // Return a copy of the array to prevent external modification
    return [...(this._roster.get(grade) || [])];
  }
}
