/**
 * META IT SCHOOL — Rasmiy Virtual Maslahatchi va Sayt Mantiqiy Qismi (script.js)
 * Andijon shahri, Leninskiy ko'chasi
 * Telefon: +998 (90) 123-45-67
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initChatbot();
  initPhoneInputs();
});

/* ==========================================================================
   1. NAVBAR VA UMUMIY INTERFEYS
   ========================================================================== */
function initNavbar() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Menyu havolalari bosilganda menyuni yopish
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }
}

/* ==========================================================================
   2. MODAL VA FORMA ISHLOVLARI
   ========================================================================== */
function openTrialModal(courseName = '') {
  const modal = document.getElementById('trialModal');
  const select = document.getElementById('modalCourse');
  if (courseName && select) {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].text.toLowerCase().includes(courseName.toLowerCase())) {
        select.selectedIndex = i;
        break;
      }
    }
  }
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeTrialModal() {
  const modal = document.getElementById('trialModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function handleModalBackdrop(e) {
  if (e.target.id === 'trialModal') {
    closeTrialModal();
  }
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMessage');
  if (toast && msgEl) {
    msgEl.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
}

// Bosh sahifadagi ro'yxatdan o'tish formasi
function handleLeadSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phoneNumber').value.trim();
  const course = document.getElementById('selectedCourse').value;

  saveLeadData({ name, phone, course, source: 'Asosiy forma' });
  showToast(`Rahmat, ${name}! Arizangiz qabul qilindi. Tez orada bog'lanamiz.`);
  event.target.reset();
}

// Modal oynadagi ro'yxatdan o'tish formasi
function handleModalSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('modalName').value.trim();
  const phone = document.getElementById('modalPhone').value.trim();
  const course = document.getElementById('modalCourse').value;

  saveLeadData({ name, phone, course, source: 'Modal darcha' });
  closeTrialModal();
  showToast(`Rahmat, ${name}! Bepul darsga joyingiz band qilindi.`);
  event.target.reset();
}

function saveLeadData(lead) {
  try {
    const leads = JSON.parse(localStorage.getItem('meta_leads') || '[]');
    leads.push({ ...lead, date: new Date().toLocaleString() });
    localStorage.setItem('meta_leads', JSON.stringify(leads));
  } catch (err) {
    console.warn('LocalStorage xatosi:', err);
  }
}

// Telefon raqamiga qulay maska
function initPhoneInputs() {
  const inputs = document.querySelectorAll('input[type="tel"]');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      if (!input.value) {
        input.value = '+998 ';
      }
    });

    input.addEventListener('input', (e) => {
      let val = input.value.replace(/[^\d+]/g, '');
      if (!val.startsWith('+998')) {
        val = '+998';
      }
      input.value = val;
    });
  });
}

/* ==========================================================================
   3. META IT SCHOOL VIRTUAL MASLAHATCHISI (CHATBOT) MANTIQI
   ========================================================================== */

const KNOWLEDGE_BASE = {
  schoolName: "META IT SCHOOL",
  address: "Andijon shahri, Leninskiy ko'chasi",
  phone: "+998 (90) 123-45-67",
  stats: {
    activeGroups: "130 dan ortiq faol guruhlar",
    studentsPerGroup: "har bir guruhda 15 nafardan ortiq o'quvchi",
    individualStudents: "100 dan ortiq yakka yoki juftlikda o'qiydigan o'quvchilar",
    practice: "100% amaliyot, portfolio shakllantirish va maxsus sertifikat"
  },
  promo: {
    frontend: "Asl narxi 620 000 so'm — Chegirmada atigi 480 000 so'm!",
    backend: "Asl narxi 600 000 so'm — Chegirmada atigi 480 000 so'm!",
    other: "Boshqa kurslarimiz va guruh vaqtlari bo'yicha administratorlarimiz to'liq ma'lumot berishadi."
  },
  features: [
    "Oliy ta'lim muassasalariga (institutlarga) imtihonsiz kirish imkoniyati",
    "Erkin kovorking: o'quvchilarimiz har kuni kelib, ish vaqti tugagunga qadar dars qilishlari va mentorlardan bepul yordam olishlari mumkin",
    "1-dars mutlaqo bepul (sinov darsi)"
  ],
  events: [
    "Sport chempionatlari: Futbol, shaxmat, shashka",
    "IT tanlovlar: 'Eng zo'r dasturchi' va xakatonlar",
    "Kibersport: Counter-Strike 1.6 va boshqa o'yinlar bo'yicha turnirlar"
  ],
  courses: [
    "Frontend dasturlash (480 000 so'm chegirmada)",
    "Backend dasturlash (480 000 so'm chegirmada)",
    "Python dasturlash tili",
    "AI Engineer (Sun'iy intellekt muhandisligi)",
    "Kiberxavfsizlik (Cybersecurity)",
    "Robototexnika"
  ]
};

