class AppState {
  private static instance: AppState;
  private dbCleared: boolean = false;

  private constructor() {}

  static getInstance(): AppState {
    if (!AppState.instance) {
      AppState.instance = new AppState();
    }
    return AppState.instance;
  }

  setDbCleared(cleared: boolean): void {
    this.dbCleared = cleared;
  }

  isDbCleared(): boolean {
    return this.dbCleared;
  }
}

export default AppState;
