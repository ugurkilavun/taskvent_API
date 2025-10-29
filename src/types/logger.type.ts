export type loggerType = {
  requestID?: string,
  timestamp?: Date,
  level: "INFO" | "DEBUG" | "WARN" | "ERROR" | "FATAL" | "REQUEST" | "RESPONSE" | "SECURITY" | "AUDIT" | "PERFORMANCE" | "SYSTEM",
  logType: string,
  message: string,
  service: string,
  userID?: string,
  token?: string,
  username?: string,
  ip?: string,
  endpoint?: string,
  method?: string,
  userAgent?: string,
  statusCode?: number,
  durationMs?: any | undefined,
  details?: {
    error?: "STATCODEERROR" | "SYNTAXERROR" | "SERVERERROR" | "MAILERROR" | "VERIFYERROR",
    stack?: string
  }
};