// Chat holati
let chatHistory = [];

function initChatbot() {
  const saved = localStorage.getItem('meta_chat_history');
  if (saved) {
    try {
      chatHistory = JSON.parse(saved);
      renderChatMessages();
    } catch (e) {
      chatHistory = [];
    }
  }

  // Agar suhbat bo'sh bo'lsa, xush kelibsiz xabarini chiqaramiz
  if (chatHistory.length === 0) {
    sendBotGreeting();
  }
}

function sendBotGreeting() {
  const greetingText = `Assalomu alaykum! Men Andijon shahridagi <strong>META IT SCHOOL</strong> zamonaviy IT markazining rasmiy virtual maslahatchisiman. 😊

Markazimizda hozirda **Frontend va Backend** kurslariga KATTA AKSIYA (atigi **480 000 so'm**) ketmoqda! Shuningdek, kurslarimizni bitirib **oliy ta'lim muassasalariga (institutlarga) imtihonsiz kirish** imkoniyati mavjud. 🎓

Sizga qaysi yo'nalish yoki ma'lumot qiziq? Savolingizni yozing yoki pastdagi tugmalardan tanlang.`;

  pushBotMessage(greetingText);
}

function toggleChatWindow() {
  const chatWindow = document.getElementById('chatWindow');
  const toggleBtn = document.getElementById('chatToggleBtn');
  const noticeBubble = document.getElementById('chatNoticeBubble');

  if (chatWindow && toggleBtn) {
    chatWindow.classList.toggle('open');
    toggleBtn.classList.toggle('active');

    if (noticeBubble) {
      noticeBubble.style.display = 'none';
    }

    if (chatWindow.classList.contains('open')) {
      const input = document.getElementById('chatInput');
      if (input) input.focus();
      scrollChatToBottom();
    }
  }
}

function openChatWithPrompt(promptText) {
  const chatWindow = document.getElementById('chatWindow');
  const toggleBtn = document.getElementById('chatToggleBtn');

  if (chatWindow && !chatWindow.classList.contains('open')) {
    chatWindow.classList.add('open');
    toggleBtn.classList.add('active');
  }

  const noticeBubble = document.getElementById('chatNoticeBubble');
  if (noticeBubble) noticeBubble.style.display = 'none';

  sendQuickMessage(promptText);
}

function clearChatHistory() {
  if (confirm("Suhbat tarixini tozalashni xohlaysizmi?")) {
    chatHistory = [];
    localStorage.removeItem('meta_chat_history');
    const container = document.getElementById('chatMessages');
    if (container) container.innerHTML = '';
    sendBotGreeting();
  }
}

function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  pushUserMessage(message);
  input.value = '';

  processUserQuery(message);
}

function sendQuickMessage(text) {
  pushUserMessage(text);
  processUserQuery(text);
}

function pushUserMessage(text) {
  const time = getCurrentTimeString();
  const msgObj = { sender: 'user', text, time };
  chatHistory.push(msgObj);
  saveChatToStorage();
  appendMessageToUI(msgObj);
}

function pushBotMessage(text) {
  const time = getCurrentTimeString();
  const msgObj = { sender: 'bot', text, time };
  chatHistory.push(msgObj);
  saveChatToStorage();
  appendMessageToUI(msgObj);
}

function appendMessageToUI(msg) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = `message-bubble ${msg.sender}`;

  // Markdown formatlashni soddalashtirilgan tarzda o'girish
  let formattedText = msg.text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  bubble.innerHTML = `
    <div class="bubble-content">${formattedText}</div>
    <div class="bubble-time">${msg.time}</div>
  `;

  container.appendChild(bubble);
  scrollChatToBottom();
}

