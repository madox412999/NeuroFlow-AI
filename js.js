(function () {
  "use strict";

  // ─── DATA ────────────────────────────────────────────────────────────────────

  var DASHBOARD_DATA = {

    // Static fields shared across periods
    stats: {
      tasks:  { label: "Active tasks",  hint: "vs last 7 days"       },
      agents: { label: "AI agents",     badge: "Live",  badgeClass: "neutral" },
      usage:  { label: "Token usage",   hint: "this billing period"   },
      perf:   { label: "Performance",   hint: "p95 latency",    badge: "99.2%", badgeClass: "up"                  },
    },

    // Per-period overrides drive stats cards + chart
    analytics: {
      "14d": {
        desc: "Requests and tokens over the last 14 days",
        series: [32, 38, 35, 48, 52, 45, 58, 62, 55, 68, 72, 65, 78, 82],
        tasks:  { value: 2847,  change: "+12%" },
        agents: { value: 18, hint: "8 running now"  },
        tokens: { display: "1.24", change: "+4%"  },
        perf:   { value: 142 },
      },
      "30d": {
        desc: "Requests and tokens over the last 30 days",
        series: [28, 35, 42, 38, 50, 55, 48, 60, 58, 65, 70, 62, 75, 80],
        tasks:  { value: 6310,  change: "+8%"  },
        agents: { value: 21, hint: "11 running now" },
        tokens: { display: "2.87", change: "+6%"  },
        perf:   { value: 138 },
      },
      "90d": {
        desc: "Requests and tokens over the last 90 days",
        series: [22, 28, 33, 40, 38, 45, 52, 48, 58, 55, 65, 62, 72, 85],
        tasks:  { value: 18420, change: "+31%" },
        agents: { value: 24, hint: "14 running now" },
        tokens: { display: "8.40", change: "+18%" },
        perf:   { value: 151 },
      },
    },

    agents: [
      { id: "research", name: "Research synthesizer", model: "GPT-4", env: "Production", status: "running", icon: "Σ", color: "violet", desc: "Pulls sources together with citations — tuned for long research threads.", version: "v2.1", requestsToday: 12840, tokensToday: "184k", uptime: "99.8%", lastDeployed: "2 days ago",
        modelId: "gpt-4-turbo-preview", temperature: 0.35, maxTokens: 8192,
        liveSeed: { rps: 16.2, latency: 128, errors: 0 },
        activity: [
          { time: "12s", text: "Streaming completion · batch #8841", kind: "ok" },
          { time: "41s", text: "Citation graph refreshed", kind: "info" },
          { time: "2m", text: "Rate limit headroom 62%", kind: "muted" },
        ] },
      { id: "support", name: "Support triage", model: "Claude", env: "Staging", status: "running", icon: "λ", color: "cyan", desc: "Classifies tickets, drafts first replies, and hands off when confidence is low.", version: "v1.8", requestsToday: 8420, tokensToday: "126k", uptime: "99.5%", lastDeployed: "5 days ago",
        modelId: "claude-3-5-sonnet-20241022", temperature: 0.25, maxTokens: 4096,
        liveSeed: { rps: 26.4, latency: 91, errors: 1 },
        activity: [
          { time: "8s", text: "Ticket #4412 auto-replied", kind: "ok" },
          { time: "33s", text: "Escalation rule matched", kind: "warn" },
          { time: "4m", text: "Queue depth stable", kind: "info" },
        ] },
      { id: "code", name: "Code reviewer", model: "Custom", env: "Production", status: "idle", icon: "◆", color: "amber", desc: "Reviews diffs for risk and style; runs on each push to protected branches.", version: "v3.0", requestsToday: 2140, tokensToday: "38k", uptime: "100%", lastDeployed: "11 days ago",
        modelId: "nf-code-reviewer-v3", temperature: 0.1, maxTokens: 16384,
        liveSeed: { rps: 0.3, latency: 198, errors: 0 },
        activity: [
          { time: "2h", text: "Last run: PR #219 · 3 findings", kind: "muted" },
          { time: "1d", text: "Policy pack v3 deployed", kind: "info" },
        ] },
      { id: "data", name: "Data extractor", model: "Embeddings", env: "Production", status: "degraded", icon: "◇", color: "rose", desc: "Extracts tables and fields from documents — watch queue while upstream is slow.", version: "v1.2", requestsToday: 3710, tokensToday: "67k", uptime: "94.1%", lastDeployed: "3 days ago",
        modelId: "text-embedding-3-large", temperature: 0, maxTokens: 8191,
        liveSeed: { rps: 5.8, latency: 398, errors: 7 },
        activity: [
          { time: "22s", text: "Upstream timeout · retry 2/3", kind: "warn" },
          { time: "1m", text: "Queue backlog elevated", kind: "warn" },
          { time: "8m", text: "Partial batch committed", kind: "info" },
        ] },
      { id: "meetings", name: "Meeting notetaker", model: "Whisper", env: "Production", status: "running", icon: "◎", color: "indigo", desc: "Joins calls, drafts structured notes, and posts recap threads to your workspace.", version: "v1.5", requestsToday: 4820, tokensToday: "92k", uptime: "99.9%", lastDeployed: "1 day ago",
        modelId: "whisper-large-v3", temperature: 0, maxTokens: 0,
        liveSeed: { rps: 4.2, latency: 172, errors: 0 },
        activity: [
          { time: "5m", text: "Recap posted to #sales", kind: "ok" },
          { time: "18m", text: "Transcript segmented · 48 min", kind: "info" },
          { time: "1h", text: "GPU slice scaled +1", kind: "muted" },
        ] },
    ],

    activity: [
      { headline: "Workflow",    text: "\u201cInvoice OCR\u201d completed \u00b7 2.4k tokens",    time: "2 min ago",  dot: "ok"   },
      { headline: "Agent",       text: "Research synthesizer deployed v2.1",                      time: "18 min ago", dot: "info" },
      { headline: "Integration", text: "Slack rate limit approached (82%)",                       time: "1 hr ago",   dot: "warn" },
      { headline: "User",        text: "API key rotated for staging environment",                 time: "3 hr ago",   dot: "ok"   },
      { headline: "System",      text: "Scheduled maintenance window completed",                  time: "Yesterday",  dot: "muted"},
      { headline: "Policy",      text: "Snapshot published to audit log \u00b7 governance pack", time: "Yesterday",  dot: "muted"},
      { headline: "Budget",      text: "Compute spend reached 76% of monthly cap",               time: "2 days ago", dot: "warn" },
      { headline: "Webhook",     text: "CRM sync retried successfully after transient 502",      time: "2 days ago", dot: "ok"   },
    ],

    workflows: [
      { id: "wf-invoice-ocr",  name: "Invoice OCR",            status: "active", lastRun: "2 min ago",  trigger: "Webhook",        steps: 6, stepsList: [
        { label: "Webhook trigger",  s: "done" }, { label: "Validate payload", s: "done" },
        { label: "OCR engine",       s: "done" }, { label: "Parse fields",     s: "done" },
        { label: "Push to CRM",      s: "done" }, { label: "Archive record",   s: "done" },
      ]},
      { id: "wf-onboarding",   name: "Customer onboarding",    status: "active", lastRun: "41 min ago", trigger: "Form submit",    steps: 5, stepsList: [
        { label: "Form submit",        s: "done" }, { label: "Validate data",   s: "done" },
        { label: "Provision workspace",s: "done" }, { label: "Welcome email",   s: "done" },
        { label: "Notify Slack",       s: "done" },
      ]},
      { id: "wf-nightly-sync", name: "Nightly warehouse sync", status: "paused", lastRun: "11 hr ago",  trigger: "Cron \u00b7 02:00", steps: 4, stepsList: [
        { label: "Cron trigger",      s: "done" }, { label: "Fetch delta records", s: "done" },
        { label: "Transform & load",  s: "done" }, { label: "Send report",         s: "done" },
      ]},
      { id: "wf-slack-digest", name: "Slack weekly digest",    status: "active", lastRun: "1 day ago",  trigger: "Cron \u00b7 Weekly", steps: 3, stepsList: [
        { label: "Cron trigger",    s: "done" }, { label: "Aggregate events", s: "done" },
        { label: "Post to Slack",   s: "done" },
      ]},
      { id: "wf-compliance",   name: "Compliance checklist",   status: "error",  lastRun: "3 days ago", trigger: "Manual",         steps: 7, stepsList: [
        { label: "Manual trigger",     s: "done"    }, { label: "Load policy rules",  s: "done"    },
        { label: "Scan repositories",  s: "done"    }, { label: "Run audit agent",    s: "error"   },
        { label: "Generate report",    s: "pending" }, { label: "Send notifications", s: "pending" },
        { label: "Archive results",    s: "pending" },
      ]},
    ],

    analyticsCalls: [148, 162, 155, 178, 192, 175, 208, 225, 198, 241, 268, 252, 285, 312],
  };

  // ─── LIVE SIMULATION DATA ────────────────────────────────────────────────────

  var LIVE_EVENT_POOL = [
    { headline: "Workflow",    text: "\u201cEmail digest\u201d completed \u00b7 1.1k tokens",               dot: "ok"   },
    { headline: "Agent",       text: "Research synthesizer processed batch #441",                           dot: "info" },
    { headline: "API",         text: "Rate limit cleared \u00b7 resuming normal throughput",                dot: "ok"   },
    { headline: "Workflow",    text: "\u201cSupport triage\u201d routed 3 tickets to queue",                dot: "ok"   },
    { headline: "Agent",       text: "Meeting notetaker joined scheduled call",                             dot: "info" },
    { headline: "Webhook",     text: "Outbound event delivered to CRM \u00b7 201 OK",                      dot: "ok"   },
    { headline: "System",      text: "Health check passed \u00b7 all services nominal",                    dot: "ok"   },
    { headline: "Agent",       text: "Code reviewer flagged 2 issues in PR #219",                          dot: "warn" },
    { headline: "Workflow",    text: "\u201cInvoice OCR\u201d queued 5 new documents",                     dot: "info" },
    { headline: "Integration", text: "Slack delivered 14 pending notifications",                           dot: "ok"   },
    { headline: "Agent",       text: "Data extractor recovered \u00b7 queue draining",                     dot: "ok"   },
    { headline: "Workflow",    text: "\u201cCompliance checklist\u201d run started manually",               dot: "info" },
    { headline: "System",      text: "Auto-scaling triggered \u00b7 +1 worker node",                       dot: "info" },
    { headline: "Budget",      text: "Compute spend reached 81% of monthly cap",                           dot: "warn" },
    { headline: "Webhook",     text: "CRM sync completed \u00b7 48 records updated",                      dot: "ok"   },
    { headline: "Agent",       text: "Support triage escalated ticket #8823",                              dot: "warn" },
    { headline: "Workflow",    text: "\u201cNightly sync\u201d pre-flight checks passed",                  dot: "ok"   },
    { headline: "User",        text: "Dashboard session refreshed",                                        dot: "ok"   },
    { headline: "Agent",       text: "Research synthesizer started new thread",                            dot: "info" },
    { headline: "Integration", text: "GitHub webhook received \u00b7 PR #312 opened",                     dot: "info" },
  ];

  var liveValues = { tasks: 0, perf: 0 };

  // ─── LOOKUP MAPS ─────────────────────────────────────────────────────────────

  var STATUS_CLASS = { running: "status--ok", idle: "status--idle", degraded: "status--warn" };
  var STATUS_LABEL = { running: "Running",    idle: "Idle",         degraded: "Degraded"      };

  var VIEW_COPY = {
    dashboard:    { title: "Dashboard",    subtitle: "Overview of agents, usage, and recent activity"                },
    analytics:    { title: "Analytics",    subtitle: "Explore usage, costs, and quality signals across your workspace." },
    agents:       { title: "AI Agents",    subtitle: "Build, version, and deploy agents with guardrails and tools."     },
    workflows:    { title: "Workflows",    subtitle: "Automate multi-step processes with triggers and human handoff."   },
    integrations: { title: "Integrations", subtitle: "Connect Slack, data warehouses, and custom APIs in one place."    },
    settings:     { title: "Settings",     subtitle: "Workspace preferences, billing, keys, and access control."        },
  };

  // ─── DOM REFS ────────────────────────────────────────────────────────────────

  var app          = document.querySelector("[data-app]");
  var toggle       = document.querySelector("[data-sidebar-toggle]");
  var backdrop     = document.querySelector("[data-sidebar-backdrop]");
  var navLinks     = document.querySelectorAll("[data-nav]");
  var viewPanels   = document.querySelectorAll("[data-view-panel]");
  var pageTitle    = document.querySelector("[data-page-title]");
  var pageSubtitle = document.querySelector("[data-page-subtitle]");
  var tabs         = document.querySelectorAll("[data-tab]");
  var chartLine    = document.querySelector("[data-chart-line]");
  var chartArea    = document.querySelector("[data-chart-area]");
  var chartLabels  = document.querySelector("[data-chart-labels]");
  var chartWrap    = document.querySelector("[data-chart-wrap]");
  var chartDesc    = document.querySelector("[data-chart-desc]");
  var statsEl      = document.querySelector("[data-stats]");
  var agentListEl  = document.querySelector("[data-agent-list]");
  var activityEl   = document.querySelector("[data-activity]");
  var agentPreview     = document.querySelector("[data-agent-preview]");
  var agentPreviewName = document.querySelector("[data-agent-preview-name]");
  var agentPreviewDesc = document.querySelector("[data-agent-preview-desc]");
  var agentPreviewPill = document.querySelector("[data-agent-preview-pill]");
  var toastEl      = document.querySelector("[data-toast]");
  var exportBtn    = document.querySelector("[data-btn-export]");
  var workflowBtn  = document.querySelector("[data-btn-workflow]");
  var mainEl         = document.querySelector(".main");
  var settingsAside  = document.querySelector(".settings-aside");
  var settingsViewEl = document.getElementById("view-settings");

  var toastTimer;
  var toastHideTimer;
  var currentPeriod = "14d";
  var rendered = {};
  var agentLiveSim = {};

  // ─── PERSISTENCE ─────────────────────────────────────────────────────────────

  var LS_WORKFLOWS = "nf_workflows";
  var LS_VIEW      = "nf_view";

  function saveWorkflows() {
    try { localStorage.setItem(LS_WORKFLOWS, JSON.stringify(DASHBOARD_DATA.workflows)); } catch (e) {}
  }

  function loadWorkflows() {
    try {
      var raw = localStorage.getItem(LS_WORKFLOWS);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) DASHBOARD_DATA.workflows = parsed;
      }
    } catch (e) {}
  }

  function saveView(viewId) {
    try { localStorage.setItem(LS_VIEW, viewId); } catch (e) {}
  }

  function loadView() {
    try { return localStorage.getItem(LS_VIEW) || "dashboard"; } catch (e) { return "dashboard"; }
  }

  // Restore persisted workflows before any rendering
  loadWorkflows();

  // ─── HELPERS ─────────────────────────────────────────────────────────────────

  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  // Convert a plain-text lastRun string to an approximate Unix timestamp
  function parseLastRunTs(str) {
    var now = Date.now();
    if (!str || str === "just now") return now;
    var m = str.match(/^(\d+)\s*min/);   if (m) return now - parseInt(m[1], 10) * 60000;
    var h = str.match(/^(\d+)\s*hr/);    if (h) return now - parseInt(h[1], 10) * 3600000;
    var d = str.match(/^(\d+)\s*day/);   if (d) return now - parseInt(d[1], 10) * 86400000;
    if (str === "Yesterday") return now - 86400000;
    return now;
  }

  function timeAgo(ts) {
    var diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60)   return "just now";
    var mins = Math.floor(diff / 60);
    if (mins < 60)   return mins + " min ago";
    var hrs  = Math.floor(mins / 60);
    if (hrs  < 24)   return hrs  + " hr ago";
    var days = Math.floor(hrs  / 24);
    return days === 1 ? "Yesterday" : days + " days ago";
  }

  function animateCount(el, target, duration) {
    if (!el) return;
    if (el._raf) cancelAnimationFrame(el._raf);
    var startTime = null;
    function frame(now) {
      if (!startTime) startTime = now;
      var t = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.round(easeOutCubic(t) * target).toLocaleString();
      if (t < 1) { el._raf = requestAnimationFrame(frame); }
      else { el._raf = null; }
    }
    el._raf = requestAnimationFrame(frame);
  }

  function isMobile() { return window.matchMedia("(max-width: 900px)").matches; }

  /** Phone browser “desktop site” — wide layout on a narrow screen */
  function isDesktopSiteOnPhone() {
    return window.matchMedia("(min-width: 861px) and (hover: none) and (pointer: coarse)").matches;
  }

  // Seed timestamps only for entries that don't already have one (from localStorage)
  DASHBOARD_DATA.workflows.forEach(function (wf) {
    if (!wf.lastRunTs) wf.lastRunTs = parseLastRunTs(wf.lastRun);
  });

  // ─── RENDER: STATS ───────────────────────────────────────────────────────────

  function renderStats(period, fast) {
    if (!statsEl) return;
    var s  = DASHBOARD_DATA.stats;
    var pd = DASHBOARD_DATA.analytics[period] || DASHBOARD_DATA.analytics["14d"];

    // Keep live values in sync with the newly selected period
    liveValues.tasks = pd.tasks.value;
    liveValues.perf  = pd.perf.value;

    var cards = [
      {
        label:      s.tasks.label,
        valueHtml:  "<span data-count=\"" + pd.tasks.value + "\" data-live-stat=\"tasks\">0</span>",
        badge:      pd.tasks.change,
        badgeClass: "stat-card__badge--up",
        hint:       s.tasks.hint,
      },
      {
        label:      s.agents.label,
        valueHtml:  "<span data-count=\"" + pd.agents.value + "\">0</span>",
        badge:      s.agents.badge,
        badgeClass: "stat-card__badge--neutral",
        hint:       pd.agents.hint,
      },
      {
        label:      s.usage.label,
        valueHtml:  pd.tokens.display + "<span class=\"stat-card__suffix\">M</span>",
        badge:      pd.tokens.change,
        badgeClass: "stat-card__badge--up",
        hint:       s.usage.hint,
      },
      {
        label:      s.perf.label,
        valueHtml:  "<span data-count=\"" + pd.perf.value + "\" data-live-stat=\"perf\">0</span><span class=\"stat-card__suffix\">ms</span>",
        badge:      s.perf.badge,
        badgeClass: "stat-card__badge--up",
        hint:       s.perf.hint,
      },
    ];

    statsEl.innerHTML = cards.map(function (c, i) {
      var delay = fast ? "" : " style=\"animation-delay:" + (i * 60) + "ms\"";
      return (
        "<article class=\"stat-card\" role=\"listitem\"" + delay + ">" +
          "<div class=\"stat-card__top\">" +
            "<span class=\"stat-card__label\">" + esc(c.label) + "</span>" +
            "<span class=\"stat-card__badge " + c.badgeClass + "\">" + esc(c.badge) + "</span>" +
          "</div>" +
          "<p class=\"stat-card__value\">" + c.valueHtml + "</p>" +
          "<p class=\"stat-card__hint\">" + esc(c.hint) + "</p>" +
        "</article>"
      );
    }).join("");

    var duration = fast ? 650 : 1200;
    statsEl.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      if (!isNaN(target)) animateCount(el, target, duration);
    });
  }

  // ─── RENDER: AGENTS ──────────────────────────────────────────────────────────

  function renderAgents() {
    if (!agentListEl) return;

    agentListEl.innerHTML = DASHBOARD_DATA.agents.map(function (a) {
      var sc = STATUS_CLASS[a.status] || "status--idle";
      var sl = STATUS_LABEL[a.status] || a.status;
      return (
        "<li class=\"agent-card\" tabindex=\"0\" role=\"button\" data-agent data-agent-key=\"" + esc(a.id) + "\">" +
          "<div class=\"agent-card__icon agent-card__icon--" + esc(a.color) + "\">" + esc(a.icon) + "</div>" +
          "<div class=\"agent-card__body\">" +
            "<span class=\"agent-card__name\">" + esc(a.name) + "</span>" +
            "<span class=\"agent-card__meta\">" + esc(a.model) + " \u00b7 " + esc(a.env) + "</span>" +
          "</div>" +
          "<span class=\"status " + sc + "\">" + sl + "</span>" +
        "</li>"
      );
    }).join("");

    bindAgentCards();
  }

  // ─── RENDER: ACTIVITY ────────────────────────────────────────────────────────

  function renderActivity() {
    if (!activityEl) return;

    activityEl.innerHTML = DASHBOARD_DATA.activity.map(function (item) {
      return (
        "<li class=\"activity-item\">" +
          "<span class=\"activity-item__dot activity-item__dot--" + item.dot + "\"></span>" +
          "<div class=\"activity-item__content\">" +
            "<p class=\"activity-item__text\"><strong>" + esc(item.headline) + "</strong> " + esc(item.text) + "</p>" +
            "<time class=\"activity-item__time\">" + esc(item.time) + "</time>" +
          "</div>" +
        "</li>"
      );
    }).join("");
  }

  // ─── AGENT PREVIEW ───────────────────────────────────────────────────────────

  function resetAgentPreview() {
    if (!agentPreview) return;
    agentPreview.classList.remove("is-switching");
    agentPreview.classList.add("agent-preview--empty");
    if (agentPreviewName) agentPreviewName.textContent = "None";
    if (agentPreviewPill) {
      agentPreviewPill.className = "status status--placeholder";
      agentPreviewPill.textContent = "None";
    }
    if (agentPreviewDesc) agentPreviewDesc.textContent = "Select an agent below to see status and details.";
  }

  function showAgentPreview(agentData, crossfade) {
    if (!agentPreview) return;
    var sc = STATUS_CLASS[agentData.status] || "status--idle";
    var sl = STATUS_LABEL[agentData.status] || agentData.status;

    function apply() {
      agentPreview.classList.remove("agent-preview--empty");
      if (agentPreviewName) agentPreviewName.textContent = agentData.name;
      if (agentPreviewPill) {
        agentPreviewPill.className = "status " + sc;
        agentPreviewPill.textContent = sl;
      }
      if (agentPreviewDesc) agentPreviewDesc.textContent = agentData.desc;
    }

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (crossfade && !reduceMotion) {
      agentPreview.classList.add("is-switching");
      setTimeout(function () {
        apply();
        agentPreview.classList.remove("is-switching");
      }, 140);
    } else {
      apply();
    }
  }

  // ─── AGENT CARD BINDING ──────────────────────────────────────────────────────

  function bindAgentCards() {
    var cards = agentListEl ? agentListEl.querySelectorAll("[data-agent]") : [];

    Array.prototype.forEach.call(cards, function (card) {
      card.addEventListener("click", function () {
        var key = card.getAttribute("data-agent-key");
        var agentData = null;
        for (var i = 0; i < DASHBOARD_DATA.agents.length; i++) {
          if (DASHBOARD_DATA.agents[i].id === key) { agentData = DASHBOARD_DATA.agents[i]; break; }
        }

        if (card.classList.contains("agent-card--selected")) {
          card.classList.remove("agent-card--selected");
          resetAgentPreview();
          return;
        }

        var hadOther = Array.prototype.some.call(cards, function (c) {
          return c !== card && c.classList.contains("agent-card--selected");
        });

        Array.prototype.forEach.call(cards, function (c) { c.classList.remove("agent-card--selected"); });
        card.classList.add("agent-card--selected");
        if (agentData) showAgentPreview(agentData, hadOther);
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.click(); }
      });
    });
  }

  // ─── SIDEBAR ─────────────────────────────────────────────────────────────────

  function setSidebarOpen(open) {
    if (!app) return;
    app.classList.toggle("sidebar-open", open);
    if (backdrop) {
      backdrop.classList.toggle("is-visible", open);
      backdrop.setAttribute("aria-hidden", open ? "false" : "true");
    }
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (toggle && open) toggle.setAttribute("aria-label", "Close menu");
    if (toggle && !open) toggle.setAttribute("aria-label", "Open menu");
  }

  // ─── LOADING HELPER ──────────────────────────────────────────────────────────

  /**
   * Temporarily puts btn into a loading state, then calls onComplete.
   * skipRestore: when the action itself replaces the button in the DOM.
   */
  function withLoading(btn, loadingText, delay, onComplete, skipRestore) {
    if (!btn || btn.disabled || btn.dataset.loading) return;
    var origHtml = btn.innerHTML;
    btn.dataset.loading = "1";
    btn.disabled = true;
    btn.classList.add("btn--loading");
    btn.textContent = loadingText;
    setTimeout(function () {
      delete btn.dataset.loading;
      btn.disabled = false;
      btn.classList.remove("btn--loading");
      if (!skipRestore) btn.innerHTML = origHtml;
      if (onComplete) onComplete();
    }, delay);
  }

  // ─── TOAST ───────────────────────────────────────────────────────────────────

  var headerActions = document.querySelector(".header__actions");

  function positionToast() {
    if (!toastEl || !headerActions) return;
    var r = headerActions.getBoundingClientRect();
    toastEl.style.left = (r.left + r.width / 2) + "px";
    toastEl.style.top  = (r.bottom + 12) + "px";
  }

  function showToast(message) {
    if (!toastEl) return;
    clearTimeout(toastTimer);
    clearTimeout(toastHideTimer);
    positionToast();
    toastEl.textContent = message;
    toastEl.hidden = false;
    requestAnimationFrame(function () { toastEl.classList.add("toast--visible"); });
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("toast--visible");
      toastHideTimer = setTimeout(function () { toastEl.hidden = true; }, 300);
    }, 2600);
  }

  // ─── SETTINGS ASIDE (viewport-fixed via body reparent) ───────────────────
  var _settingsAsideParent = null;
  var _settingsAsideNext   = null;
  var _pinRetry            = 0;

  function unpinSettingsAside() {
    if (!settingsAside) return;
    settingsAside.style.cssText = "";
    if (_settingsAsideParent && settingsAside.parentNode === document.body) {
      _settingsAsideParent.insertBefore(settingsAside, _settingsAsideNext);
    }
    _settingsAsideParent = null;
    _settingsAsideNext = null;
  }

  function pinSettingsAside() {
    if (!settingsAside || !settingsViewEl || settingsViewEl.hidden) return;
    if (window.innerWidth <= 860 || isDesktopSiteOnPhone()) {
      unpinSettingsAside();
      return;
    }
    if (settingsAside.parentNode === document.body) {
      unpinSettingsAside();
    }

    settingsAside.style.cssText = "";
    void settingsAside.offsetHeight;

    var r = settingsAside.getBoundingClientRect();
    if (r.width < 16) {
      if (_pinRetry++ < 12) {
        requestAnimationFrame(function () { requestAnimationFrame(pinSettingsAside); });
      } else {
        _pinRetry = 0;
      }
      return;
    }
    _pinRetry = 0;

    _settingsAsideParent = settingsAside.parentNode;
    _settingsAsideNext = settingsAside.nextSibling;
    document.body.appendChild(settingsAside);
    settingsAside.style.cssText =
      "position:fixed;" +
      "top:" + Math.round(r.top) + "px;" +
      "left:" + Math.round(r.left) + "px;" +
      "width:" + Math.ceil(r.width) + "px;" +
      "box-sizing:border-box;" +
      "z-index:50;";
  }

  // ─── VIEW SWITCHING ──────────────────────────────────────────────────────────

  function switchView(viewId) {
    var copy = VIEW_COPY[viewId];
    if (!copy) return;
    saveView(viewId);

    unpinSettingsAside();
    if (mainEl) mainEl.scrollTop = 0;

    viewPanels.forEach(function (panel) {
      var id = panel.getAttribute("data-view-panel");
      var match = id === viewId;
      panel.toggleAttribute("hidden", !match);
      panel.setAttribute("aria-hidden", match ? "false" : "true");
    });

    navLinks.forEach(function (link) {
      link.classList.toggle("nav-link--active", link.getAttribute("data-nav") === viewId);
    });

    if (pageTitle) pageTitle.textContent = copy.title;
    if (pageSubtitle) pageSubtitle.textContent = copy.subtitle;

    if (viewId !== "agents") resetAgentsDetailPanel();

    if (viewId !== "dashboard") {
      var allCards = agentListEl ? agentListEl.querySelectorAll("[data-agent]") : [];
      Array.prototype.forEach.call(allCards, function (c) { c.classList.remove("agent-card--selected"); });
      resetAgentPreview();
    }

    if (!rendered[viewId]) {
      rendered[viewId] = true;
      if (viewId === "analytics") renderAnalyticsChart();
      if (viewId === "agents")    renderAgentsPage();
      if (viewId === "workflows") renderWorkflowsPage();
    }

    if (viewId === "settings") {
      requestAnimationFrame(function () {
        requestAnimationFrame(pinSettingsAside);
      });
    }

    if (isMobile()) setSidebarOpen(false);
  }

  // ─── CHART ───────────────────────────────────────────────────────────────────

  function buildPath(values, w, h) {
    var pad = { top: 24, bottom: 28, left: 8, right: 8 };
    var iW = w - pad.left - pad.right, iH = h - pad.top - pad.bottom;
    var max = Math.max.apply(null, values), min = Math.min.apply(null, values);
    var range = max - min || 1, n = values.length;
    var pts = values.map(function (v, i) {
      return [pad.left + (iW * i) / (n - 1), pad.top + iH * (1 - (v - min) / range)];
    });

    var d = "M" + pts[0][0].toFixed(2) + " " + pts[0][1].toFixed(2);
    for (var i = 0; i < n - 1; i++) {
      var p0 = pts[i > 0 ? i - 1 : i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2 < n ? i + 2 : i + 1];
      d += " C" +
        (p1[0] + (p2[0] - p0[0]) / 6).toFixed(2) + " " + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(2) + " " +
        (p2[0] - (p3[0] - p1[0]) / 6).toFixed(2) + " " + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(2) + " " +
        p2[0].toFixed(2) + " " + p2[1].toFixed(2);
    }

    var by = h - pad.bottom;
    return {
      line: d,
      area: d + " L" + pts[n - 1][0].toFixed(2) + " " + by.toFixed(2) + " L" + pts[0][0].toFixed(2) + " " + by.toFixed(2) + " Z",
    };
  }

  function flashChart() {
    if (!chartWrap) return;
    chartWrap.classList.remove("chart-wrap--tick");
    void chartWrap.offsetWidth;
    chartWrap.classList.add("chart-wrap--tick");
    setTimeout(function () { chartWrap.classList.remove("chart-wrap--tick"); }, 400);
  }

  function renderChart(period, silent) {
    var pd = DASHBOARD_DATA.analytics[period] || DASHBOARD_DATA.analytics["14d"];
    var paths = buildPath(pd.series, 800, 220);

    if (chartLine)   chartLine.setAttribute("d", paths.line);
    if (chartArea)   chartArea.setAttribute("d", paths.area);
    if (chartDesc)   chartDesc.textContent = pd.desc;
    if (chartLabels) {
      chartLabels.innerHTML = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        .map(function (d) { return "<span>" + d + "</span>"; })
        .join("");
    }

    if (!silent) flashChart();
  }

  // ─── RENDER: ANALYTICS CHART (page) ─────────────────────────────────────────

  function renderAnalyticsChart() {
    var acLine   = document.querySelector("[data-ac-line]");
    var acArea   = document.querySelector("[data-ac-area]");
    var acLabels = document.querySelector("[data-ac-labels]");
    if (!acLine) return;

    var paths = buildPath(DASHBOARD_DATA.analyticsCalls, 800, 220);
    if (acLine)   acLine.setAttribute("d", paths.line);
    if (acArea)   acArea.setAttribute("d", paths.area);
    if (acLabels) {
      var days = ["Apr 18", "Apr 19", "Apr 20", "Apr 21", "Apr 22", "Apr 23", "Apr 24"];
      acLabels.innerHTML = days.map(function (d) { return "<span>" + d + "</span>"; }).join("");
    }
  }

  // ─── RENDER: AGENTS PAGE ─────────────────────────────────────────────────────

  function ensureAgentLiveSim(a) {
    if (!a.liveSeed) return;
    if (!agentLiveSim[a.id]) {
      agentLiveSim[a.id] = {
        rps: a.liveSeed.rps,
        latency: a.liveSeed.latency,
        errors: a.liveSeed.errors,
      };
    }
  }

  function formatAgentRps(n) {
    return (Math.round(n * 10) / 10).toFixed(1);
  }

  function updateAgentLiveDOM(agentId) {
    var inner = document.querySelector("[data-agent-detail-inner]");
    if (!inner || inner.getAttribute("data-agent-id") !== agentId) return;
    var v = agentLiveSim[agentId];
    if (!v) return;
    var rpsEl = inner.querySelector("[data-live-rps]");
    var latEl = inner.querySelector("[data-live-latency]");
    var errEl = inner.querySelector("[data-live-errors]");
    if (rpsEl) rpsEl.textContent = formatAgentRps(v.rps) + "/s";
    if (latEl) latEl.textContent = Math.round(v.latency) + " ms";
    if (errEl) errEl.textContent = String(Math.max(0, Math.round(v.errors)));
  }

  function tickAgentDetailLive() {
    var view = document.getElementById("view-agents");
    if (!view || view.hidden) return;
    var inner = document.querySelector("[data-agent-detail-inner]");
    if (!inner) return;
    var shell = inner.closest("[data-agent-detail-shell]");
    if (!shell || shell.hidden) return;
    var id = inner.getAttribute("data-agent-id");
    if (!id || !agentLiveSim[id]) return;
    var v = agentLiveSim[id];
    var agent = null;
    for (var i = 0; i < DASHBOARD_DATA.agents.length; i++) {
      if (DASHBOARD_DATA.agents[i].id === id) { agent = DASHBOARD_DATA.agents[i]; break; }
    }
    if (!agent || !agent.liveSeed) return;
    var j = agent.status === "degraded" ? 1.4 : agent.status === "idle" ? 0.25 : 1;
    v.rps += (Math.random() - 0.48) * 1.6 * j;
    if (agent.status === "idle") v.rps = Math.max(0, Math.min(3.2, v.rps));
    else v.rps = Math.max(0.12, Math.min(92, v.rps));
    v.latency += Math.round((Math.random() - 0.5) * 9 * j);
    v.latency = Math.max(agent.liveSeed.latency * 0.72, Math.min(agent.liveSeed.latency * 1.38, v.latency));
    v.errors = Math.max(0, agent.liveSeed.errors + Math.round((Math.random() - 0.45) * 1));
    updateAgentLiveDOM(id);
  }

  function buildAgentDetailHTML(a) {
    var sc = STATUS_CLASS[a.status] || "status--idle";
    var sl = STATUS_LABEL[a.status] || a.status;
    var pulse = a.status === "running"
      ? "<span class=\"agent-detail__pulse\" aria-hidden=\"true\"><span class=\"agent-detail__pulse-dot\"></span></span>"
      : "<span class=\"agent-detail__pulse agent-detail__pulse--off\" aria-hidden=\"true\"><span class=\"agent-detail__pulse-dot\"></span></span>";
    var tempStr = a.temperature === 0 ? "0" : String(a.temperature);
    var maxTokStr = a.maxTokens === 0 ? "\u2014" : Number(a.maxTokens).toLocaleString();
    var logHtml = (a.activity || []).map(function (row) {
      var k = row.kind || "muted";
      return "<li class=\"agent-detail__log-i agent-detail__log-i--" + esc(k) + "\"><span>" + esc(row.time) + "</span><span>" + esc(row.text) + "</span></li>";
    }).join("");
    return (
      "<div class=\"agent-detail__canvas\" data-agent-id=\"" + esc(a.id) + "\">" +
        "<header class=\"agent-detail__top\">" +
          "<div class=\"agent-card__icon agent-card__icon--" + esc(a.color) + "\">" + esc(a.icon) + "</div>" +
          "<div class=\"agent-detail__top-text\">" +
            "<h3 class=\"agent-detail__name\">" + esc(a.name) + "</h3>" +
            "<p class=\"agent-detail__meta\">" + esc(a.model) + " \u00b7 " + esc(a.env) + "</p>" +
          "</div>" +
          "<div class=\"agent-detail__status-slot\">" + pulse + "<span class=\"status " + sc + "\">" + esc(sl) + "</span></div>" +
        "</header>" +
        "<section class=\"agent-detail__live\" aria-label=\"Live metrics\">" +
          "<div class=\"agent-detail__live-hd\"><span class=\"agent-detail__live-tag\">Live</span><span class=\"agent-detail__live-note\">simulated</span></div>" +
          "<div class=\"agent-detail__live-row\">" +
            "<div class=\"agent-detail__live-cell\"><span class=\"agent-detail__live-lbl\">Req/s</span><span class=\"agent-detail__live-num mono\" data-live-rps>\u2014</span></div>" +
            "<div class=\"agent-detail__live-cell\"><span class=\"agent-detail__live-lbl\">Latency</span><span class=\"agent-detail__live-num mono\" data-live-latency>\u2014</span></div>" +
            "<div class=\"agent-detail__live-cell\"><span class=\"agent-detail__live-lbl\">Errors 24h</span><span class=\"agent-detail__live-num mono agent-detail__live-num--err\" data-live-errors>\u2014</span></div>" +
          "</div>" +
        "</section>" +
        "<p class=\"agent-detail__desc\">" + esc(a.desc) + "</p>" +
        "<section class=\"agent-detail__model\" aria-label=\"Model\">" +
          "<h4 class=\"agent-detail__lbl\">Model</h4>" +
          "<dl class=\"agent-detail__dl\">" +
            "<div><dt>Name</dt><dd class=\"mono\">" + esc(a.modelId || a.model) + "</dd></div>" +
            "<div><dt>Version</dt><dd>" + esc(a.version) + "</dd></div>" +
            "<div><dt>Temperature</dt><dd>" + esc(tempStr) + "</dd></div>" +
            "<div><dt>Max tokens</dt><dd>" + esc(maxTokStr) + "</dd></div>" +
          "</dl>" +
        "</section>" +
        "<section class=\"agent-detail__log\" aria-label=\"Activity\">" +
          "<h4 class=\"agent-detail__lbl\">Activity</h4>" +
          "<ul class=\"agent-detail__log-ul\">" + logHtml + "</ul>" +
        "</section>" +
        "<div class=\"agent-detail__grid4\">" +
          "<div class=\"agent-detail__metric\"><span class=\"agent-detail__metric-label\">Requests today</span><span class=\"agent-detail__metric-value\">" + Number(a.requestsToday).toLocaleString() + "</span></div>" +
          "<div class=\"agent-detail__metric\"><span class=\"agent-detail__metric-label\">Tokens</span><span class=\"agent-detail__metric-value\">" + esc(a.tokensToday) + "</span></div>" +
          "<div class=\"agent-detail__metric\"><span class=\"agent-detail__metric-label\">Uptime</span><span class=\"agent-detail__metric-value\">" + esc(a.uptime) + "</span></div>" +
          "<div class=\"agent-detail__metric\"><span class=\"agent-detail__metric-label\">Deployed</span><span class=\"agent-detail__metric-value\">" + esc(a.lastDeployed) + "</span></div>" +
        "</div>" +
      "</div>"
    );
  }

  /** Stacked agents layout in css.css — inspector below the list */
  function isAgentsPageMobileLayout() {
    return window.matchMedia("(max-width: 860px)").matches;
  }

  function scrollAgentDetailPanelIntoView(panelEl) {
    if (!panelEl || !isAgentsPageMobileLayout()) return;
    var smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        panelEl.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start", inline: "nearest" });
      });
    });
  }

  function showAgentDetail(a, panelEl) {
    var emptyEl = panelEl.querySelector("[data-agent-detail-empty]");
    var shellEl = panelEl.querySelector("[data-agent-detail-shell]");
    var innerEl = panelEl.querySelector("[data-agent-detail-inner]");
    if (!shellEl || !innerEl) return;

    if (emptyEl) emptyEl.hidden = true;
    shellEl.hidden = false;

    ensureAgentLiveSim(a);
    var prevId = innerEl.querySelector("[data-agent-id]");
    var prev = prevId ? prevId.getAttribute("data-agent-id") : null;
    var switching = prev && prev !== a.id;

    function paint() {
      innerEl.innerHTML = buildAgentDetailHTML(a);
      innerEl.setAttribute("data-agent-id", a.id);
      updateAgentLiveDOM(a.id);
    }

    if (switching) {
      innerEl.classList.add("agent-detail__inner--exit");
      setTimeout(function () {
        paint();
        innerEl.classList.remove("agent-detail__inner--exit");
        innerEl.classList.add("agent-detail__inner--enter");
        scrollAgentDetailPanelIntoView(panelEl);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            innerEl.classList.remove("agent-detail__inner--enter");
          });
        });
      }, 200);
    } else {
      innerEl.classList.remove("agent-detail__inner--exit", "agent-detail__inner--enter");
      paint();
      innerEl.classList.add("agent-detail__inner--enter");
      scrollAgentDetailPanelIntoView(panelEl);
      setTimeout(function () { innerEl.classList.remove("agent-detail__inner--enter"); }, 380);
    }
  }

  function resetAgentsDetailPanel() {
    var panel = document.querySelector("[data-agent-detail]");
    if (!panel) return;
    var emptyEl = panel.querySelector("[data-agent-detail-empty]");
    var shellEl = panel.querySelector("[data-agent-detail-shell]");
    var innerEl = panel.querySelector("[data-agent-detail-inner]");
    if (shellEl) shellEl.hidden = true;
    if (emptyEl) emptyEl.hidden = false;
    if (innerEl) {
      innerEl.innerHTML = "";
      innerEl.removeAttribute("data-agent-id");
      innerEl.classList.remove("agent-detail__inner--exit", "agent-detail__inner--enter");
    }
    document.querySelectorAll("[data-agents-page-card]").forEach(function (c) {
      c.classList.remove("agent-card--selected");
    });
  }

  function updateAgentsPageChrome() {
    var agents = DASHBOARD_DATA.agents;
    var total = agents.length;
    var running = 0;
    var idle = 0;
    var degraded = 0;
    for (var i = 0; i < agents.length; i++) {
      var st = agents[i].status;
      if (st === "running") running++;
      else if (st === "idle") idle++;
      else if (st === "degraded") degraded++;
    }
    function set(sel, v) {
      var n = document.querySelector(sel);
      if (n) n.textContent = v;
    }
    set("[data-chrome-total]", String(total));
    set("[data-chrome-running]", String(running));
    set("[data-chrome-fleet-run]", String(running));
    set("[data-chrome-fleet-idle]", String(idle));
    set("[data-chrome-fleet-attn]", String(degraded));
  }

  function renderAgentsPage() {
    var listEl   = document.querySelector("[data-agents-page-list]");
    var detailEl = document.querySelector("[data-agent-detail]");
    if (!listEl) return;

    updateAgentsPageChrome();

    listEl.innerHTML = DASHBOARD_DATA.agents.map(function (a) {
      var sc = STATUS_CLASS[a.status] || "status--idle";
      var sl = STATUS_LABEL[a.status] || a.status;
      return (
        "<li class=\"agent-card\" tabindex=\"0\" role=\"button\" data-agents-page-card data-agent-key=\"" + esc(a.id) + "\">" +
          "<div class=\"agent-card__icon agent-card__icon--" + esc(a.color) + "\">" + esc(a.icon) + "</div>" +
          "<div class=\"agent-card__body\">" +
            "<span class=\"agent-card__name\">" + esc(a.name) + "</span>" +
            "<span class=\"agent-card__meta\">" + esc(a.model) + " \u00b7 " + esc(a.env) + "</span>" +
          "</div>" +
          "<span class=\"status " + sc + "\">" + sl + "</span>" +
        "</li>"
      );
    }).join("");

    var cards = listEl.querySelectorAll("[data-agents-page-card]");
    Array.prototype.forEach.call(cards, function (card) {
      card.addEventListener("click", function () {
        var key = card.getAttribute("data-agent-key");
        var agentData = null;
        for (var i = 0; i < DASHBOARD_DATA.agents.length; i++) {
          if (DASHBOARD_DATA.agents[i].id === key) { agentData = DASHBOARD_DATA.agents[i]; break; }
        }
        Array.prototype.forEach.call(cards, function (c) { c.classList.remove("agent-card--selected"); });
        card.classList.add("agent-card--selected");
        if (agentData && detailEl) showAgentDetail(agentData, detailEl);
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.click(); }
      });
    });
  }

  // ─── RENDER: WORKFLOWS TABLE ─────────────────────────────────────────────────

  var WF_SC = { active: "wf-status--active", paused: "wf-status--paused", error: "wf-status--error", running: "wf-status--running" };
  var WF_SL = { active: "Active", paused: "Paused", error: "Error", running: "Running\u2026" };

  var WF_TEMPLATES = [
    { name: "Lead enrichment",       trigger: "Webhook",        steps: 5 },
    { name: "Support auto-triage",   trigger: "Form submit",    steps: 4 },
    { name: "PDF data extractor",    trigger: "File upload",    steps: 6 },
    { name: "Monthly usage report",  trigger: "Cron \u00b7 Monthly", steps: 3 },
    { name: "Slack alert router",    trigger: "Webhook",        steps: 4 },
    { name: "Contract review",       trigger: "Manual",         steps: 8 },
    { name: "NPS survey processor",  trigger: "Form submit",    steps: 5 },
    { name: "Daily cost digest",     trigger: "Cron \u00b7 Daily",   steps: 3 },
  ];
  var wfTemplateIdx = 0;

  var WF_TRASH_ICON  = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" aria-hidden=\"true\"><path d=\"M2 4h12M5 4V2.5A1.5 1.5 0 0 1 6.5 1h3A1.5 1.5 0 0 1 11 2.5V4m2 0-.8 9.2A1.5 1.5 0 0 1 10.7 14H5.3a1.5 1.5 0 0 1-1.5-1.8L3 4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>";
  var WF_PAUSE_ICON  = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" aria-hidden=\"true\"><rect x=\"3\" y=\"2.5\" width=\"3.5\" height=\"11\" rx=\"1\" fill=\"currentColor\"/><rect x=\"9.5\" y=\"2.5\" width=\"3.5\" height=\"11\" rx=\"1\" fill=\"currentColor\"/></svg>";
  var WF_RESUME_ICON = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" aria-hidden=\"true\"><path d=\"M4 3l9 5-9 5V3z\" fill=\"currentColor\"/></svg>";

  function wfPauseBtn(status) {
    if (status === "error") return "";
    var isPaused = status === "paused";
    var icon  = isPaused ? WF_RESUME_ICON : WF_PAUSE_ICON;
    var label = isPaused ? "Resume workflow" : "Pause workflow";
    var cls   = "wf-pause-btn" + (isPaused ? " wf-pause-btn--resume" : "");
    return "<button class=\"" + cls + "\" data-wf-pause title=\"" + label + "\" aria-label=\"" + label + "\">" + icon + "</button>";
  }

  function wfTogglePause(tr) {
    var id = tr.getAttribute("data-wf-id");
    if (!id) return;
    var wf = null;
    for (var i = 0; i < DASHBOARD_DATA.workflows.length; i++) {
      if (DASHBOARD_DATA.workflows[i].id === id) { wf = DASHBOARD_DATA.workflows[i]; break; }
    }
    if (!wf || wf.status === "error") return;
    var newStatus = wf.status === "active" ? "paused" : "active";
    wf.status = newStatus;
    var statusCell = tr.cells[1];
    if (statusCell) {
      var span = statusCell.querySelector(".wf-status");
      if (span) {
        span.className = "wf-status " + (WF_SC[newStatus] || "wf-status--paused");
        span.textContent = WF_SL[newStatus] || newStatus;
      }
    }
    var pauseBtn = tr.querySelector("[data-wf-pause]");
    if (pauseBtn) {
      var isPaused = newStatus === "paused";
      pauseBtn.innerHTML = isPaused ? WF_RESUME_ICON : WF_PAUSE_ICON;
      pauseBtn.title = isPaused ? "Resume workflow" : "Pause workflow";
      pauseBtn.setAttribute("aria-label", isPaused ? "Resume workflow" : "Pause workflow");
      pauseBtn.className = "wf-pause-btn" + (isPaused ? " wf-pause-btn--resume" : "");
    }
    saveWorkflows();
    updateWfHealth();
    showToast("\u201C" + wf.name + "\u201D " + (newStatus === "paused" ? "paused" : "resumed"));
  }

  // ─── WORKFLOW EXPAND / DETAIL ────────────────────────────────────────────
  var expandedWfId = null;

  function getWfById(id) {
    for (var i = 0; i < DASHBOARD_DATA.workflows.length; i++) {
      if (DASHBOARD_DATA.workflows[i].id === id) return DASHBOARD_DATA.workflows[i];
    }
    return null;
  }

  function getWfSteps(wf) {
    if (wf.stepsList && wf.stepsList.length) return wf.stepsList;
    var pool = ["Trigger","Filter","Transform","Process","Validate","Notify","Output"];
    var n = Math.min(wf.steps || 3, pool.length);
    return pool.slice(0, n).map(function(l) { return { label: l, s: "done" }; });
  }

  function genStepsList(trigger, stepCount) {
    var first = trigger ? trigger + " trigger" : "Trigger";
    var pool = ["Validate input","Route request","Run agent","Transform data",
                "Enrich record","Filter results","Call API","Update database",
                "Send notification","Archive result"];
    var n = Math.max(2, stepCount || 3);
    var steps = [{ label: first, s: "done" }];
    for (var i = 1; i < n - 1 && pool.length; i++) steps.push({ label: pool.shift(), s: "done" });
    steps.push({ label: "Output", s: "done" });
    return steps;
  }

  function buildStepsPipeline(steps) {
    return steps.map(function(s, i) {
      var node = "<span class=\"wf-step-node wf-step-node--" + (s.s || "done") + "\">" +
        "<span class=\"wf-step-node__dot\"></span>" +
        "<span class=\"wf-step-node__label\">" + esc(s.label) + "</span>" +
        "</span>";
      if (i < steps.length - 1) node += "<span class=\"wf-step-arrow\" aria-hidden=\"true\">›</span>";
      return node;
    }).join("");
  }

  function buildDetailSteps(steps) {
    return steps.map(function(s, i) {
      return "<div class=\"wf-detail-step-row wf-detail-step--" + (s.s || "done") + "\">" +
        "<span class=\"wf-detail-step-row__num\">" + (i + 1) + "</span>" +
        "<span class=\"wf-detail-step-row__dot\"></span>" +
        "<span class=\"wf-detail-step-row__name\">" + esc(s.label) + "</span>" +
        "</div>";
    }).join("");
  }

  function showWfDetail(wfId) {
    var panel = document.querySelector("[data-wf-detail-panel]");
    if (!panel) return;
    var wf = getWfById(wfId);
    if (!wf) { clearWfDetail(); return; }
    var triggersView = panel.querySelector("[data-wf-triggers-view]");
    var detailView   = panel.querySelector("[data-wf-detail-view]");
    if (!triggersView || !detailView) return;
    triggersView.hidden = true;
    detailView.hidden   = false;
    var nameEl = panel.querySelector("[data-wf-detail-name]");
    if (nameEl) nameEl.textContent = wf.name;
    var stepsEl = panel.querySelector("[data-wf-detail-steps]");
    if (stepsEl) stepsEl.innerHTML = buildDetailSteps(getWfSteps(wf));
    var metaEl = panel.querySelector("[data-wf-detail-meta]");
    if (metaEl) {
      var sc = WF_SC[wf.status] || "wf-status--paused";
      var sl = WF_SL[wf.status] || wf.status;
      metaEl.innerHTML =
        "<div class=\"wf-detail-meta__row\"><span>Status</span><span class=\"wf-status " + sc + "\">" + sl + "</span></div>" +
        "<div class=\"wf-detail-meta__row\"><span>Trigger</span><span>" + esc(wf.trigger) + "</span></div>" +
        "<div class=\"wf-detail-meta__row\"><span>Last run</span><span>" + timeAgo(wf.lastRunTs || Date.now()) + "</span></div>";
    }
  }

  function clearWfDetail() {
    var panel = document.querySelector("[data-wf-detail-panel]");
    if (!panel) return;
    var triggersView = panel.querySelector("[data-wf-triggers-view]");
    var detailView   = panel.querySelector("[data-wf-detail-view]");
    if (triggersView) triggersView.hidden = false;
    if (detailView)   detailView.hidden   = true;
  }

  function collapseAllExpands() {
    document.querySelectorAll(".wf-expand-row").forEach(function(exp) {
      if (exp.parentNode) exp.parentNode.removeChild(exp);
    });
    document.querySelectorAll("tr.wf-row--expanded").forEach(function(r) {
      r.classList.remove("wf-row--expanded");
    });
  }

  function toggleWfExpand(tr) {
    if (tr.classList.contains("wf-expand-row")) return;
    var id = tr.getAttribute("data-wf-id");
    if (!id) return;
    var alreadyOpen = (id === expandedWfId);
    collapseAllExpands();
    clearWfDetail();
    expandedWfId = null;
    if (alreadyOpen) return; // second click collapses
    var wf = getWfById(id);
    if (!wf) return;
    tr.classList.add("wf-row--expanded");
    expandedWfId = id;
    var expandTr = document.createElement("tr");
    expandTr.className = "wf-expand-row";
    expandTr.innerHTML =
      "<td colspan=\"6\"><div class=\"wf-expand-inner\">" +
      "<span class=\"wf-expand-label\">Steps pipeline</span>" +
      "<div class=\"wf-steps-pipeline\">" + buildStepsPipeline(getWfSteps(wf)) + "</div>" +
      "</div></td>";
    tr.parentNode.insertBefore(expandTr, tr.nextSibling);
    showWfDetail(id);
  }

  function wfDeleteRow(tr, wfName) {
    var id = tr.getAttribute("data-wf-id");
    // Remove expand row immediately if open
    var next = tr.nextElementSibling;
    if (next && next.classList.contains("wf-expand-row") && next.parentNode) {
      next.parentNode.removeChild(next);
    }
    tr.classList.add("wf-row--exit");
    setTimeout(function () {
      if (tr.parentNode) tr.parentNode.removeChild(tr);
      if (id) {
        DASHBOARD_DATA.workflows = DASHBOARD_DATA.workflows.filter(function (w) { return w.id !== id; });
        saveWorkflows();
        updateWfHealth();
      }
    }, 360);
    showToast("\u201C" + wfName + "\u201D removed");
  }

  function renderWorkflowsPage() {
    var tbody = document.querySelector("[data-wf-tbody]");
    if (!tbody) return;

    tbody.innerHTML = DASHBOARD_DATA.workflows.map(function (wf) {
      var sc = WF_SC[wf.status] || "wf-status--paused";
      var sl = WF_SL[wf.status] || wf.status;
      return (
        "<tr data-wf-id=\"" + esc(wf.id) + "\">" +
          "<td>" + esc(wf.name) + "</td>" +
          "<td><span class=\"wf-status " + sc + "\">" + sl + "</span></td>" +
          "<td><span class=\"wf-trigger\">" + esc(wf.trigger) + "</span></td>" +
          "<td><span class=\"wf-steps\">" + wf.steps + "</span></td>" +
          "<td style=\"color:var(--text-muted)\" data-wf-lastrun=\"" + (wf.lastRunTs || Date.now()) + "\">" + timeAgo(wf.lastRunTs || Date.now()) + "</td>" +
          "<td class=\"wf-actions-cell\">" + wfPauseBtn(wf.status) + "<button class=\"wf-delete-btn\" data-wf-delete title=\"Delete workflow\" aria-label=\"Delete workflow\">" + WF_TRASH_ICON + "</button></td>" +
        "</tr>"
      );
    }).join("");
    updateWfHealth();
  }

  // ─── LIVE SIMULATION ─────────────────────────────────────────────────────────

  // ─── UPTIME live value ────────────────────────────────────────────────────
  var liveUptime = 99.97;

  var liveRunStats = { runs: 47, successRate: 94.7, dur: 2.3, monthly: 1284, lastExecMs: Date.now() - 120000 };

  function updateRunStats() {
    // Tiny organic fluctuations
    if (Math.random() < 0.5) liveRunStats.runs += Math.floor(Math.random() * 2) + 1;
    liveRunStats.successRate = Math.max(90, Math.min(99.2,
      liveRunStats.successRate + (Math.random() - 0.5) * 0.25));
    liveRunStats.dur = Math.max(1.4, Math.min(4.2,
      liveRunStats.dur + (Math.random() - 0.5) * 0.08));
    if (Math.random() < 0.35) liveRunStats.monthly += 1;
    if (Math.random() < 0.25) liveRunStats.lastExecMs = Date.now();

    // Error count is always real
    var errorCount = DASHBOARD_DATA.workflows.filter(function (w) { return w.status === "error"; }).length;

    var runsEl    = document.querySelector("[data-rr-wf-runs]");
    var successEl = document.querySelector("[data-rr-wf-success]");
    var failedEl  = document.querySelector("[data-rr-wf-failed]");
    var durEl     = document.querySelector("[data-rr-wf-dur]");
    var monthlyEl = document.querySelector("[data-rr-wf-monthly]");
    var lastExEl  = document.querySelector("[data-rr-wf-last-exec]");

    if (runsEl)    runsEl.textContent    = liveRunStats.runs.toLocaleString();
    if (successEl) successEl.textContent = liveRunStats.successRate.toFixed(1) + "%";
    if (failedEl)  failedEl.textContent  = errorCount;
    if (durEl)     durEl.textContent     = liveRunStats.dur.toFixed(1) + " s";
    if (monthlyEl) monthlyEl.textContent = liveRunStats.monthly.toLocaleString();
    if (lastExEl) {
      var secAgo = Math.floor((Date.now() - liveRunStats.lastExecMs) / 1000);
      lastExEl.textContent = "Last execution " + (secAgo < 60 ? "just now" : Math.floor(secAgo / 60) + " min ago");
    }
  }

  function updateUptimeDisplay() {
    var el = document.querySelector("[data-rr-uptime]");
    if (!el) return;
    // Tiny fluctuation ±0.01% staying in 99.88–99.99 range
    liveUptime += (Math.random() - 0.5) * 0.02;
    liveUptime = Math.max(99.88, Math.min(99.99, liveUptime));
    el.textContent = liveUptime.toFixed(2) + "%";
  }

  // ─── WORKFLOW HEALTH update ───────────────────────────────────────────────
  function updateWfHealth() {
    var counts = { active: 0, paused: 0, error: 0 };
    DASHBOARD_DATA.workflows.forEach(function (w) {
      if (w.status === "active" || w.status === "running") counts.active++;
      else if (w.status === "paused") counts.paused++;
      else if (w.status === "error") counts.error++;
    });
    var aEl = document.querySelector("[data-rr-wf-active]");
    var pEl = document.querySelector("[data-rr-wf-paused]");
    var eEl = document.querySelector("[data-rr-wf-error]");
    var tEl = document.querySelector("[data-rr-wf-total]");
    if (aEl) aEl.textContent = counts.active;
    if (pEl) pEl.textContent = counts.paused;
    if (eEl) eEl.textContent = counts.error;
    if (tEl) tEl.textContent = DASHBOARD_DATA.workflows.length;
    // Keep Run stats "Failed" in sync immediately
    var failedEl = document.querySelector("[data-rr-wf-failed]");
    if (failedEl) failedEl.textContent = counts.error;
  }

  function tickStats() {
    if (!statsEl) return;

    // Tasks always creep upward (+1 to +5)
    liveValues.tasks += Math.floor(Math.random() * 5) + 1;

    // Perf fluctuates ±4ms, biased slightly upward on degraded runs
    var perfDelta = Math.round((Math.random() - 0.46) * 8);
    liveValues.perf = Math.max(112, Math.min(192, liveValues.perf + perfDelta));

    var tasksEl = statsEl.querySelector("[data-live-stat=\"tasks\"]");
    var perfEl  = statsEl.querySelector("[data-live-stat=\"perf\"]");
    if (tasksEl) animateCount(tasksEl, liveValues.tasks, 750);
    if (perfEl)  animateCount(perfEl,  liveValues.perf,  750);

    updateUptimeDisplay();
    updateRunStats();
  }

  function tickActivity() {
    if (!activityEl) return;

    // Pick a random event, avoid repeating the most recent one
    var firstText = activityEl.firstChild
      ? activityEl.firstChild.querySelector(".activity-item__text")
      : null;
    var lastText = firstText ? firstText.textContent : "";
    var candidates = LIVE_EVENT_POOL.filter(function (e) {
      return (e.headline + " " + e.text) !== lastText;
    });
    var evt = candidates[Math.floor(Math.random() * candidates.length)];

    var li = document.createElement("li");
    li.className = "activity-item activity-item--live";
    li.innerHTML =
      "<span class=\"activity-item__dot activity-item__dot--" + evt.dot + "\"></span>" +
      "<div class=\"activity-item__content\">" +
        "<p class=\"activity-item__text\"><strong>" + esc(evt.headline) + "</strong> " + esc(evt.text) + "</p>" +
        "<time class=\"activity-item__time\">just now</time>" +
      "</div>";

    activityEl.insertBefore(li, activityEl.firstChild);

    // Fade + slide out the last item, then remove it
    var items = activityEl.querySelectorAll(".activity-item");
    if (items.length > 8) {
      var old = items[items.length - 1];
      old.classList.add("activity-item--exit");
      setTimeout(function () {
        if (old.parentNode === activityEl) activityEl.removeChild(old);
      }, 380);
    }
  }

  function scheduleStatsTick() {
    setTimeout(function () {
      tickStats();
      scheduleStatsTick();
    }, 6000 + Math.floor(Math.random() * 4000)); // 6–10 s
  }

  function scheduleActivityTick() {
    setTimeout(function () {
      tickActivity();
      scheduleActivityTick();
    }, 9000 + Math.floor(Math.random() * 6000)); // 9–15 s
  }

  function tickWorkflowTimes() {
    document.querySelectorAll("[data-wf-lastrun]").forEach(function (td) {
      var ts = parseInt(td.getAttribute("data-wf-lastrun"), 10);
      if (!isNaN(ts)) td.textContent = timeAgo(ts);
    });
  }

  function startSimulation() {
    var pd = DASHBOARD_DATA.analytics[currentPeriod] || DASHBOARD_DATA.analytics["14d"];
    liveValues.tasks = pd.tasks.value;
    liveValues.perf  = pd.perf.value;
    setTimeout(scheduleStatsTick,   3000);
    setTimeout(scheduleActivityTick, 7000);
    // Update workflow "last run" timestamps every 30 seconds
    setInterval(tickWorkflowTimes, 30000);
    setInterval(tickAgentDetailLive, 2800);
  }

  // ─── EVENT LISTENERS ─────────────────────────────────────────────────────────

  if (toggle && app) {
    toggle.addEventListener("click", function () { setSidebarOpen(!app.classList.contains("sidebar-open")); });
  }

  if (backdrop) {
    backdrop.addEventListener("click", function () { setSidebarOpen(false); });
  }

  window.addEventListener("resize", function () {
    if (!isMobile()) setSidebarOpen(false);
    positionToast();
    if (settingsViewEl && !settingsViewEl.hidden) pinSettingsAside();
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var id = link.getAttribute("data-nav");
      if (id) switchView(id);
    });
  });

  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      withLoading(exportBtn, "Exporting\u2026", 360, function () {
        showToast("Export ready");
      });
    });
  }

  if (workflowBtn) {
    workflowBtn.addEventListener("click", function () {
      switchView("workflows");
    });
  }

  // ─── WORKFLOW MODAL ──────────────────────────────────────────────────────────

  var wfModal        = document.querySelector("[data-wf-modal]");
  var wfModalForm    = document.querySelector("[data-wf-form]");
  var wfInputName    = document.querySelector("[data-wf-input-name]");
  var wfInputTrig    = document.querySelector("[data-wf-input-trigger]");
  var wfNameError    = document.querySelector("[data-wf-name-error]");
  var wfTrigError    = document.querySelector("[data-wf-trigger-error]");
  var wfSubmitBtn    = document.querySelector("[data-wf-submit]");

  function openWfModal() {
    if (!wfModal) return;
    wfModal.hidden = false;
    requestAnimationFrame(function () { wfModal.classList.add("is-open"); });
    if (wfInputName) { wfInputName.value = ""; wfInputName.classList.remove("modal-form__input--error"); }
    if (wfInputTrig) {
      wfInputTrig.selectedIndex = 0;
      wfInputTrig.classList.remove("modal-form__input--error");
      wfInputTrig.classList.add("modal-form__select--empty");
    }
    if (wfNameError) wfNameError.hidden = true;
    if (wfTrigError) wfTrigError.hidden = true;
    setTimeout(function () { if (wfInputName) wfInputName.focus(); }, 50);
  }

  function closeWfModal() {
    if (!wfModal) return;
    wfModal.classList.remove("is-open");
    wfModal.classList.add("is-closing");
    setTimeout(function () {
      wfModal.hidden = true;
      wfModal.classList.remove("is-closing");
    }, 300);
  }

  function addWfRow(name, trigger) {
    var tbody = document.querySelector("[data-wf-tbody]");
    if (!tbody) return;
    var steps     = Math.floor(Math.random() * 4) + 3; // 3–6
    var newId     = "wf-new-" + (++wfTemplateIdx);
    var trigLabel = trigger || "Manual";
    var stepsList = genStepsList(trigLabel, steps);
    var tr = document.createElement("tr");
    tr.className = "wf-row--new";
    tr.setAttribute("data-wf-id", newId);
    // Start in "Running…" state — no pause button yet
    tr.innerHTML =
      "<td>" + esc(name) + "</td>" +
      "<td><span class=\"wf-status wf-status--running\">Running\u2026</span></td>" +
      "<td><span class=\"wf-trigger\">" + esc(trigLabel) + "</span></td>" +
      "<td><span class=\"wf-steps\">" + steps + "</span></td>" +
      "<td style=\"color:var(--text-muted)\" data-wf-lastrun=\"" + Date.now() + "\">just now</td>" +
      "<td class=\"wf-actions-cell\"><button class=\"wf-delete-btn\" data-wf-delete title=\"Delete workflow\" aria-label=\"Delete workflow\">" + WF_TRASH_ICON + "</button></td>";
    tbody.insertBefore(tr, tbody.firstChild);
    DASHBOARD_DATA.workflows.unshift({ id: newId, name: name, status: "running", lastRun: "just now", lastRunTs: Date.now(), trigger: trigLabel, steps: steps, stepsList: stepsList });
    updateWfHealth();
    // Simulate execution: after 1.5 s → Active
    setTimeout(function () {
      var wf = getWfById(newId);
      if (wf) wf.status = "active";
      var badge = tr.querySelector(".wf-status");
      if (badge) { badge.className = "wf-status wf-status--active"; badge.textContent = "Active"; }
      var cell = tr.querySelector(".wf-actions-cell");
      if (cell) cell.innerHTML = wfPauseBtn("active") + "<button class=\"wf-delete-btn\" data-wf-delete title=\"Delete workflow\" aria-label=\"Delete workflow\">" + WF_TRASH_ICON + "</button>";
      saveWorkflows();
      updateWfHealth();
    }, 1500);
  }

  // Open modal when "New workflow" button is clicked
  var wfNewBtn = document.querySelector("[data-wf-new]");
  if (wfNewBtn) wfNewBtn.addEventListener("click", openWfModal);

  // Close buttons
  document.querySelectorAll("[data-wf-modal-close]").forEach(function (btn) {
    btn.addEventListener("click", closeWfModal);
  });

  // Submit
  if (wfModalForm) {
    wfModalForm.addEventListener("submit", function (e) { e.preventDefault(); });
  }

  if (wfSubmitBtn) {
    wfSubmitBtn.addEventListener("click", function () {
      var name    = wfInputName ? wfInputName.value.trim() : "";
      var trigger = wfInputTrig ? wfInputTrig.value : "";
      var valid   = true;

      if (!name) {
        if (wfInputName) wfInputName.classList.add("modal-form__input--error");
        if (wfNameError) wfNameError.hidden = false;
        valid = false;
      }
      if (!trigger) {
        if (wfInputTrig) wfInputTrig.classList.add("modal-form__input--error");
        if (wfTrigError) wfTrigError.hidden = false;
        valid = false;
      }
      if (!valid) {
        if (!name && wfInputName) wfInputName.focus();
        else if (!trigger && wfInputTrig) wfInputTrig.focus();
        return;
      }

      withLoading(wfSubmitBtn, "Creating\u2026", 320, function () {
        addWfRow(name, trigger);
        closeWfModal();
        showToast("\u201C" + name + "\u201D created");
      });
    });
  }

  // Clear error states as user fills in fields
  if (wfInputName) {
    wfInputName.addEventListener("input", function () {
      wfInputName.classList.remove("modal-form__input--error");
      if (wfNameError) wfNameError.hidden = true;
    });
  }
  if (wfInputTrig) {
    wfInputTrig.addEventListener("change", function () {
      wfInputTrig.classList.remove("modal-form__input--error");
      wfInputTrig.classList.toggle("modal-form__select--empty", !wfInputTrig.value);
      if (wfTrigError) wfTrigError.hidden = true;
    });
  }

  // Close on backdrop click (outside dialog)
  if (wfModal) {
    wfModal.addEventListener("click", function (e) {
      if (e.target === wfModal) closeWfModal();
    });
  }

  // Close on ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && wfModal && wfModal.classList.contains("is-open")) closeWfModal();
  });

  // Delete workflow — event delegation on tbody (works for both initial and new rows)
  var wfTbody = document.querySelector("[data-wf-tbody]");
  if (wfTbody) {
    wfTbody.addEventListener("click", function (e) {
      // Delete button
      var delBtn = e.target.closest("[data-wf-delete]");
      if (delBtn && !delBtn.disabled) {
        var tr = delBtn.closest("tr");
        if (!tr) return;
        var wfName = tr.cells[0] ? tr.cells[0].textContent.trim() : "Workflow";
        delBtn.disabled = true;
        delBtn.classList.add("wf-delete-btn--busy");
        setTimeout(function () { wfDeleteRow(tr, wfName); }, 260);
        return;
      }
      // Pause button
      var pauseBtn = e.target.closest("[data-wf-pause]");
      if (pauseBtn && !pauseBtn.disabled) {
        var trP = pauseBtn.closest("tr");
        if (trP) wfTogglePause(trP);
        return;
      }
    });
  }

  var settingsSaveBtn    = document.querySelector("[data-settings-save]");
  var settingsNameInput  = document.querySelector("[data-settings-name]");
  var settingsEmailInput = document.querySelector("[data-settings-email]");
  var settingsTzSelect   = document.querySelector("[data-settings-tz]");
  var sidebarName        = document.querySelector("[data-sidebar-name]");
  var sidebarEmail       = document.querySelector("[data-sidebar-email]");
  var sidebarAvatar      = document.querySelector("[data-sidebar-avatar]");
  var settingsAvatar     = document.querySelector("[data-settings-avatar]");

  function applyProfileToSidebar() {
    var name    = settingsNameInput ? settingsNameInput.value.trim() : "";
    var initial = (name.charAt(0) || "?").toUpperCase();
    if (name  && sidebarName)   sidebarName.textContent   = name;
    if (sidebarAvatar)  sidebarAvatar.textContent  = initial;
    if (settingsAvatar) settingsAvatar.textContent = initial;
    // Sync team panel owner name (keep the "you" badge)
    var teamOwnerEl = document.querySelector("[data-team-owner-name]");
    if (teamOwnerEl && name) {
      teamOwnerEl.textContent = "";
      teamOwnerEl.appendChild(document.createTextNode(name + " "));
      var youBadge = document.createElement("span");
      youBadge.className = "team-member__you";
      youBadge.textContent = "you";
      teamOwnerEl.appendChild(youBadge);
    }
    // Sync team avatar initial
    var teamOwnerAvatar = teamOwnerEl ? teamOwnerEl.closest(".team-member").querySelector(".team-member__avatar") : null;
    if (teamOwnerAvatar && initial) teamOwnerAvatar.textContent = initial;
    try {
      localStorage.setItem("nf_profile", JSON.stringify({
        name: name,
        tz: settingsTzSelect ? settingsTzSelect.value : ""
      }));
    } catch (e) {}
  }

  // Restore saved profile on load
  try {
    var savedProfile = JSON.parse(localStorage.getItem("nf_profile") || "null");
    if (savedProfile) {
      if (settingsNameInput && savedProfile.name) settingsNameInput.value = savedProfile.name;
      if (settingsTzSelect  && savedProfile.tz)  settingsTzSelect.value  = savedProfile.tz;
      applyProfileToSidebar();
    }
  } catch (e) {}

  if (settingsSaveBtn) {
    settingsSaveBtn.addEventListener("click", function () {
      withLoading(settingsSaveBtn, "Saving\u2026", 340, function () {
        applyProfileToSidebar();
        // Flash success state on editable inputs
        var editableInputs = document.querySelectorAll(
          "[data-settings-name], [data-settings-tz]"
        );
        editableInputs.forEach(function (el) {
          el.classList.add("settings-input--success");
          setTimeout(function () { el.classList.remove("settings-input--success"); }, 2200);
        });
        showToast("\u2713 Settings saved successfully");
      });
    });
  }

  var settingsNewKeyBtn = document.querySelector("[data-settings-newkey]");
  if (settingsNewKeyBtn) {
    settingsNewKeyBtn.addEventListener("click", function () {
      withLoading(settingsNewKeyBtn, "Generating\u2026", 480, function () {
        showToast("New API key created — copy it now, it won\u2019t be shown again");
      });
    });
  }

  document.querySelectorAll("[data-copy-key]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      withLoading(btn, "Copying\u2026", 200, function () {
        showToast("Key copied to clipboard");
      });
    });
  });

  function genApiKey(prefix) {
    var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    var raw = "";
    for (var i = 0; i < 20; i++) raw += chars[Math.floor(Math.random() * chars.length)];
    return { full: prefix + raw, masked: prefix + "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" + raw.slice(-4) };
  }

  document.querySelectorAll("[data-regen-key]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var keyName  = btn.getAttribute("data-key-name") || "Key";
      var hintAttr = btn.getAttribute("data-key-hint");
      var row      = btn.closest(".api-key-row");
      var keyEl    = row ? row.querySelector(".api-key-row__value") : null;
      withLoading(btn, "Regenerating\u2026", 680, function () {
        var prefix  = keyName.toLowerCase().includes("prod") ? "pk_live_" : "sk_test_";
        var newKey  = genApiKey(prefix);
        if (keyEl) {
          // Show full key for 5s, then auto-mask
          keyEl.textContent = newKey.full;
          keyEl.classList.add("api-key--regenerated");
          setTimeout(function () {
            keyEl.textContent = newKey.masked;
            keyEl.classList.remove("api-key--regenerated");
          }, 5000);
        }
        if (hintAttr) {
          var hintEl = document.querySelector("[" + hintAttr + "]");
          if (hintEl) hintEl.textContent = "Regenerated just now \u00b7 old key is now invalid";
        }
        showToast("\u26a0\ufe0f " + keyName + " regenerated \u2014 copy it now, it will be masked in 5 s");
      });
    });
  });

  document.querySelectorAll("[data-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var on = btn.classList.toggle("toggle-track--on");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      if (btn.hasAttribute("data-toggle-2fa")) {
        if (on) {
          showToast("\uD83D\uDD12 Verification required \u2014 check your authenticator app");
        } else {
          showToast("\u26a0\ufe0f 2FA disabled \u2014 your account is less secure");
        }
      }
    });
  });

  // Danger zone
  var dangerResetBtn  = document.querySelector("[data-danger-reset]");
  var dangerDeleteBtn = document.querySelector("[data-danger-delete]");
  if (dangerResetBtn) {
    dangerResetBtn.addEventListener("click", function () {
      withLoading(dangerResetBtn, "Resetting\u2026", 600, function () {
        showToast("\u26a0\ufe0f Reset blocked \u2014 confirm via email before this action runs");
      });
    });
  }
  if (dangerDeleteBtn) {
    dangerDeleteBtn.addEventListener("click", function () {
      withLoading(dangerDeleteBtn, "Deleting\u2026", 400, function () {
        showToast("\uD83D\uDEAB Deletion requires owner confirmation \u2014 check your inbox");
      });
    });
  }

  // Invite button
  var inviteBtn = document.querySelector("[data-invite-btn]");
  if (inviteBtn) {
    inviteBtn.addEventListener("click", function () {
      withLoading(inviteBtn, "Opening\u2026", 260, function () {
        showToast("Invite link copied \u2014 share it with your teammate");
      });
    });
  }

  function updateIntConnectedCount() {
    var countEl = document.querySelector("#view-integrations .int-stat__val[data-int-connected]");
    if (!countEl) return;
    var n = document.querySelectorAll(".integration-status--connected").length;
    countEl.textContent = n;
    countEl.style.color = n > 0 ? "#4ade80" : "var(--text)";
  }

  var intGrid = document.querySelector(".integrations-grid");
  if (intGrid) {
    intGrid.addEventListener("click", function (e) {
      var card = e.target.closest(".integration-card");
      if (!card) return;

      var manageBtn     = e.target.closest("[data-int-manage]");
      var connectBtn    = e.target.closest("[data-int-connect]");
      var disconnectBtn = e.target.closest("[data-int-disconnect]");

      if (manageBtn) {
        withLoading(manageBtn, "Opening\u2026", 200, function () {
          showToast("Opening settings\u2026");
        });

      } else if (connectBtn) {
        withLoading(connectBtn, "Connecting\u2026", 560, function () {
          var badge = card.querySelector(".integration-status");
          if (badge) {
            badge.textContent = "Connected";
            badge.className = "integration-status integration-status--connected";
          }
          var actions = card.querySelector(".integration-card__actions");
          if (actions) {
            actions.innerHTML =
              "<button type=\"button\" class=\"btn btn--ghost\" data-int-manage>Manage</button>" +
              "<button type=\"button\" class=\"btn btn--ghost integration-card__disconnect\" data-int-disconnect>Disconnect</button>";
          }
          updateIntConnectedCount();
          showToast("Connected successfully");
        }, true /* skipRestore — actions block is replaced */);

      } else if (disconnectBtn) {
        withLoading(disconnectBtn, "Disconnecting\u2026", 320, function () {
          var badge = card.querySelector(".integration-status");
          if (badge) {
            badge.textContent = "Not connected";
            badge.className = "integration-status integration-status--off";
          }
          var actions = card.querySelector(".integration-card__actions");
          if (actions) {
            actions.innerHTML =
              "<button type=\"button\" class=\"btn btn--ghost\" data-int-connect>Connect</button>";
          }
          updateIntConnectedCount();
          showToast("Disconnected");
        }, true /* skipRestore */);
      }
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-tab");
      if (key === currentPeriod) return;
      tabs.forEach(function (t) {
        t.classList.remove("tab--active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("tab--active");
      tab.setAttribute("aria-selected", "true");
      currentPeriod = key;
      renderChart(key, false);
      renderStats(key, true);
    });
  });

  // ─── INIT ────────────────────────────────────────────────────────────────────

  viewPanels.forEach(function (panel) {
    panel.setAttribute("aria-hidden", panel.hidden ? "true" : "false");
  });

  renderStats("14d", false);
  renderAgents();
  renderActivity();
  renderChart("14d", true);
  startSimulation();

  // Restore last visited page (after core renders so panels are ready)
  var savedView = loadView();
  if (savedView && savedView !== "dashboard") {
    switchView(savedView);
  }
})();
