(function () {
  "use strict";

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {}
    },
  };

  const uid = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeLabel = document.getElementById("theme-label");

  function applyTheme(mode) {
    document.documentElement.classList.toggle("light", mode === "light");
    themeLabel.textContent = mode === "light" ? "Light mode" : "Dark mode";
    store.set("panel-theme", mode);
  }
  applyTheme(store.get("panel-theme", "dark"));
  themeToggleBtn.addEventListener("click", () => {
    const next = document.documentElement.classList.contains("light")
      ? "dark"
      : "light";
    applyTheme(next);
  });

  const viewMeta = {
    dashboard: { title: "Overview", eyebrow: "CONSOLE / 01" },
    todo: { title: "Task List", eyebrow: "CONSOLE / 02" },
    planner: { title: "Day Planner", eyebrow: "CONSOLE / 03" },
    goals: { title: "Daily Goals", eyebrow: "CONSOLE / 04" },
    pomodoro: { title: "Focus Timer", eyebrow: "CONSOLE / 05" },
    quotes: { title: "Daily Notes", eyebrow: "CONSOLE / 06" },
  };

  function goToView(name) {
    document
      .querySelectorAll(".rail-item")
      .forEach((b) => b.classList.toggle("is-active", b.dataset.view === name));
    document
      .querySelectorAll(".view")
      .forEach((v) => v.classList.toggle("is-active", v.dataset.view === name));
    document.getElementById("view-title").textContent = viewMeta[name].title;
    document.getElementById("view-eyebrow").textContent =
      viewMeta[name].eyebrow;
  }

  document.querySelectorAll(".rail-item").forEach((btn) => {
    btn.addEventListener("click", () => goToView(btn.dataset.view));
  });
  document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => goToView(btn.dataset.goto));
  });

  const timeEl = document.getElementById("clock-time");
  const dateEl = document.getElementById("clock-date");

  function tickClock() {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    dateEl.textContent = now.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    updateGreeting(now);
  }
  tickClock();
  setInterval(tickClock, 1000);

  function updateGreeting(now) {
    const h = now.getHours();
    const line =
      h < 12 ? "Good morning." : h < 17 ? "Good afternoon." : "Good evening.";
    const g = document.getElementById("greeting-line");
    if (g) g.textContent = line;
  }

  const weatherValueEl = document.getElementById("weather-value");
  const weatherSubEl = document.getElementById("weather-sub");

  const WMO = {
    0: "Clear sky",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Rain showers",
    82: "Violent showers",
    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm",
  };

  function loadWeather() {
    if (!navigator.geolocation) {
      weatherSubEl.textContent = "Location unavailable";
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`,
          );
          const data = await res.json();
          const temp = Math.round(data.current.temperature_2m);
          const desc = WMO[data.current.weather_code] || "—";
          weatherValueEl.textContent = `${temp}°C`;
          weatherSubEl.textContent = desc;
        } catch (e) {
          weatherSubEl.textContent = "Forecast unavailable";
        }
        try {
          const geo = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const geoData = await geo.json();
          const place =
            geoData.city || geoData.locality || geoData.principalSubdivision;
          if (place) weatherSubEl.textContent += ` · ${place}`;
        } catch (e) {
          /* silent — city name is a nice-to-have */
        }
      },
      () => {
        weatherSubEl.textContent = "Location access denied";
      },
    );
  }
  loadWeather();

  function buildDialTicks(svg, size) {
    const cx = size / 2,
      cy = size / 2,
      rOuter = size / 2 - 4;
    const ns = "http://www.w3.org/2000/svg";
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * 360 * (Math.PI / 180);
      const isMajor = i % 5 === 0;
      const len = isMajor ? 7 : 3.5;
      const x1 = cx + (rOuter - len) * Math.sin(angle);
      const y1 = cy - (rOuter - len) * Math.cos(angle);
      const x2 = cx + rOuter * Math.sin(angle);
      const y2 = cy - rOuter * Math.cos(angle);
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", x1.toFixed(2));
      line.setAttribute("y1", y1.toFixed(2));
      line.setAttribute("x2", x2.toFixed(2));
      line.setAttribute("y2", y2.toFixed(2));
      line.setAttribute("stroke-width", isMajor ? 1.6 : 1);
      if (isMajor) line.classList.add("major");
      svg.appendChild(line);
    }
  }
  buildDialTicks(document.getElementById("goal-dial-ticks"), 160);
  buildDialTicks(document.getElementById("timer-dial-ticks"), 220);

  function setDialProgress(circle, radius, fraction) {
    const c = 2 * Math.PI * radius;
    circle.setAttribute("stroke-dasharray", c.toFixed(2));
    circle.setAttribute(
      "stroke-dashoffset",
      (c * (1 - Math.max(0, Math.min(1, fraction)))).toFixed(2),
    );
  }

  let tasks = store.get("panel-tasks", []);
  let taskFilter = "all";

  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const todoEmpty = document.getElementById("todo-empty");
  const todoCount = document.getElementById("todo-count");

  function saveTasks() {
    store.set("panel-tasks", tasks);
    renderTasks();
    renderSideTasks();
    renderDial();
  }

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;
    tasks.unshift({ id: uid(), text, done: false, important: false });
    todoInput.value = "";
    saveTasks();
  });

  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-tab")
        .forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      taskFilter = tab.dataset.filter;
      renderTasks();
    });
  });

  const checkSvg = `<svg viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  function renderTasks() {
    let visible = tasks;
    if (taskFilter === "important") visible = tasks.filter((t) => t.important);
    if (taskFilter === "done") visible = tasks.filter((t) => t.done);

    todoList.innerHTML = "";
    todoEmpty.classList.toggle("hidden", visible.length > 0);

    visible.forEach((t) => {
      const li = document.createElement("li");
      li.className =
        "task-row" +
        (t.done ? " is-done" : "") +
        (t.important ? " is-important" : "");
      li.innerHTML = `
        <span class="checkbox">${checkSvg}</span>
        <span class="row-text">${escapeHtml(t.text)}</span>
        <span class="row-actions">
          <button class="icon-btn star ${t.important ? "is-active" : ""}" title="Mark important">
            <svg viewBox="0 0 24 24" fill="${t.important ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.8"><path d="M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.6L12 18l-5.9 3.1 1.2-6.6-4.8-4.6 6.6-.9L12 3z"/></svg>
          </button>
          <button class="icon-btn danger" title="Delete task">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/></svg>
          </button>
        </span>`;
      li.querySelector(".checkbox").addEventListener("click", () => {
        t.done = !t.done;
        saveTasks();
      });
      li.querySelector(".row-text").addEventListener("click", () => {
        t.done = !t.done;
        saveTasks();
      });
      li.querySelector(".star").addEventListener("click", () => {
        t.important = !t.important;
        saveTasks();
      });
      li.querySelector(".danger").addEventListener("click", () => {
        tasks = tasks.filter((x) => x.id !== t.id);
        saveTasks();
      });
      todoList.appendChild(li);
    });

    const activeCount = tasks.filter((t) => !t.done).length;
    todoCount.textContent = `${activeCount} active`;
  }

  function renderSideTasks() {
    const list = document.getElementById("side-task-list");
    const badge = document.getElementById("side-task-badge");
    const activeTasks = tasks.filter((t) => !t.done).slice(0, 6);
    badge.textContent = tasks.filter((t) => !t.done).length;

    if (activeTasks.length === 0) {
      list.innerHTML = `<p class="side-task-empty">No open tasks — you're clear.</p>`;
      return;
    }
    list.innerHTML = "";
    activeTasks.forEach((t) => {
      const row = document.createElement("div");
      row.className = "side-task-row";
      row.innerHTML = `<span class="box">${checkSvg}</span><span>${escapeHtml(t.text)}</span>`;
      row.addEventListener("click", () => {
        t.done = true;
        saveTasks();
      });
      list.appendChild(row);
    });
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 06:00 -> 22:00
  let plannerData = store.get("panel-planner", {});

  function formatHour(h) {
    const period = h >= 12 ? "PM" : "AM";
    const hr12 = h % 12 === 0 ? 12 : h % 12;
    return `${hr12}:00 ${period}`;
  }

  function renderPlanner() {
    const list = document.getElementById("planner-list");
    list.innerHTML = "";
    const currentHour = new Date().getHours();

    HOURS.forEach((h) => {
      const row = document.createElement("div");
      row.className = "planner-row" + (h === currentHour ? " is-now" : "");
      row.innerHTML = `
        <span class="planner-time mono">${formatHour(h)}</span>
        <input type="text" placeholder="Nothing scheduled" value="${escapeAttr(plannerData[h] || "")}">
        <button class="planner-clear" title="Clear entry">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>`;
      const input = row.querySelector("input");
      input.addEventListener("input", () => {
        plannerData[h] = input.value;
        store.set("panel-planner", plannerData);
        renderPlannerPreview();
      });
      row.querySelector(".planner-clear").addEventListener("click", () => {
        plannerData[h] = "";
        input.value = "";
        store.set("panel-planner", plannerData);
        renderPlannerPreview();
      });
      list.appendChild(row);
    });
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;");
  }

  function renderPlannerPreview() {
    const box = document.getElementById("planner-preview");
    const currentHour = new Date().getHours();
    const upcoming = HOURS.filter(
      (h) => h >= currentHour && plannerData[h],
    ).slice(0, 3);

    if (upcoming.length === 0) {
      box.innerHTML = `<p class="preview-empty">Nothing scheduled for the rest of today.</p>`;
      return;
    }
    box.innerHTML = "";
    upcoming.forEach((h) => {
      const row = document.createElement("div");
      row.className = "preview-row" + (h === currentHour ? " is-now" : "");
      row.innerHTML = `<span class="preview-time mono">${formatHour(h)}</span><span class="preview-text">${escapeHtml(plannerData[h])}</span>`;
      box.appendChild(row);
    });
  }

  let goals = store.get("panel-goals", []);

  const goalsForm = document.getElementById("goals-form");
  const goalInput = document.getElementById("goal-input");
  const goalsList = document.getElementById("goals-list");
  const goalsEmpty = document.getElementById("goals-empty");

  goalsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = goalInput.value.trim();
    if (!text) return;
    goals.unshift({ id: uid(), text, done: false });
    goalInput.value = "";
    saveGoals();
  });

  function saveGoals() {
    store.set("panel-goals", goals);
    renderGoals();
    renderDial();
  }

  function renderGoals() {
    goalsList.innerHTML = "";
    goalsEmpty.classList.toggle("hidden", goals.length > 0);

    goals.forEach((g) => {
      const li = document.createElement("li");
      li.className = "goal-row" + (g.done ? " is-done" : "");
      li.innerHTML = `
        <span class="checkbox">${checkSvg}</span>
        <span class="row-text">${escapeHtml(g.text)}</span>
        <span class="row-actions">
          <button class="icon-btn danger" title="Remove goal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/></svg>
          </button>
        </span>`;
      li.querySelector(".checkbox").addEventListener("click", () => {
        g.done = !g.done;
        saveGoals();
      });
      li.querySelector(".row-text").addEventListener("click", () => {
        g.done = !g.done;
        saveGoals();
      });
      li.querySelector(".danger").addEventListener("click", () => {
        goals = goals.filter((x) => x.id !== g.id);
        saveGoals();
      });
      goalsList.appendChild(li);
    });

    const done = goals.filter((g) => g.done).length;
    const total = goals.length;
    document.getElementById("goals-progress-label").textContent =
      `${done} / ${total}`;
    document.getElementById("goals-progress-fill").style.width = total
      ? `${(done / total) * 100}%`
      : "0%";
  }

  function renderDial() {
    const done = goals.filter((g) => g.done).length;
    const total = goals.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    document.getElementById("goal-percent").textContent = `${pct}%`;
    document.getElementById("goal-done-count").textContent = done;
    document.getElementById("goal-total-count").textContent = total;
    setDialProgress(
      document.getElementById("goal-dial-arc"),
      62,
      total ? done / total : 0,
    );
  }

  const timerTimeEl = document.getElementById("timer-time");
  const timerPhaseEl = document.getElementById("timer-phase");
  const startBtn = document.getElementById("timer-start");
  const pauseBtn = document.getElementById("timer-pause");
  const resetBtn = document.getElementById("timer-reset");
  const workSelect = document.getElementById("work-duration");
  const breakSelect = document.getElementById("break-duration");
  const timerArc = document.getElementById("timer-dial-arc");

  let phase = "work";
  let totalSeconds = parseInt(workSelect.value, 10) * 60;
  let remaining = totalSeconds;
  let timerHandle = null;

  function renderTimer() {
    const m = Math.floor(remaining / 60)
      .toString()
      .padStart(2, "0");
    const s = (remaining % 60).toString().padStart(2, "0");
    timerTimeEl.textContent = `${m}:${s}`;
    timerPhaseEl.textContent = phase === "work" ? "WORK SESSION" : "BREAK";
    setDialProgress(timerArc, 88, 1 - remaining / totalSeconds);
  }

  function switchPhase() {
    phase = phase === "work" ? "break" : "work";
    totalSeconds =
      (phase === "work"
        ? parseInt(workSelect.value, 10)
        : parseInt(breakSelect.value, 10)) * 60;
    remaining = totalSeconds;
    renderTimer();
  }

  function tickTimer() {
    remaining--;
    if (remaining < 0) {
      switchPhase();
    }
    renderTimer();
  }

  startBtn.addEventListener("click", () => {
    if (timerHandle) return;
    timerHandle = setInterval(tickTimer, 1000);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    workSelect.disabled = true;
    breakSelect.disabled = true;
  });

  pauseBtn.addEventListener("click", () => {
    clearInterval(timerHandle);
    timerHandle = null;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  });

  resetBtn.addEventListener("click", () => {
    clearInterval(timerHandle);
    timerHandle = null;
    phase = "work";
    totalSeconds = parseInt(workSelect.value, 10) * 60;
    remaining = totalSeconds;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    workSelect.disabled = false;
    breakSelect.disabled = false;
    renderTimer();
  });

  workSelect.addEventListener("change", () => {
    if (phase === "work" && !timerHandle) {
      totalSeconds = parseInt(workSelect.value, 10) * 60;
      remaining = totalSeconds;
      renderTimer();
    }
  });
  breakSelect.addEventListener("change", () => {
    if (phase === "break" && !timerHandle) {
      totalSeconds = parseInt(breakSelect.value, 10) * 60;
      remaining = totalSeconds;
      renderTimer();
    }
  });

  const quotes = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      text: "Discipline is choosing between what you want now and what you want most.",
      author: "Abraham Lincoln",
    },
    {
      text: "Small daily improvements are the key to staggering long-term results.",
      author: "Unknown",
    },
    {
      text: "You do not rise to the level of your goals. You fall to the level of your systems.",
      author: "James Clear",
    },
    {
      text: "Focus on being productive instead of busy.",
      author: "Tim Ferriss",
    },
    { text: "Well begun is half done.", author: "Aristotle" },
    {
      text: "Action is the foundational key to all success.",
      author: "Pablo Picasso",
    },
    { text: "What gets measured gets managed.", author: "Peter Drucker" },
  ];
  let lastQuoteIndex = -1;

  function showRandomQuote() {
    let idx = Math.floor(Math.random() * quotes.length);
    if (quotes.length > 1 && idx === lastQuoteIndex)
      idx = (idx + 1) % quotes.length;
    lastQuoteIndex = idx;
    document.getElementById("quote-text").textContent = quotes[idx].text;
    document.getElementById("quote-author").textContent =
      `— ${quotes[idx].author}`;
  }
  document
    .getElementById("new-quote-btn")
    .addEventListener("click", showRandomQuote);

  renderTasks();
  renderSideTasks();
  renderPlanner();
  renderPlannerPreview();
  renderGoals();
  renderDial();
  renderTimer();
  showRandomQuote();
})();
