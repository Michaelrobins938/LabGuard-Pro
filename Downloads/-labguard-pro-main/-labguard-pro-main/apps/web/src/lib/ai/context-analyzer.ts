import { LabContext, UserAction } from './biomni-client';

class ContextAnalyzer {
  private actions: UserAction[] = [];
  private pageStartTime: number = Date.now();
  private currentPage: string = '';

  constructor() {
    this.initializeTracking();
  }

  private initializeTracking() {
    // Track page changes
    if (typeof window !== 'undefined') {
      this.currentPage = window.location.pathname;
      this.pageStartTime = Date.now();

      // Track navigation
      window.addEventListener('popstate', () => {
        this.recordAction('navigation', window.location.pathname);
        this.currentPage = window.location.pathname;
        this.pageStartTime = Date.now();
      });

      // Track clicks
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        this.recordAction('click', target.tagName + (target.className ? '.' + target.className : ''));
      });

      // Track form submissions
      document.addEventListener('submit', (e) => {
        const form = e.target as HTMLFormElement;
        this.recordAction('form_submit', form.action || 'unknown');
      });
    }
  }

  recordAction(type: UserAction['type'], target: string, metadata?: any) {
    this.actions.push({
      type,
      timestamp: Date.now(),
      target,
      metadata
    });

    // Keep only last 50 actions
    if (this.actions.length > 50) {
      this.actions = this.actions.slice(-50);
    }
  }

  async getCurrentContext(): Promise<LabContext> {
    return {
      currentPage: this.currentPage,
      timeOnPage: Date.now() - this.pageStartTime,
      recentActions: this.actions.slice(-10), // Last 10 actions
      equipmentData: await this.getEquipmentData(),
      complianceMetrics: await this.getComplianceMetrics(),
      userRole: this.getUserRole(),
      labType: this.getLabType()
    };
  }

  private async getEquipmentData() {
    // In real implementation, fetch from your API
    return [
      {
        id: 'spec-001',
        name: 'Spectrophotometer UV-2600',
        status: 'operational',
        lastCalibration: '2024-01-15',
        nextCalibration: '2024-02-15'
      },
      {
        id: 'cent-002',
        name: 'Centrifuge Model X',
        status: 'operational',
        lastMaintenance: '2024-01-10',
        nextMaintenance: '2024-02-10'
      }
    ];
  }

  private async getComplianceMetrics() {
    // In real implementation, fetch from your API
    return { 
      rate: 98.5, 
      lastUpdated: Date.now(),
      totalEquipment: 145,
      operationalEquipment: 142,
      overdueCalibrations: 2,
      pendingMaintenance: 3
    };
  }

  private getUserRole(): string {
    // Get from auth context or localStorage
    return 'lab_director';
  }

  private getLabType(): string {
    // Get from user settings
    return 'clinical';
  }

  // Public method to update current page
  updateCurrentPage(page: string) {
    this.recordAction('navigation', page);
    this.currentPage = page;
    this.pageStartTime = Date.now();
  }
}

export const contextAnalyzer = new ContextAnalyzer(); 