export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'IPO Intelligence API Layer',
    providerMode: 'DemoProvider (Standby for Phase 7)',
    timestamp: new Date().toISOString()
  });
}
