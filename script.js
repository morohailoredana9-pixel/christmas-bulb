(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const dayMessages = [
    "Make room for wonder, even in the smallest moments. ✨",
    "A warm drink, a twinkling light, and a little time for yourself.",
    "You deserve the same softness you give to everyone else. ❤️",
    "Let today be wrapped in kindness and tied with a golden bow.",
    "Some of the best magic is made at home.",
    "Notice one beautiful little thing today. Keep it like a treasure.",
    "A little joy looks lovely on you. 🎄",
    "The season feels brighter when we share what we have.",
    "Slow down. The tiny moments are part of the magic.",
    "May something unexpectedly lovely find you today."
  ];

  const today = new Date();
  let displayedYear = today.getMonth() === 11 && today.getDate() > 25
    ? today.getFullYear() + 1 : today.getFullYear();
  let displayedMonth = 11; // December
  let selectedDate = null;
  let messageIndex = (today.getDate() - 1 + dayMessages.length) % dayMessages.length;

  function nextChristmas() {
    const now = new Date();
    let year = now.getFullYear();
    const christmas = new Date(year, 11, 25, 0, 0, 0);
    if (now >= christmas) year += 1;
    return new Date(year, 11, 25, 0, 0, 0);
  }

  function updateCountdown() {
    const now = new Date();
    const target = nextChristmas();
    let remaining = Math.max(0, target.getTime() - now.getTime());
    const days = Math.floor(remaining / 86400000);
    remaining %= 86400000;
    const hours = Math.floor(remaining / 3600000);
    remaining %= 3600000;
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    $('#days-left').textContent = days;
    $('#hours-left').textContent = String(hours).padStart(2, '0');
    $('#minutes-left').textContent = String(minutes).padStart(2, '0');
    $('#seconds-left').textContent = String(seconds).padStart(2, '0');
    $('#days-caption').textContent = days === 1 ? 'day until Christmas' : 'days until Christmas';
    $('#countdown-label').textContent = days === 0 ? 'MERRY CHRISTMAS!' : 'COUNTING DOWN TO CHRISTMAS';
  }

  function renderToday() {
    $('#today-date').textContent = today.toLocaleDateString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
    $('#today-note').textContent = today.getMonth() === 11 && today.getDate() === 25
      ? 'Merry Christmas! May your day be full of warmth and wonder. 🎄'
      : 'A little moment of magic is waiting for you. ✨';
    renderMessage();
  }

  function renderMessage() {
    $('#daily-message').textContent = '“' + dayMessages[messageIndex] + '”';
  }

  function renderCalendar() {
    const monthDate = new Date(displayedYear, displayedMonth, 1);
    $('#month-title').textContent = monthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    const grid = $('#calendar-days');
    grid.replaceChildren();
    const offset = (monthDate.getDay() + 6) % 7;
    const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();

    for (let i = 0; i < offset; i++) {
      const blank = document.createElement('span');
      blank.setAttribute('aria-hidden', 'true');
      grid.appendChild(blank);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'calendar-day';
      button.textContent = String(day);
      button.setAttribute('aria-label', monthDate.toLocaleDateString(undefined, { month: 'long' }) + ' ' + day);
      const isToday = displayedYear === today.getFullYear() && displayedMonth === today.getMonth() && day === today.getDate();
      const isChristmas = displayedMonth === 11 && day === 25;
      if (isToday) button.classList.add('today');
      if (isChristmas) {
        button.classList.add('christmas');
        button.setAttribute('aria-label', 'Christmas Day, December 25');
      }
      if (selectedDate && selectedDate.year === displayedYear && selectedDate.month === displayedMonth && selectedDate.day === day) {
        button.classList.add('selected');
      }
      button.addEventListener('click', () => {
        selectedDate = { year: displayedYear, month: displayedMonth, day };
        renderCalendar();
        const date = new Date(displayedYear, displayedMonth, day);
        const note = isChristmas ? 'Christmas Day! 🎄 A little extra magic for you.' :
          (isToday ? 'This is today. Make a little room for joy. ✨' : 'A fresh little page for plans, surprises, and good things.');
        $('#selected-date-note').textContent = date.toLocaleDateString(undefined, {
          weekday: 'long', month: 'long', day: 'numeric'
        }) + ' — ' + note;
      });
      grid.appendChild(button);
    }
  }

  function showPanel(name) {
    ['today', 'calendar', 'message'].forEach((panel) => {
      $('#' + panel + '-panel').classList.toggle('hidden', panel !== name);
    });
    document.querySelectorAll('.tab').forEach((tab) => {
      const active = tab.dataset.panel === name;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    if (name === 'calendar') renderCalendar();
  }

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => showPanel(tab.dataset.panel));
  });
  $('#prev-month').addEventListener('click', () => {
    displayedMonth--;
    if (displayedMonth < 0) { displayedMonth = 11; displayedYear--; }
    selectedDate = null;
    $('#selected-date-note').textContent = 'Choose a day to see its note.';
    renderCalendar();
  });
  $('#next-month').addEventListener('click', () => {
    displayedMonth++;
    if (displayedMonth > 11) { displayedMonth = 0; displayedYear++; }
    selectedDate = null;
    $('#selected-date-note').textContent = 'Choose a day to see its note.';
    renderCalendar();
  });
  $('#new-message').addEventListener('click', () => {
    messageIndex = (messageIndex + 1) % dayMessages.length;
    renderMessage();
  });


  // Click the food bowl to feed the cats. They perk up and little kibble hearts pop up.
  const foodBowl = document.getElementById('food-bowl');
  if (foodBowl) {
    const feedingHint = document.getElementById('feeding-hint');
    const foodParticles = document.getElementById('food-particles');
    const catStage = document.querySelector('.cat-stage');
    let feedCount = 0;
    foodBowl.addEventListener('click', () => {
      feedCount++;
      if (feedingHint) feedingHint.textContent = feedCount === 1 ? 'Yum! The kitties are having a snack! 🐈‍⬛' : 'Mrow! More treats, please! 🐾';
      if (catStage) {
        catStage.classList.remove('feeding');
        void catStage.offsetWidth;
        catStage.classList.add('feeding');
        window.setTimeout(() => catStage.classList.remove('feeding'), 1300);
      }
      if (foodParticles) {
        const symbols = ['●','♥','✦','🐾'];
        for (let i = 0; i < 12; i++) {
          const particle = document.createElement('span');
          particle.className = 'food-particle';
          particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
          particle.style.left = (12 + Math.random() * 76) + '%';
          particle.style.top = (38 + Math.random() * 48) + '%';
          particle.style.animationDelay = (Math.random() * .25) + 's';
          foodParticles.appendChild(particle);
          window.setTimeout(() => particle.remove(), 1300);
        }
      }
    });
  }

  renderToday();
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
  renderCalendar();


  // Mouse and touch tracking for the special cursor cat. The cat eases toward
  // the pointer instead of snapping, so it feels like it is chasing it.
  const cursorCat = document.getElementById('cursor-cat');
  if (cursorCat) {
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.55;
    let currentX = targetX;
    let currentY = targetY;
    let hasPointer = false;
    let frameRequested = false;
    const pupils = cursorCat.querySelectorAll('.cursor-pupil');

    function setTarget(x, y) {
      targetX = x;
      targetY = y;
      hasPointer = true;
      cursorCat.classList.add('visible');
      if (!frameRequested) {
        frameRequested = true;
        requestAnimationFrame(animateCursorCat);
      }
    }
    function animateCursorCat() {
      frameRequested = false;
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      cursorCat.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -58%) rotate(${Math.max(-12, Math.min(12, dx * 0.06))}deg)`;
      pupils.forEach((pupil, i) => {
        pupil.style.transform = `translate(${Math.max(-1.8, Math.min(1.8, dx * 0.018))}px, ${Math.max(-1.5, Math.min(1.5, dy * 0.018))}px)`;
      });
      if (Math.abs(targetX - currentX) > 0.7 || Math.abs(targetY - currentY) > 0.7) {
        frameRequested = true;
        requestAnimationFrame(animateCursorCat);
      }
    }
    window.addEventListener('pointermove', (event) => setTarget(event.clientX, event.clientY), { passive: true });
    window.addEventListener('pointerdown', (event) => setTarget(event.clientX, event.clientY), { passive: true });
    window.addEventListener('touchmove', (event) => {
      if (event.touches && event.touches[0]) setTarget(event.touches[0].clientX, event.touches[0].clientY);
    }, { passive: true });
    // On touchscreens, show the cat when the user first taps the page.
    window.addEventListener('touchstart', (event) => {
      if (event.touches && event.touches[0]) setTarget(event.touches[0].clientX, event.touches[0].clientY);
    }, { passive: true });
  }

})();