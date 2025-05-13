import { Server } from "./server";

/**
 * App singleton class to maintain compatibility with existing code
 */
class App {
  private static instance: App;
  private server: Server;

  private constructor() {
    this.server = new Server();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  /**
   * Get the Express application
   */
  public getExpressApp() {
    return this.server.getApp();
  }
}

// Export the Express app for compatibility
export default App.getInstance().getExpressApp();
