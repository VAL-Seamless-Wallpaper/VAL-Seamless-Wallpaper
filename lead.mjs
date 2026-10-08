export default async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', {status:405});
  try {
    const data = await req.json();
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat = process.env.TELEGRAM_CHAT_ID;
    if (token && chat) {
      const e = data.estimate;
      const text = [
        '🟤 НОВАЯ ЗАЯВКА VAL',
        `Имя: ${data.name || '—'}`,
        `Контакт: ${data.phone || '—'}`,
        `Площадь: ${data.area || '—'} м²`,
        e ? `Предварительно: ${Math.round(e.total).toLocaleString('ru-RU')} ₽` : '',
        `Комментарий: ${data.message || '—'}`
      ].filter(Boolean).join('\\n');
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({chat_id:chat,text})
      });
    }
    return new Response(JSON.stringify({ok:true}),{status:200,headers:{'content-type':'application/json'}});
  } catch(e) {
    return new Response(JSON.stringify({ok:false}),{status:400,headers:{'content-type':'application/json'}});
  }
};
