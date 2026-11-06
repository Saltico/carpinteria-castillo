// src/lib/analytics.ts
// Analytics module: listens to DOM events and re-emits them to GTM dataLayer.
// Respects Consent Mode: trackEvent only pushes to dataLayer; GTM decides whether the tag runs.

export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export function initAnalytics() {
  // Click delegation: mailto, tel, outbound links, file downloads
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement)?.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.startsWith('tel:')) {
      trackEvent('phone_click', { link_type: 'phone' });
    } else if (href.startsWith('mailto:')) {
      trackEvent('email_click', { link_type: 'email' });
    } else if (/\.(pdf|zip|doc|docx)($|\?)/i.test(href)) {
      trackEvent('file_download', { file_type: href.split('.').pop()?.toLowerCase() });
    } else if (a.hostname && a.hostname !== location.hostname) {
      trackEvent('outbound_link', { link_domain: a.hostname });
    }
  });
}
