// ===== TELEGRAM CONFIG =====
const TG_TOKEN   = '8601517889:AAHUXXh3EdY978f648ilZKFCfgLKIHylUa0';
const TG_CHAT_ID = '6555317176';

// ===== INIT (runs after DOM is ready, works both inline and defer) =====
function initForm() {
  const form     = document.getElementById('ctaForm');
  if (!form) return;

  const nameInput  = document.getElementById('ctaName');
  const phoneInput = document.getElementById('ctaPhone');
  const submitBtn  = document.getElementById('ctaSubmit');
  const successBox = document.getElementById('ctaSuccess');
  const nameErr    = document.getElementById('nameError');
  const phoneErr   = document.getElementById('phoneError');

  function showError(input, errEl) { input.classList.add('error'); errEl.classList.add('show'); }
  function clearError(input, errEl) { input.classList.remove('error'); errEl.classList.remove('show'); }

  nameInput.addEventListener('input',  () => { if (nameInput.value.trim().length  >= 2) clearError(nameInput,  nameErr);  });
  phoneInput.addEventListener('input', () => { if (phoneInput.value.trim().length >= 6) clearError(phoneInput, phoneErr); });

  function validate() {
    let ok = true;
    if (nameInput.value.trim().length < 2)  { showError(nameInput,  nameErr);  ok = false; }
    if (phoneInput.value.trim().length < 6) { showError(phoneInput, phoneErr); ok = false; }
    return ok;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const name  = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const page  = document.title;
    const time  = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' });

    const text = `📩 <b>Новая заявка с сайта Информатика</b>\n\n👤 <b>Имя:</b> ${name}\n📞 <b>Телефон:</b> ${phone}\n📖 <b>Страница:</b> ${page}\n🕐 <b>Время:</b> ${time}\n🌐 <b>Сайт:</b> https://azamatkajyrov26-lab.github.io/informatika-courses/`;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Отправка...';

    try {
      const resp = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: 'HTML' }),
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      if (!data.ok) throw new Error(data.description || 'Telegram error');

      form.style.display = 'none';
      successBox.classList.add('show');

    } catch (err) {
      console.error('[Telegram form]', err);
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;flex-shrink:0"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Оставить контакты`;
      alert('Не удалось отправить заявку. Попробуйте снова.');
    }
  });
}

// Works regardless of when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initForm);
} else {
  initForm();
}
