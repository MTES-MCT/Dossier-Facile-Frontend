const AnalyticsService = {
  sendEvent(name: string, data: any) {
    window._paq.push(['trackEvent', data.event_category, name, data.event_label]);
  },
  redirectFranceRenov() {
    this.sendEvent('france-renov', {
      event_category: 'property',
    });
  },
};

export default AnalyticsService;
