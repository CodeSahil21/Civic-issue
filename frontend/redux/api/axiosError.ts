import { AxiosError } from "axios";

const sanitizeErrorMessage = (message: string): string => {
  // Check if message contains stack trace or is too long
  if (message.includes('stack') || message.includes('Error:') || message.length > 150) {
    return 'An error occurred. Please try again.';
  }
  
  // Check for common network errors
  if (message.toLowerCase().includes('network') || message.toLowerCase().includes('connection')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Check for database errors
  if (message.toLowerCase().includes('database') || message.toLowerCase().includes('db')) {
    return 'Service temporarily unavailable. Please try again later.';
  }
  
  // Check for server errors
  if (message.toLowerCase().includes('internal server error') || message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  return message;
};

const handleAxiosError = (error: unknown, defaultMessage: string): string => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || error.message || defaultMessage;
    return sanitizeErrorMessage(message);
  }
  if (error instanceof Error) {
    return sanitizeErrorMessage(error.message || defaultMessage);
  }
  return defaultMessage;
};

export { handleAxiosError };