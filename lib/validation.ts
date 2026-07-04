// Validation & Error Handling Utilities

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Validation schemas
export const validators = {
  // Connection validators
  connectionName: (name: string) => {
    if (!name || typeof name !== 'string') {
      throw new ValidationError('name', 'Connection name is required');
    }
    if (name.trim().length < 2) {
      throw new ValidationError('name', 'Connection name must be at least 2 characters');
    }
    if (name.length > 50) {
      throw new ValidationError('name', 'Connection name must not exceed 50 characters');
    }
    return name.trim();
  },

  robloxUserId: (id: any) => {
    const strId = String(id || '').trim();
    if (!strId) {
      throw new ValidationError('robloxUserId', 'Roblox User ID is required');
    }
    if (!/^\d+$/.test(strId)) {
      throw new ValidationError('robloxUserId', 'Roblox User ID must contain only numbers');
    }
    return strId;
  },

  authToken: (token: string) => {
    if (!token || typeof token !== 'string') {
      throw new ValidationError('authToken', 'Auth Token is required');
    }
    if (token.trim().length < 10) {
      throw new ValidationError('authToken', 'Auth Token appears to be invalid (too short)');
    }
    return token.trim();
  },

  // Account validators
  username: (username: string) => {
    if (!username || typeof username !== 'string') {
      throw new ValidationError('username', 'Username is required');
    }
    if (username.trim().length < 1) {
      throw new ValidationError('username', 'Username is required');
    }
    if (username.length > 100) {
      throw new ValidationError('username', 'Username must not exceed 100 characters');
    }
    // Allow any characters for Roblox usernames
    return username.trim();
  },

  password: (password: string) => {
    if (!password || typeof password !== 'string') {
      throw new ValidationError('password', 'Password is required');
    }
    if (password.length < 4) {
      throw new ValidationError('password', 'Password must be at least 4 characters');
    }
    if (password.length > 100) {
      throw new ValidationError('password', 'Password must not exceed 100 characters');
    }
    return password;
  },

  // ID validators
  connectionId: (id: string) => {
    if (!id || typeof id !== 'string' || !id.startsWith('conn_')) {
      throw new ValidationError('connectionId', 'Invalid connection ID');
    }
    return id;
  },

  accountId: (id: string) => {
    if (!id || typeof id !== 'string' || !id.startsWith('acc_')) {
      throw new ValidationError('accountId', 'Invalid account ID');
    }
    return id;
  },

  // Action validators
  action: (action: string) => {
    const validActions = ['join_game', 'collect_item', 'buy_item', 'trade_item'];
    if (!validActions.includes(action)) {
      throw new ValidationError('action', `Invalid action. Must be one of: ${validActions.join(', ')}`);
    }
    return action;
  },
};

// Safe JSON parsing
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('[v0] JSON parse error:', error);
    return fallback;
  }
}

// Error response formatter
export function formatErrorResponse(error: unknown) {
  if (error instanceof ValidationError) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        field: error.field,
      },
    };
  }

  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    };
  }

  const message = error instanceof Error ? error.message : String(error);
  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: { originalMessage: message },
    },
  };
}

// Success response formatter
export function formatSuccessResponse<T>(data: T, message = 'Success') {
  return {
    success: true,
    message,
    data,
  };
}

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Clean old attempts
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  reset(key: string) {
    this.attempts.delete(key);
  }
}

// Common error messages
export const ERROR_MESSAGES = {
  CONNECTION_NOT_FOUND: 'Connection not found',
  ACCOUNT_NOT_FOUND: 'Account not found',
  ACTIVITY_NOT_FOUND: 'Activity not found',
  INVALID_REQUEST: 'Invalid request',
  UNAUTHORIZED: 'Unauthorized',
  DUPLICATE_CONNECTION: 'Connection with this name already exists',
  DUPLICATE_ACCOUNT: 'Account with this username already exists in this connection',
  BOT_ALREADY_RUNNING: 'Bot is already running',
  BOT_NOT_RUNNING: 'Bot is not running',
  NO_ACCOUNTS_AVAILABLE: 'No accounts available for this connection',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  SERVER_ERROR: 'Internal server error',
};
