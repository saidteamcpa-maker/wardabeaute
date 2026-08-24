const WATI_BASE = 'https://api.wati.io';

export async function sendWatiMessage(phone: string, templateName: string, params: string[] = []) {
  const token = process.env.WATI_API_TOKEN;
  const waba = process.env.WATI_WABA_NUMBER;
  if (!token || !waba) {
    console.warn('[WATI] not configured — skipping message');
    return { ok: false, skipped: true };
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const url = `${WATI_BASE}/v1/waba/accounts/${waba}/send-template`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template_name: templateName,
        broadcast_name: `order-${Date.now()}`,
        receivers: [cleanPhone],
        parameters: params.map((p) => ({ name: 'param', value: p })),
      }),
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    console.error('[WATI] send failed', e);
    return { ok: false, error: String(e) };
  }
}
