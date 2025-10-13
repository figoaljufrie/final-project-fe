import React from "react";

export interface PollingOptions {
  interval?: number; // milliseconds between polls
  maxAttempts?: number; // maximum number of polling attempts
  onStatusChange?: (newStatus: string) => void;
  onError?: (error: unknown) => void;
  onMaxAttemptsReached?: () => void;
}

export class StatusPolling {
  private intervalId: NodeJS.Timeout | null = null;
  private attempts = 0;
  private options: Required<PollingOptions>;

  constructor(
    private fetchStatus: () => Promise<{ status: string }>,
    options: PollingOptions = {}
  ) {
    this.options = {
      interval: options.interval || 3000, // 3 seconds default
      maxAttempts: options.maxAttempts || 20, // 1 minute default (20 * 3s)
      onStatusChange: options.onStatusChange || (() => {}),
      onError: options.onError || (() => {}),
      onMaxAttemptsReached: options.onMaxAttemptsReached || (() => {}),
    };
  }

  start(initialStatus?: string): void {
    if (this.intervalId) {
      this.stop();
    }

    this.attempts = 0;
    this.poll(initialStatus);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.attempts = 0;
  }

  private async poll(initialStatus?: string): Promise<void> {
    try {
      const result = await this.fetchStatus();
      this.attempts++;

      // Check if status changed
      if (initialStatus && result.status !== initialStatus) {
        this.options.onStatusChange(result.status);
        this.stop();
        return;
      }

      // Check if max attempts reached
      if (this.attempts >= this.options.maxAttempts) {
        this.options.onMaxAttemptsReached();
        this.stop();
        return;
      }

      // Schedule next poll
      this.intervalId = setTimeout(() => {
        this.poll(initialStatus);
      }, this.options.interval);
    } catch (error) {
      this.options.onError(error);
      this.attempts++;

      // Continue polling on error unless max attempts reached
      if (this.attempts < this.options.maxAttempts) {
        this.intervalId = setTimeout(() => {
          this.poll(initialStatus);
        }, this.options.interval);
      } else {
        this.options.onMaxAttemptsReached();
        this.stop();
      }
    }
  }

  isPolling(): boolean {
    return this.intervalId !== null;
  }

  getAttempts(): number {
    return this.attempts;
  }
}

/**
 * Hook for React components to use status polling
 */
export function useStatusPolling(
  fetchStatus: () => Promise<{ status: string }>,
  options: PollingOptions = {}
) {
  const polling = React.useMemo(() => new StatusPolling(fetchStatus, options), [fetchStatus, options]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      polling.stop();
    };
  }, [polling]);

  return polling;
}

