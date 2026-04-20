// ===== TELEGRAM BOT CONFIG =====
// Замени значения после получения у @BotFather и @userinfobot
const TG_TOKEN   = 'СЮДА_ВСТАВЬ_BOT_TOKEN';   // пример: 7412345678:AAHxyz...
const TG_CHAT_ID = 'СЮДА_ВСТАВЬ_CHAT_ID';     // пример: 123456789

// ===== FORM HANDLER =====
document.addEventListener('DOMContentLoaded', () => {
  const form       = document.getElementById('ctaForm');
  if (!form) return;

  const nameInput  = document.getElementById('ctaName');
  const phoneInput = document.getElementById('ctaPhone');
  const submitBtn  = document.getElementById('ctaSubmit');
  const successBox = document.getElementById('ctaSuccess');
  const nameErr    = document.getElementById('nameError');
  const phoneErr   = document.getElementById('phoneError');

  function validate() {
    let ok = true;
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameInput.classList.add('error');
      nameErr.classList.add('show');
      ok = false;
    } else {
      nameInput.classList.remove('error');
      nameErr.classList.remove('show');
    }
    const phone = phoneInput.value.trim().replace(/\s/g, '');
    if (!phone || phone.length < 7) {
      phoneInput.classList.add('error');
      phoneErr.classList.add('show');
      ok = false;
    } else {
      phoneInput.classList.remove('error');
      phoneErr.classList.remove('show');
    }
    return ok;
  }

  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length >= 2) {
      nameInput.classList.remove('error');
      nameErr.classList.remove('show');
    }
  });
  phoneInput.addEventListener('input', () => {
    if (phoneInput.value.trim().length >= 7) {
      phoneInput.classList.remove('error');
      phoneErr.classList.remove('show');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const name  = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const page  = document.title;
    const time  = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' });

    const text = [
      '📩 <b>Новая заявка с сайта Информатика</b>',
      '',
      `👤 <b>Имя:</b> ${name}`,
      `📞 <b>Телефон:</b> ${phone}`,
      `📖 <b>Страница:</b> ${page}`,
      `🕐 <b>Время:</b> ${time}`,
      `🌐 <b>Сайт:</b> https://azamatkajyrov26-lab.github.io/informatika-courses/`,
    ].join('\n');

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Отправка...';

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: 'HTML' }),
        }
      );
      const data = await res.json();
      if (data.ok) {
        form.style.display = 'none';
        successBox.classList.add('show');
      } else {
        throw new Error(data.description || 'Ошибка');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Оставить контакты`;
      alert('Ошибка отправки. Проверьте Bot Token и Chat ID в js/telegram.js');
      console.error(err);
    }
  });
});
