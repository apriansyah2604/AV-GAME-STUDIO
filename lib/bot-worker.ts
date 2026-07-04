import * as storage from '@/lib/storage';

export interface BotAction {
  type: 'join_game' | 'collect_item' | 'buy_item' | 'trade_item' | 'test_connection';
  accountId: string;
  connectionId: string;
  details?: any;
}

export class BotWorker {
  private running = false;
  private workers: Map<string, NodeJS.Timeout> = new Map();

  async executeAction(action: BotAction): Promise<boolean> {
    const account = storage.getAccount(action.accountId);
    if (!account) return false;

    const connection = storage.getConnection(action.connectionId);
    if (!connection) return false;

    // Create activity log entry
    const activityLog = storage.addActivity({
      accountId: action.accountId,
      connectionId: action.connectionId,
      action: this.formatActionName(action.type),
      details: action.details || '',
      status: 'pending',
    });

    // Update account status to working
    storage.updateAccount(action.accountId, { status: 'working' });

    try {
      // Simulate bot action processing
      await this.simulateAction(action);

      // Update activity status to success
      storage.updateActivity(activityLog.id, { status: 'success' });

      // Update account back to ready
      storage.updateAccount(action.accountId, {
        status: 'ready',
        lastActivity: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      // Update activity status to failed
      storage.updateActivity(activityLog.id, {
        status: 'failed',
        details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });

      // Update account status to error
      storage.updateAccount(action.accountId, { status: 'error' });

      return false;
    }
  }

  private async simulateAction(action: BotAction): Promise<void> {
    // Simulate network delay
    const delay = Math.random() * 3000 + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Simulate success (90% of the time)
    if (Math.random() > 0.1) {
      return;
    }

    throw new Error('Action failed (simulated)');
  }

  private formatActionName(type: string): string {
    const names: Record<string, string> = {
      join_game: 'Joined Game',
      collect_item: 'Collected Item',
      buy_item: 'Purchased Item',
      trade_item: 'Traded Item',
      test_connection: 'Connection Test',
    };
    return names[type] || type;
  }

  startWorker(connectionId: string, intervalMs = 30000): void {
    if (this.workers.has(connectionId)) return;

    const interval = setInterval(() => {
      this.processConnection(connectionId);
    }, intervalMs);

    this.workers.set(connectionId, interval);
    this.running = true;
  }

  stopWorker(connectionId: string): void {
    const interval = this.workers.get(connectionId);
    if (interval) {
      clearInterval(interval);
      this.workers.delete(connectionId);
    }
  }

  private processConnection(connectionId: string): void {
    const accounts = storage.getAccountsByConnection(connectionId);
    accounts.forEach(account => {
      // Only process ready accounts
      if (account.status === 'ready') {
        // Simulate periodic checks
        storage.addActivity({
          accountId: account.id,
          connectionId,
          action: 'Auto-check',
          details: 'Periodic account status check',
          status: 'success',
        });
      }
    });
  }

  stopAll(): void {
    this.workers.forEach(interval => clearInterval(interval));
    this.workers.clear();
    this.running = false;
  }

  isRunning(): boolean {
    return this.running;
  }
}

export const botWorker = new BotWorker();