function renderChatMessages() {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  container.innerHTML = '';
  chatHistory.forEach(msg => appendMessageToUI(msg));
}

function scrollChatToBottom() {
  const container = document.getElementById('chatMessages');
  if (container) {
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 50);
  }
}

function saveChatToStorage() {
  try {
    localStorage.setItem('meta_chat_history', JSON.stringify(chatHistory));
  } catch (err) {
    console.warn('Storage error:', err);
  }
}

function getCurrentTimeString() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ==========================================================================
   4. CHATBOT AQL-IDROK MANTIQI (INTENT & KEYWORDS MATCHING)
   Muloqot qoidalariga 100% muvofiq javoblar
   ========================================================================== */

function processUserQuery(rawInput) {
  const lower = rawInput.toLowerCase();
  showTyping(true);

  // Telefon raqami yuborilganligini aniqlash (Lead Capture)
  const phonePattern = /(?:\+998|998|8)?[\s-]?\(?(?:90|91|93|94|95|97|98|99|33|88|77)\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/;
  const isPhonePresent = phonePattern.test(rawInput.replace(/\s+/g, ''));

  setTimeout(() => {
    let reply = "";

    if (isPhonePresent) {
      const detectedPhone = rawInput.match(phonePattern)[0];
      saveLeadData({ name: "Chatbot Mijoz", phone: detectedPhone, course: "Chat orqali yozildi", source: "Chatbot" });
      reply = `Katta rahmat! Telefon raqamingiz (${detectedPhone}) qabul qilindi. 🤝

Administratorlarimiz 15 daqiqa ichida siz bilan bog'lanib, siz xohlagan qulay vaqtga **bepul birinchi sinov darsi** uchun joyingizni band qilib berishadi!

Markazimizda ko'rishguncha! Qo'shimcha savollaringiz bo'lsa, bemalol so'rashingiz mumkin. 😊`;
    }
    // 1. Narxlar va aksiyalar haqida
    else if (lower.includes('narx') || lower.includes('qancha') || lower.includes('pul') || lower.includes('aksiya') || lower.includes('chegirma') || lower.includes('to\'lov')) {
      reply = `Ayni paytda **META IT SCHOOL** markazimizda KATTA AKSIYA ketmoqda! 🔥

✨ **Frontend dasturlash:** Asl narxi ~~620 000 so'm~~ — hozirgi chegirmada atigi **480 000 so'm**!
✨ **Backend dasturlash:** Asl narxi ~~600 000 so'm~~ — hozirgi chegirmada atigi **480 000 so'm**!

Eng muhimi: Bizning kurslarimizni muvaffaqiyatli tamomlagan bitiruvchilarga **oliy ta'lim muassasalariga (institutlarga) imtihonsiz kirish imkoniyati** taqdim etiladi! 🎓

Boshqa yo'nalishlarimizning chegirmalari haqida to'liq ma'lumot olish uchun telefon raqamingizni qoldiring yoki **+998 (90) 123-45-67** raqamiga qo'ng'iroq qiling. 

Sizni **bepul birinchi sinov darsimizda** kutib qolamiz! Raqamingizni qoldirasizmi? 🚀`;
    }
    // 2. Imtihonsiz institutga kirish
    else if (lower.includes('institut') || lower.includes('universitet') || lower.includes('imtihonsiz') || lower.includes('talaba') || lower.includes('otm')) {
      reply = `Ha, bu haqiqat! 🎓

**META IT SCHOOL** kurslarini muvaffaqiyatli tamomlagan bitiruvchilarimizga **oliy ta'lim muassasalariga (institutlarga) imtihonsiz kirish imkoniyati** berilmoqda!

Siz bir vaqtning o'zida:
1. Zamonaviy, daromadli IT kasbini amaliy o'rganasiz;
2. Real loyihalardan iborat portfolio va sertifikatga ega bo'lasiz;
3. Institutga imtihon stressisiz talaba bo'lasiz!

Shoshiling, ushbu imkoniyatdan foydalanish uchun **bepul sinov darsimizga** yoziling. Telefon raqamingizni yozib qoldirsangiz, mutaxassisimiz barcha shartlarni tushuntirib beradi!`;
    }
    // 3. Markaz haqida va natijalar
    else if (lower.includes('markaz') || lower.includes('natija') || lower.includes('haqida') || lower.includes('guru') || lower.includes('meta haqida')) {
      reply = `Markazimiz natijalari bilan faxrlanamiz! 🌟

• Hozirda markazimizda **130 dan ortiq faol guruhlar** mavjud bo'lib, har bir guruhda 15 nafardan ortiq o'quvchi tahsil oladi.
• Shuningdek, yakka tartibda (individual) yoki o'z sherigi bilan alohida o'qiydigan **100 dan ortiq** o'quvchilarimiz bor.
• Ta'lim jarayoni **100% amaliyotga** asoslangan! Bitiruvchilarga maxsus sertifikat va real ish beruvchilar uchun mustahkam portfolio yaratishda to'liq yordam beriladi.

Darslar sifatiga o'zingiz ishonch hosil qilishingiz uchun **bepul birinchi darsga** taklif qilamiz. Raqamingizni qoldiring yoki **+998 (90) 123-45-67** ga bog'laning! 😊`;
    }
    // 4. Kovorking va qulayliklar
    else if (lower.includes('kovorking') || lower.includes('coworking') || lower.includes('sharoit') || lower.includes('qulaylik') || lower.includes('bino') || lower.includes('dars qilish')) {
      reply = `Bizda o'quvchilar uchun ajoyib qulaylik yaratilgan! 💻

O'quvchilarimiz markazga **har kuni kelib, ish vaqti tugagunga qadar** bemalol o'tirib dars qilishlari, uy vazifalarini bajarishlari va erkin shug'ullanishlari mumkin. Hech kim ularga xalaqit bermaydi!

Eng muhimi — zalda doim tajribali mentorlar bo'ladi va tushunmagan joyingizni tushuntirib berishadi. 🤝

Bu muhitni o'z ko'zingiz bilan ko'rish uchun **bepul sinov darsimizga** keling. Telefon raqamingizni yozing, dars vaqtini kelishib olamiz!`;
    }
    // 5. Chempionatlar, sport va CS 1.6
    else if (lower.includes('chempionat') || lower.includes('musobaqa') || lower.includes('futbol') || lower.includes('kibersport') || lower.includes('cs') || lower.includes('counter') || lower.includes('o\'yin') || lower.includes('shaxmat')) {
      reply = `Bizda nafaqat bilim olasiz, balki qiziqarli talabalik hayotini o'tkazasiz! 🏆

O'quvchilarimizning bo'sh vaqtini mazmunli o'tkazish uchun har yili katta chempionatlar o'tkazamiz:
⚽ **Sport o'yinlari:** Futbol, shaxmat, shashka birinchiliklari;
💻 **IT musobaqalar:** "Eng zo'r dasturchi" tanlovlari va xakatonlar;
🎮 **Kibersport:** Counter-Strike 1.6 va boshqa o'yinlar bo'yicha qizg'in turnirlar!

Siz ham bizning do'stona oilamizga qo'shiling! **Bepul sinov darsiga** yozilish uchun telefon raqamingizni qoldiring! 🚀`;
    }
    // 6. Qaysi kurslar bor? (Kurslar ro'yxati)
    else if (lower.includes('kurs') || lower.includes('yo\'nalish') || lower.includes('nimalar o\'rgat') || lower.includes('dasturlash')) {
      reply = `**META IT SCHOOL** markazida eng zamonaviy va daromadli IT kurslari mavjud:

1. **Frontend dasturlash** — Aksiya narxi: **480 000 so'm** (asl narxi 620 000 so'm)
2. **Backend dasturlash** — Aksiya narxi: **480 000 so'm** (asl narxi 600 000 so'm)
3. **Python dasturlash tili**
4. **AI Engineer (Sun'iy intellekt muhandisligi)**
5. **Kiberxavfsizlik (Cybersecurity)**
6. **Robototexnika**

Kurslarimizni tugatib, **institutlarga imtihonsiz kirish** imkoniyati bor! 🎓

Qaysi yo'nalish sizga ko'proq ma'qul? Telefon raqamingizni qoldiring, sizni **bepul sinov darsiga** yozib qo'yamiz!`;
    }
    // 7. Maslahat / Qaysi birini tanlashni bilmayapman
    else if (lower.includes('bilmayman') || lower.includes('maslahat') || lower.includes('qaysi') || lower.includes('tavsiya') || lower.includes('qaysinisini') || lower.includes('noldan')) {
      reply = `Hech xijolat bo'lmang, to'g'ri kasb tanlash juda muhim qadam! 😊

Keling, qiziqishingizga qarab aniqlaymiz:
• Agar chiroyli veb-saytlar va ilovalarning ko'rinishini yaratishga qiziqsangiz — **Frontend** kursi juda mos keladi;
• Tizimlar mantig'i, ma'lumotlar bazasi va serverlar qiziq bo'lsa — **Backend** yo'nalishi ayni muddao;
• Universal dasturlash, telegram botlar va sun'iy intellektga qiziqsangiz — **Python yoki AI Engineer** tavsiya etamiz;
• Dasturlar va tarmoqlarni himoyalash qiziq bo'lsa — **Kiberxavfsizlik**.

Eng yaxshi yo'li: Markazimizga kelib, **bepul sinov darsida** qatnashing va mentorlarimiz bilan shaxsan gaplashing! 

Sizga qulay vaqtni belgilash uchun telefon raqamingizni yozib qoldiring. 📞`;
    }
    // 8. Manzil va aloqa
    else if (lower.includes('manzil') || lower.includes('qayer') || lower.includes('lokatsiya') || lower.includes('telefon') || lower.includes('nomer') || lower.includes('aloqa')) {
      reply = `📍 **Filialimiz manzili:** Andijon shahri, Leninskiy ko'chasi.
📞 **Murojaat uchun telefon:** +998 (90) 123-45-67

Ish vaqtimiz: Dushanba - Shanba kunlari 08:00 dan 20:00 gacha. Kovorking zali ham ochiq!

Markazimizga kelishingizdan oldin joy tayyorlab qo'yishimiz uchun telefon raqamingizni qoldirasizmi? Sizni **bepul birinchi darsda** mamnuniyat bilan kutib olamiz! 😊`;
    }
    // 9. Salomlashuv
    else if (lower.includes('salom') || lower.includes('assalom') || lower.includes('qalaysiz') || lower.includes('xayrli')) {
      reply = `Vaalaykum assalom! Xush kelibsiz! 😊

Men **META IT SCHOOL** zamonaviy IT markazining virtual maslahatchisiman. Sizga qanday yordam bera olaman?

Hozirda barcha asosiy dasturlash kurslarimizga chegirma aksiyasi (atigi **480 000 so'm**) va **institutga imtihonsiz kirish** imkoniyati taqdim etilmoqda!

Bepul birinchi darsimizga yozilishni xohlaysizmi? Telefon raqamingizni qoldiring yoki savolingizni bering. 🚀`;
    }
    // 10. Umumiy / Boshqa savollar
    else {
      reply = `Savolingiz uchun tashakkur! 

**META IT SCHOOL** — Andijondagi 130 dan ortiq faol guruhga ega, 100% amaliyot va erkin kovorking muhitini taqdim etuvchi yetakchi IT maktabi.

🔥 Hozirda **Frontend** va **Backend** kurslarimizga maxsus aksiya ketmoqda — oyiga atigi **480 000 so'm**! 
🎓 Shuningdek, kurslarimiz bitiruvchilariga **institutlarga imtihonsiz kirish imkoniyati** mavjud.

Savolingiz bo'yicha to'liq ma'lumot olish va **bepul birinchi darsga** joy band qilish uchun telefon raqamingizni qoldiring yoki bizga to'g'ridan-to'g'ri qo'ng'iroq qiling:
📞 **+998 (90) 123-45-67**

Sizni markazimizda kutamiz! 😊`;
    }

    showTyping(false);
    pushBotMessage(reply);
  }, 650);
}

function showTyping(show) {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) {
    if (show) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
    scrollChatToBottom();
  }
}
