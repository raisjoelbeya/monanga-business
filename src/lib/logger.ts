// Niveaux de log
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// Configuration des niveaux de log
const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Vérifier si on est en environnement de développement
const isDev = process.env.NODE_ENV === 'development';

// Niveau de log courant (par défaut: 'info' en production, 'debug' en développement)
const currentLogLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || (isDev ? 'debug' : 'info');

// Fonction utilitaire pour formater les messages de log
function formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta, null, isDev ? 2 : 0)}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
}

// Objet logger
export const logger = {
  error(message: string, error?: Error, meta?: Record<string, unknown>) {
    if (LOG_LEVELS[currentLogLevel] >= LOG_LEVELS.error) {
      const errorMeta = error ? { error: error.message, stack: error.stack } : {};
      console.error(formatMessage('error', message, { ...errorMeta, ...meta }));
    }
  },
  
  warn(message: string, meta?: Record<string, unknown>) {
    if (LOG_LEVELS[currentLogLevel] >= LOG_LEVELS.warn) {
      console.warn(formatMessage('warn', message, meta));
    }
  },
  
  info(message: string, meta?: Record<string, unknown>) {
    if (LOG_LEVELS[currentLogLevel] >= LOG_LEVELS.info) {
      console.log(formatMessage('info', message, meta));
    }
  },
  
  debug(message: string, meta?: Record<string, unknown>) {
    if (LOG_LEVELS[currentLogLevel] >= LOG_LEVELS.debug) {
      console.debug(formatMessage('debug', message, meta));
    }
  },
};

// Type pour le logger
export type Logger = typeof logger;
