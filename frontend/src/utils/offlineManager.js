// Offline action queue manager
class OfflineManager {
  constructor() {
    this.queue = [];
    this.loadQueue();
  }

  loadQueue() {
    const stored = localStorage.getItem('offlineQueue');
    if (stored) {
      this.queue = JSON.parse(stored);
    }
  }

  saveQueue() {
    localStorage.setItem('offlineQueue', JSON.stringify(this.queue));
  }

  addAction(action) {
    this.queue.push({
      ...action,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    });
    this.saveQueue();
  }

  async processQueue() {
    if (!navigator.onLine) {
      return;
    }

    const actions = [...this.queue];
    this.queue = [];
    this.saveQueue();

    for (const action of actions) {
      try {
        await this.executeAction(action);
      } catch (err) {
        console.error('Failed to execute offline action:', err);
        // Re-add to queue if failed
        this.queue.push(action);
        this.saveQueue();
      }
    }
  }

  async executeAction(action) {
    // Implement action execution based on type
    const response = await fetch(action.url, {
      method: action.method,
      headers: action.headers,
      body: action.body ? JSON.stringify(action.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Action failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export const offlineManager = new OfflineManager();

// Listen for online event
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    offlineManager.processQueue();
  });

  // Process queue on page load if online
  if (navigator.onLine) {
    offlineManager.processQueue();
  }
}

