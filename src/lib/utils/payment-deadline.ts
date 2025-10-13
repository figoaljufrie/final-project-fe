// Payment deadline configurations (Feature 2: 1 hour for all payment methods)
const PAYMENT_DEADLINES = {
  manual_transfer: 1, // hours
  payment_gateway: 1, // hours
} as const;

// Get deadline hours for payment method
export function getDeadlineHours(paymentMethod: string): number {
  return PAYMENT_DEADLINES[paymentMethod as keyof typeof PAYMENT_DEADLINES] || 24;
}

// Calculate time remaining from deadline
export function calculateTimeRemaining(deadlineDate: string | Date): {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
} {
  // Ensure we're working with UTC dates to avoid timezone issues
  const deadline = new Date(deadlineDate);
  const now = new Date();
  
  // Validate dates
  if (isNaN(deadline.getTime()) || isNaN(now.getTime())) {
    console.warn('Invalid date provided to calculateTimeRemaining:', deadlineDate);
    return { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: true };
  }
  
  const diff = deadline.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: true };
  }
  
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return { hours, minutes, seconds, totalSeconds, isExpired: false };
}

// Get deadline text for payment method
export function getDeadlineText(paymentMethod: string): string {
  const hours = getDeadlineHours(paymentMethod);
  return hours === 1 ? '1 hour' : `${hours} hours`;
}

// Get formatted deadline message
export function getDeadlineMessage(paymentMethod: string): string {
  return `Complete payment within ${getDeadlineText(paymentMethod)}`;
}

// Format time remaining for display
export function formatTimeRemaining(hours: number, minutes: number, seconds: number): string {
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}
