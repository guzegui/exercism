const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class Robot {
  // Add this static property to store all names that have been assigned.
  private static usedNames: Set<string> = new Set<string>();
  // Also, each robot instance needs to store its own current name.
  private _name: string;

  constructor() {
    // Call a method to generate and assign a unique name.
    this._name = this.generateUniqueName();
  }

  public get name(): string {
    console.log(this._name);
    return this._name;
  }

  public resetName(): void {
    // When resetting, the old name is effectively "released" and a new one is generated.
    // For this problem, we need to ensure the *new* name is unique,
    // and the old name is no longer considered "active" for *this* robot.
    // However, the problem implies the old name might still be "used" by another robot,
    // so we don't remove it from the global `usedNames` set here.
    // Instead, we just generate a new unique name for this robot instance.
    this._name = this.generateUniqueName();
  }

  public static releaseNames(): void {
    // This method should clear the set of all used names.
    Robot.usedNames.clear();
  }

  // You will also need to implement a private helper method to generate a unique name.
  private generateUniqueName(): string {
    let newName: string;
    do {
      newName = this.generateRandomName();
    } while (Robot.usedNames.has(newName)); // Keep generating until a unique name is found

    Robot.usedNames.add(newName); // Add the new unique name to the set of used names
    return newName;
  }

  // And a private helper method to generate a random name conforming to the pattern.
  private generateRandomName(): string {
    const num = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const char1 = letters[Math.floor(Math.random() * letters.length)];
    const char2 = letters[Math.floor(Math.random() * letters.length)];
    return `${char1}${char2}${num}`;
  }
}
