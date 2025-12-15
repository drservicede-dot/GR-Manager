// =========================
// BOOT / SPLASH
// =========================
setTimeout(() => {
  const splash = document.getElementById("splash");
  const app = document.getElementById("app");
  if (splash) splash.style.display = "none";
  if (app) app.style.display = "block";
}, 900);

// =========================
// HELPERS
const $ = (id) => document.getElementById(id);

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);

const nnum = (v) => {
  const x = parseFloat(v ?? "0");
  return Number.isFinite(x) && x > 0 ? x : 0;
};

const money = (n) => `${(Number(n) || 0).toFixed(2)} €`;

function uid() {
  return Date.now() + Math.floor(Math.random() * 100000);
}

// =========================
// STORAGE
// =========================
const KEY = "gr_manager_v2_stairwell";

function loadDB() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { clients: [], objects: [], offers: [] };
    const db = JSON.parse(raw);
    return {
      clients: Array.isArray(db.clients) ? db.clients : [],
      objects: Array.isArray(db.objects) ? db.objects : [],
      offers: Array.isArray(db.offers) ? db.offers : [],
    };
  } catch {
    return { clients: [], objects: [], offers: [] };
  }
}

function saveDB(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

let db = loadDB();

// =========================
// I18N
// =========================
const dict = {
  pl: {
    app_title: "GR Manager",
    app_subtitle: "Offline manager",
    btn_backup: "Backup",
    btn_restore: "Restore",
    nav_calc: "Kalkulator",
    nav_clients: "Klienci",
    nav_objects: "Obiekty",
    nav_offers: "Oferty",

    calc_title: "Kalkulator",
    pill_mode: "Netto • Offline",
    calc_section_select: "Wybór",
    calc_section_area: "Powierzchnia",
    calc_section_zones: "Strefy",

    label_client: "Klient",
    label_object: "Obiekt",
    label_type: "Typ obiektu",
    label_freq: "Częstotliwość",

    type_office: "Biuro",
    type_fitness: "Fitness / Siłownia",
    type_stairwell: "Klatka schodowa",

    freq_once: "Jednorazowo",
    freq_weekly: "1× tygodniowo",
    freq_2w: "2× tygodniowo",
    freq_3w: "3× tygodniowo",
    freq_biweekly: "Co 2 tygodnie",
    freq_daily: "Codziennie",

    toggle_intensive: "Intensywnie",
    toggle_night: "Noc / weekend",

    label_main_area: "Sala główna (m²)",
    label_extra_area: "Dodatkowe sale",
    zone_wc: "WC",
    zone_showers: "Prysznice",
    zone_lockers: "Szatnie",
    zone_sauna: "Sauna",
    zone_relax: "Relaks",
    zone_kitchen: "Kuchnia",

    calc_note:
      "Wycena jest orientacyjna. Po oględzinach możesz ją skorygować.",

    stair_title: "Klatka schodowa",
    stair_floors: "Liczba pięter",
    stair_entrances: "Ilość klatek / wejść",
    stair_base_note:
      "Bazowo liczymy: 15 min na piętro + 15 min narzut (na 1 klatkę).",
    stair_addons_title: "Prace dodatkowe",
    stair_addons_hint:
      "Ustaw częstotliwość – program przeliczy udział miesięczny.",
    stair_monthly_note:
      "Cena miesięczna = (cena za sprzątanie × ilość sprzątań w miesiącu) + prace dodatkowe przeliczone na miesiąc.",

    freq_monthly: "1× w mies.",
    freq_quarterly: "Co 3 mies.",
    freq_yearly: "1× w roku",
    freq_perclean: "Przy każdym sprzątaniu",
    yes: "Tak",
    no: "Nie",

    addon_windows: "Mycie okien klatki",
    addon_windows_sub: "3–5 € / okno (ustawione 4 €)",
    addon_doors: "Mycie drzwi wejściowych",
    addon_doors_sub: "5–8 € / szt. (ustawione 6 €)",
    addon_handrails: "Dokładne poręcze",
    addon_handrails_sub: "5–10 € / piętro (ustawione 8 €)",
    addon_walls: "Lamperia / ściany",
    addon_walls_sub: "2–4 € / mb (ustawione 3 €)",
    addon_mailboxes: "Skrzynki pocztowe",
    addon_mailboxes_sub: "1–2 € / szt. (ustawione 1.5 €)",
    addon_basement: "Piwnica",
    addon_basement_sub: "25–40 € (ustawione 32 €)",
    addon_attic: "Strych",
    addon_attic_sub: "25–40 € (ustawione 32 €)",
    addon_garage_small: "Garaż (mały)",
    addon_garage_small_sub: "40–60 € (ustawione 50 €)",
    addon_garage_large: "Garaż (duży)",
    addon_garage_large_sub: "60–120 € (ustawione 90 €)",

    summary_title: "Podsumowanie",
    summary_sub: "Live",
    sum_time: "Czas",
    bill_time: "Godz.",
    rate: "Stawka",
    supplies: "Środki",
    price_visit: "Cena za sprzątanie (netto)",
    price_month: "Cena miesięczna (netto)",

    btn_save_offer: "Zapisz ofertę",
    btn_export_pdf: "PDF",
    btn_reset: "Reset",
    calc_hint:
      "Stawka dobiera się automatycznie (34–40 €/h) zależnie od czasu rozliczeniowego.",
    notes_title: "Notatki",

    clients_title: "Klienci",
    clients_list_title: "Lista",
    client_form_title: "Dane klienta",
    clients_hint: "Kliknij klienta, żeby edytować.",
    btn_new_client: "+ Nowy",
    btn_new_object: "+ Obiekt",
    btn_save: "Zapisz",
    btn_delete: "Usuń",
    th_name: "Nazwa",
    th_contact: "Kontakt",
    th_phone: "Telefon",
    th_status: "Status",
    label_client_name: "Nazwa",
    label_client_contact: "Osoba kontaktowa",
    label_client_phone: "Telefon",
    label_client_email: "E-mail",
    label_client_address: "Adres",
    label_notes: "Notatki",

    objects_title: "Obiekty",
    objects_list_title: "Lista",
    object_form_title: "Dane obiektu",
    objects_hint: "Kliknij obiekt, żeby edytować.",
    btn_new_object_top: "+ Nowy",
    th_obj_name: "Nazwa",
    th_obj_type: "Typ",
    th_obj_client: "Klient",
    label_object_name: "Nazwa obiektu",
    label_object_address: "Adres obiektu",
    object_saved_params: "Parametry (opcjonalnie)",
    object_stair_params: "Parametry klatki",
    object_zones_title: "Strefy (stałe)",
    btn_open_calc: "Otwórz w kalkulatorze",

    offers_title: "Oferty",
    offers_list_title: "Lista",
    offers_details_title: "Szczegóły",
    offers_hint: "Kliknij ofertę, żeby zobaczyć szczegóły.",
    offers_pdf_hint: "PDF zawiera logo DR-Service (tylko w wydruku).",
    btn_duplicate: "Duplikuj",
    d_date: "Data",
    d_status: "Status",
    d_client: "Klient",
    d_object: "Obiekt",
    d_type: "Typ",
    d_hours: "Godz.",
    d_rate: "Stawka",
    d_supplies: "Środki",
    d_price_visit: "Cena za sprzątanie",
    d_price_month: "Cena miesięczna",
    d_notes: "Notatki",

    status_draft: "Szkic",
    status_sent: "Wysłana",
    status_accepted: "Zaakceptowana",
    status_rejected: "Odrzucona",

    msg_saved: "Zapisano",
    msg_deleted: "Usunięto",
    msg_need_client: "Uzupełnij nazwę klienta",
    msg_need_object: "Wybierz klienta i nazwę obiektu",
    msg_need_calc: "Wpisz dane do wyceny (minuty > 0)",
    msg_confirm_delete: "Na pewno usunąć?",
    msg_popup_blocked: "Zablokowane okno popup.",
    msg_copied_clipboard: "Skopiowano do schowka.",
    msg_restored: "Przywrócono.",
    msg_invalid_json: "Niepoprawny JSON.",
    msg_paste_backup: "Wklej backup JSON tutaj:",

    breakdown_base: "{perMonth}×/mc: {base}",
    breakdown_addons: "+ dodatki: {addons}",
  },

  de: {
    app_title: "GR Manager",
    app_subtitle: "Offline Manager",
    btn_backup: "Backup",
    btn_restore: "Restore",
    nav_calc: "Rechner",
    nav_clients: "Kunden",
    nav_objects: "Objekte",
    nav_offers: "Angebote",

    calc_title: "Rechner",
    pill_mode: "Netto • Offline",
    calc_section_select: "Auswahl",
    calc_section_area: "Fläche",
    calc_section_zones: "Zonen",

    label_client: "Kunde",
    label_object: "Objekt",
    label_type: "Objekttyp",
    label_freq: "Frequenz",

    type_office: "Büro",
    type_fitness: "Fitness / Studio",
    type_stairwell: "Treppenhaus",

    freq_once: "Einmalig",
    freq_weekly: "1× pro Woche",
    freq_2w: "2× pro Woche",
    freq_3w: "3× pro Woche",
    freq_biweekly: "Alle 2 Wochen",
    freq_daily: "Täglich",

    toggle_intensive: "Intensiv",
    toggle_night: "Nacht / Wochenende",

    label_main_area: "Hauptraum (m²)",
    label_extra_area: "Zusätzliche Räume",
    zone_wc: "WC",
    zone_showers: "Duschen",
    zone_lockers: "Umkleiden",
    zone_sauna: "Sauna",
    zone_relax: "Relax",
    zone_kitchen: "Küche",

    calc_note:
      "Die Kalkulation ist orientierend. Nach Besichtigung kannst du sie anpassen.",

    stair_title: "Treppenhaus",
    stair_floors: "Anzahl Etagen",
    stair_entrances: "Anzahl Eingänge",
    stair_base_note:
      "Basis: 15 Min pro Etage + 15 Min Zuschlag (pro Eingang).",
    stair_addons_title: "Zusatzarbeiten",
    stair_addons_hint:
      "Frequenz wählen – monatlicher Anteil wird berechnet.",
    stair_monthly_note:
      "Monatspreis = (Preis pro Reinigung × Reinigungen/Monat) + Zusatzarbeiten (monatlich umgerechnet).",

    freq_monthly: "1× / Monat",
    freq_quarterly: "Alle 3 Monate",
    freq_yearly: "1× / Jahr",
    freq_perclean: "Bei jeder Reinigung",
    yes: "Ja",
    no: "Nein",

    addon_windows: "Fenster im Treppenhaus",
    addon_windows_sub: "3–5 € / Fenster (gesetzt 4 €)",
    addon_doors: "Eingangstüren",
    addon_doors_sub: "5–8 € / Stück (gesetzt 6 €)",
    addon_handrails: "Handläufe gründlich",
    addon_handrails_sub: "5–10 € / Etage (gesetzt 8 €)",
    addon_walls: "Wände / Lamperie",
    addon_walls_sub: "2–4 € / lfm (gesetzt 3 €)",
    addon_mailboxes: "Briefkästen",
    addon_mailboxes_sub: "1–2 € / Stück (gesetzt 1.5 €)",
    addon_basement: "Keller",
    addon_basement_sub: "25–40 € (gesetzt 32 €)",
    addon_attic: "Dachboden",
    addon_attic_sub: "25–40 € (gesetzt 32 €)",
    addon_garage_small: "Garage (klein)",
    addon_garage_small_sub: "40–60 € (gesetzt 50 €)",
    addon_garage_large: "Garage (groß)",
    addon_garage_large_sub: "60–120 € (gesetzt 90 €)",

    summary_title: "Zusammenfassung",
    summary_sub: "Live",
    sum_time: "Zeit",
    bill_time: "Std.",
    rate: "Stundensatz",
    supplies: "Reinigungsmittel",
    price_visit: "Preis pro Reinigung (netto)",
    price_month: "Monatspreis (netto)",

    btn_save_offer: "Angebot speichern",
    btn_export_pdf: "PDF",
    btn_reset: "Zurücksetzen",
    calc_hint:
      "Stundensatz wird automatisch gewählt (34–40 €/h) je nach Abrechnungszeit.",
    notes_title: "Notizen",

    clients_title: "Kunden",
    clients_list_title: "Liste",
    client_form_title: "Kundendaten",
    clients_hint: "Klicke einen Kunden zum Bearbeiten.",
    btn_new_client: "+ Neu",
    btn_new_object: "+ Objekt",
    btn_save: "Speichern",
    btn_delete: "Löschen",
    th_name: "Name",
    th_contact: "Kontakt",
    th_phone: "Telefon",
    th_status: "Status",
    label_client_name: "Name",
    label_client_contact: "Ansprechpartner",
    label_client_phone: "Telefon",
    label_client_email: "E-Mail",
    label_client_address: "Adresse",
    label_notes: "Notizen",

    objects_title: "Objekte",
    objects_list_title: "Liste",
    object_form_title: "Objektdaten",
    objects_hint: "Klicke ein Objekt zum Bearbeiten.",
    btn_new_object_top: "+ Neu",
    th_obj_name: "Name",
    th_obj_type: "Typ",
    th_obj_client: "Kunde",
    label_object_name: "Objektname",
    label_object_address: "Objektadresse",
    object_saved_params: "Parameter (optional)",
    object_stair_params: "Treppenhaus-Parameter",
    object_zones_title: "Zonen (fix)",
    btn_open_calc: "Im Rechner öffnen",

    offers_title: "Angebote",
    offers_list_title: "Liste",
    offers_details_title: "Details",
    offers_hint: "Klicke ein Angebot, um Details zu sehen.",
    offers_pdf_hint: "PDF enthält DR-Service Logo (nur im Ausdruck).",
    btn_duplicate: "Duplizieren",
    d_date: "Datum",
    d_status: "Status",
    d_client: "Kunde",
    d_object: "Objekt",
    d_type: "Typ",
    d_hours: "Std.",
    d_rate: "Stundensatz",
    d_supplies: "Reinigungsmittel",
    d_price_visit: "Preis pro Reinigung",
    d_price_month: "Monatspreis",
    d_notes: "Notizen",

    status_draft: "Entwurf",
    status_sent: "Gesendet",
    status_accepted: "Akzeptiert",
    status_rejected: "Abgelehnt",

    msg_saved: "Gespeichert",
    msg_deleted: "Gelöscht",
    msg_need_client: "Kundenname ausfüllen",
    msg_need_object: "Kunde wählen und Objektname ausfüllen",
    msg_need_calc: "Daten eingeben (Minuten > 0)",
    msg_confirm_delete: "Wirklich löschen?",
    msg_popup_blocked: "Popup wurde blockiert.",
    msg_copied_clipboard: "In die Zwischenablage kopiert.",
    msg_restored: "Wiederhergestellt.",
    msg_invalid_json: "Ungültiges JSON.",
    msg_paste_backup: "Backup-JSON hier einfügen:",

    breakdown_base: "{perMonth}×/Monat: {base}",
    breakdown_addons: "+ Zusatzarbeiten: {addons}",
  },
};

let lang = localStorage.getItem("lang") || "pl";

function t(key) {
  return dict[lang]?.[key] ?? key;
}

function fmt(key, vars = {}) {
  let s = dict[lang]?.[key] ?? key;
  Object.keys(vars).forEach((k) => {
    s = s.replaceAll(`{${k}}`, String(vars[k]));
  });
  return s;
}

function applyLang() {
  document.documentElement.lang = lang;
  const lb = $("langBtn");
  if (lb) lb.textContent = lang.toUpperCase();

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const k = node.dataset.i18n;
    const val = dict[lang]?.[k];
    if (val) node.textContent = val;
  });
}

$("langBtn")?.addEventListener("click", () => {
  lang = lang === "pl" ? "de" : "pl";
  localStorage.setItem("lang", lang);
  applyLang();
  renderAll();
});

applyLang();

// =========================
// NAV
// =========================
function goView(id) {
  document.querySelectorAll(".nav").forEach((b) => b.classList.remove("active"));
  document.querySelector(`.nav[data-view="${id}"]`)?.classList.add("active");
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  $(id)?.classList.add("active");

  if (id === "offers") renderOffers();
  if (id === "clients") renderClients();
  if (id === "objects") renderObjects();
  if (id === "calc") renderCalcSelectors();
}

document.querySelectorAll(".nav").forEach((btn) => {
  btn.addEventListener("click", () => goView(btn.dataset.view));
});

// =========================
// CALC - TYPE PANELS
// =========================
function updateTypePanels() {
  const type = $("typeSelect")?.value || "office";
  const pOF = $("panelOfficeFitness");
  const pS = $("panelStairwell");
  if (!pOF || !pS) return;

  if (type === "stairwell") {
    pOF.style.display = "none";
    pS.style.display = "block";
  } else {
    pOF.style.display = "block";
    pS.style.display = "none";
  }
}

// =========================
// FREQUENCY HELPERS
// =========================
function cleansPerMonth(freq) {
  if (freq === "daily") return 20;
  if (freq === "3w") return 12;
  if (freq === "2w") return 8;
  if (freq === "weekly") return 4;
  if (freq === "biweekly") return 2;
  return 1; // once
}

function freqMonthlyFactor(freq) {
  if (freq === "monthly") return 1;
  if (freq === "quarterly") return 1 / 3;
  if (freq === "yearly") return 1 / 12;
  return null; // perclean
}

// =========================
// RATES
// =========================
function roundUpToQuarterHour(hours) {
  return Math.ceil(hours / 0.25) * 0.25;
}

function pickRate(billedHours) {
  if (billedHours < 1.25) return 36;
  if (billedHours < 2.5) return 33;
  if (billedHours < 5) return 31;
  return 30;
}

// =========================
// CALC CORE
// =========================
function typeMinutesPerM2(type) {
  if (type === "fitness") return 0.35;
  return 0.28; // office
}

function calcMinutesOfficeFitness(input) {
  const type = input.type || "office";
  const area = nnum(input.mainArea) + nnum(input.extraArea);

  let minutes = area * typeMinutesPerM2(type);
  minutes += nnum(input.wc) * (type === "fitness" ? 12 : 10);
  minutes += nnum(input.showers) * 10;
  minutes += nnum(input.lockers) * (type === "fitness" ? 18 : 12);
  minutes += nnum(input.sauna) * 20;
  minutes += nnum(input.relax) * 10;
  minutes += nnum(input.kitchen) * 12;

  minutes += 10; // start buffer
  if (input.intensive) minutes *= 1.2;
  if (input.night) minutes *= 1.1;

  return Math.round(Math.max(0, minutes));
}

function calcMinutesStairwell(input) {
  const floors = Math.max(1, Math.round(nnum(input.stairsFloors) || 0));
  const entrances = Math.max(1, Math.round(nnum(input.stairsEntrances) || 0));

  let minutesPerEntrance = floors * 15 + 15;
  let minutes = minutesPerEntrance * entrances;

  if (input.intensive) minutes *= 1.2;
  if (input.night) minutes *= 1.1;

  return Math.round(Math.max(0, minutes));
}

function calcAddonsMonthly(input) {
  const PRICES = {
    windows: 4.0,
    doors: 6.0,
    handrails: 8.0,
    walls: 3.0,
    mailboxes: 1.5,
    basement: 32.0,
    attic: 32.0,
    garageSmall: 50.0,
    garageLarge: 90.0,
  };

  const freq = input.freq || "once";
  const perMonth = cleansPerMonth(freq);
  const items = [];

  function addItem(key, labelKey, amount, unitPrice, chosenFreq) {
    const qty = nnum(amount);
    if (qty <= 0) return;
    const baseCost = qty * unitPrice;

    let monthly = 0;
    if (chosenFreq === "perclean") {
      monthly = baseCost * perMonth;
    } else {
      const f = freqMonthlyFactor(chosenFreq);
      if (f) monthly = baseCost * f;
    }

    items.push({
      key,
      labelKey,
      qty,
      unitPrice,
      freq: chosenFreq,
      baseCost,
      monthly,
    });
  }

  addItem("windows", "addon_windows", input.addonWindowsCount, PRICES.windows, input.addonWindowsFreq);
  addItem("doors", "addon_doors", input.addonDoorsCount, PRICES.doors, input.addonDoorsFreq);
  addItem("handrails", "addon_handrails", input.addonHandrailsFloors, PRICES.handrails, input.addonHandrailsFreq);
  addItem("walls", "addon_walls", input.addonWallsMeters, PRICES.walls, input.addonWallsFreq);
  addItem("mailboxes", "addon_mailboxes", input.addonMailboxesCount, PRICES.mailboxes, input.addonMailboxesFreq);

  if (String(input.addonBasementOn) === "1") {
    addItem("basement", "addon_basement", 1, PRICES.basement, input.addonBasementFreq);
  }
  if (String(input.addonAtticOn) === "1") {
    addItem("attic", "addon_attic", 1, PRICES.attic, input.addonAtticFreq);
  }
  if (String(input.addonGarageSmallOn) === "1") {
    addItem("garageSmall", "addon_garage_small", 1, PRICES.garageSmall, input.addonGarageSmallFreq);
  }
  if (String(input.addonGarageLargeOn) === "1") {
    addItem("garageLarge", "addon_garage_large", 1, PRICES.garageLarge, input.addonGarageLargeFreq);
  }

  const monthlySum = items.reduce((a, b) => a + (b.monthly || 0), 0);
  return { items, monthlySum };
}

function computeCalc(input) {
  const type = input.type || "office";
  const freq = input.freq || "once";
  const perMonth = cleansPerMonth(freq);

  const minutes = type === "stairwell" ? calcMinutesStairwell(input) : calcMinutesOfficeFitness(input);

  let billed = roundUpToQuarterHour(minutes / 60);
  if (billed > 0 && billed < 0.75) billed = 0.75;

  const rate = billed > 0 ? pickRate(billed) : 0;

  let supplies = billed * 2.5;
  if (billed > 0 && supplies < 3) supplies = 3;
  supplies = Math.round(supplies * 100) / 100;

  const totalVisit = billed > 0 ? Math.round((billed * rate + supplies) * 100) / 100 : 0;

  const addons = calcAddonsMonthly(input);

  const baseMonth = totalVisit * perMonth;
  const totalMonth = Math.round((baseMonth + addons.monthlySum) * 100) / 100;

  return {
    minutes,
    billedHours: billed,
    rate,
    supplies,
    totalVisit,
    perMonth,
    baseMonth: Math.round(baseMonth * 100) / 100,
    addonsMonthly: Math.round(addons.monthlySum * 100) / 100,
    totalMonth,
    addonsItems: addons.items,
  };
}

function readCalcInput() {
  const type = $("typeSelect")?.value || "office";

  return {
    clientId: $("calcClientSelect")?.value || "",
    objectId: $("calcObjectSelect")?.value || "",
    type,
    freq: $("freqSelect")?.value || "once",
    intensive: !!$("intensiveToggle")?.checked,
    night: !!$("nightToggle")?.checked,

    // office/fitness
    mainArea: nnum($("mainArea")?.value),
    extraArea: nnum($("extraArea")?.value),
    wc: nnum($("wcCount")?.value),
    showers: nnum($("showersCount")?.value),
    lockers: nnum($("lockersCount")?.value),
    sauna: nnum($("saunaCount")?.value),
    relax: nnum($("relaxCount")?.value),
    kitchen: nnum($("kitchenCount")?.value),

    // stairwell
    stairsFloors: nnum($("stairsFloors")?.value),
    stairsEntrances: nnum($("stairsEntrances")?.value),

    // addons
    addonWindowsCount: nnum($("addonWindowsCount")?.value),
    addonWindowsFreq: $("addonWindowsFreq")?.value || "quarterly",

    addonDoorsCount: nnum($("addonDoorsCount")?.value),
    addonDoorsFreq: $("addonDoorsFreq")?.value || "monthly",

    addonHandrailsFloors: nnum($("addonHandrailsFloors")?.value),
    addonHandrailsFreq: $("addonHandrailsFreq")?.value || "monthly",

    addonWallsMeters: nnum($("addonWallsMeters")?.value),
    addonWallsFreq: $("addonWallsFreq")?.value || "yearly",

    addonMailboxesCount: nnum($("addonMailboxesCount")?.value),
    addonMailboxesFreq: $("addonMailboxesFreq")?.value || "monthly",

    addonBasementOn: $("addonBasementOn")?.value || "0",
    addonBasementFreq: $("addonBasementFreq")?.value || "yearly",

    addonAtticOn: $("addonAtticOn")?.value || "0",
    addonAtticFreq: $("addonAtticFreq")?.value || "yearly",

    addonGarageSmallOn: $("addonGarageSmallOn")?.value || "0",
    addonGarageSmallFreq: $("addonGarageSmallFreq")?.value || "quarterly",

    addonGarageLargeOn: $("addonGarageLargeOn")?.value || "0",
    addonGarageLargeFreq: $("addonGarageLargeFreq")?.value || "quarterly",

    notes: $("notes")?.value || "",
  };
}

function monthBreakdownText(calc) {
  const base = money(calc.baseMonth);
  const addons = money(calc.addonsMonthly);
  const baseText = fmt("breakdown_base", { perMonth: calc.perMonth, base });
  const addonsText = fmt("breakdown_addons", { addons });
  return `${baseText} ${addonsText}`;
}

function renderCalcOutput(calc) {
  $("outMinutes").textContent = calc.minutes > 0 ? `${calc.minutes} min` : "—";
  $("outHours").textContent = calc.billedHours > 0 ? `${calc.billedHours.toFixed(2)} h` : "—";
  $("outRate").textContent = calc.rate > 0 ? `${calc.rate} €/h` : "—";
  $("outSupplies").textContent = calc.supplies > 0 ? money(calc.supplies) : "—";

  $("outPriceVisit").textContent = calc.totalVisit > 0 ? money(calc.totalVisit) : "—";
  $("outPriceMonth").textContent = calc.totalMonth > 0 ? money(calc.totalMonth) : "—";

  $("outMonthBreakdown").textContent = calc.totalVisit > 0 ? monthBreakdownText(calc) : "—";

  const st = $("calcStatus");
  if (st) {
    if (calc.minutes === 0) st.textContent = "—";
    else if (calc.billedHours < 1.25) st.textContent = "SHORT";
    else if (calc.billedHours < 5) st.textContent = "OK";
    else st.textContent = "VOLUME";
  }
}

function calcLive() {
  updateTypePanels();
  const input = readCalcInput();
  const calc = computeCalc(input);
  renderCalcOutput(calc);
  return { input, calc };
}

// bind calc events
[
  "calcClientSelect",
  "calcObjectSelect",
  "typeSelect",
  "freqSelect",
  "intensiveToggle",
  "nightToggle",
  "mainArea",
  "extraArea",
  "wcCount",
  "showersCount",
  "lockersCount",
  "saunaCount",
  "relaxCount",
  "kitchenCount",
  "stairsFloors",
  "stairsEntrances",
  "addonWindowsCount",
  "addonWindowsFreq",
  "addonDoorsCount",
  "addonDoorsFreq",
  "addonHandrailsFloors",
  "addonHandrailsFreq",
  "addonWallsMeters",
  "addonWallsFreq",
  "addonMailboxesCount",
  "addonMailboxesFreq",
  "addonBasementOn",
  "addonBasementFreq",
  "addonAtticOn",
  "addonAtticFreq",
  "addonGarageSmallOn",
  "addonGarageSmallFreq",
  "addonGarageLargeOn",
  "addonGarageLargeFreq",
  "notes",
].forEach((id) => {
  const node = $(id);
  if (!node) return;
  node.addEventListener("input", calcLive);
  node.addEventListener("change", calcLive);
});

$("typeSelect")?.addEventListener("change", () => {
  updateTypePanels();
  calcLive();
});

// =========================
// CLIENTS CRUD
// =========================
let selectedClientId = null;

function clearClientForm() {
  selectedClientId = null;
  $("clientId").value = "";
  $("clientName").value = "";
  $("clientContact").value = "";
  $("clientPhone").value = "";
  $("clientEmail").value = "";
  $("clientAddress").value = "";
  $("clientNotes").value = "";
  renderClients();
}

function renderClients() {
  const q = ($("clientSearch")?.value || "").toLowerCase().trim();
  const body = $("clientsTableBody");
  if (!body) return;

  const list = db.clients
    .filter(
      (c) =>
        !q ||
        (c.name || "").toLowerCase().includes(q) ||
        (c.contact || "").toLowerCase().includes(q)
    )
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  body.innerHTML = "";

  list.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tr rowbtn" + (c.id === selectedClientId ? " active" : "");
    btn.innerHTML = `
      <div>${esc(c.name || "—")}</div>
      <div>${esc(c.contact || "—")}</div>
      <div>${esc(c.phone || "—")}</div>
      <div><span class="badge">${esc(c.status || "OK")}</span></div>
    `;
    btn.onclick = () => {
      selectedClientId = c.id;
      $("clientId").value = c.id;
      $("clientName").value = c.name || "";
      $("clientContact").value = c.contact || "";
      $("clientPhone").value = c.phone || "";
      $("clientEmail").value = c.email || "";
      $("clientAddress").value = c.address || "";
      $("clientNotes").value = c.notes || "";
      renderClients();
      renderObjects();
      renderCalcSelectors();
    };
    body.appendChild(btn);
  });
}

function saveClientFromForm() {
  const id = $("clientId").value ? Number($("clientId").value) : null;
  const name = ($("clientName").value || "").trim();
  if (!name) {
    alert(t("msg_need_client"));
    return;
  }

  const data = {
    id: id ?? uid(),
    name,
    contact: ($("clientContact").value || "").trim(),
    phone: ($("clientPhone").value || "").trim(),
    email: ($("clientEmail").value || "").trim(),
    address: ($("clientAddress").value || "").trim(),
    notes: ($("clientNotes").value || "").trim(),
    status: "OK",
    updatedAt: Date.now(),
  };

  const idx = db.clients.findIndex((c) => c.id === data.id);
  if (idx >= 0) db.clients[idx] = data;
  else db.clients.push(data);

  saveDB(db);
  selectedClientId = data.id;
  $("clientId").value = data.id;

  renderClients();
  renderObjects();
  renderCalcSelectors();
  alert(t("msg_saved"));
}

function deleteClient() {
  if (!selectedClientId) return;
  if (!confirm(t("msg_confirm_delete"))) return;

  const objectIds = db.objects
    .filter((o) => o.clientId === selectedClientId)
    .map((o) => o.id);

  db.objects = db.objects.filter((o) => o.clientId !== selectedClientId);
  db.offers = db.offers.filter(
    (of) => of.clientId !== selectedClientId && !objectIds.includes(of.objectId)
  );
  db.clients = db.clients.filter((c) => c.id !== selectedClientId);

  saveDB(db);
  clearClientForm();
  renderObjects();
  renderOffers();
  renderCalcSelectors();
  alert(t("msg_deleted"));
}

$("clientSearch")?.addEventListener("input", renderClients);
$("btnNewClient")?.addEventListener("click", clearClientForm);
$("btnSaveClient")?.addEventListener("click", saveClientFromForm);
$("btnDeleteClient")?.addEventListener("click", deleteClient);

$("btnGoNewObjectFromClient")?.addEventListener("click", () => {
  goView("objects");
  clearObjectForm();
  if (selectedClientId) $("objectClientSelect").value = String(selectedClientId);
});

// =========================
// OBJECTS CRUD
// =========================
let selectedObjectId = null;

function clearObjectForm() {
  selectedObjectId = null;
  $("objectId").value = "";
  $("objectClientSelect").value = "";
  $("objectTypeSelect").value = "office";
  $("objectName").value = "";
  $("objectAddress").value = "";
  $("objectMainArea").value = "";
  $("objectExtraArea").value = "";
  $("objectStairsFloors").value = "";
  $("objectStairsEntrances").value = "";
  $("objectWc").value = "";
  $("objectShowers").value = "";
  $("objectLockers").value = "";
  $("objectSauna").value = "";
  $("objectRelax").value = "";
  $("objectKitchen").value = "";
  $("objectNotes").value = "";
  renderObjects();
}

function clientNameById(id) {
  const c = db.clients.find((x) => String(x.id) === String(id));
  return c?.name || "—";
}

function typeLabel(type) {
  if (type === "fitness") return t("type_fitness");
  if (type === "stairwell") return t("type_stairwell");
  return t("type_office");
}

function renderObjectClientSelect() {
  const sel = $("objectClientSelect");
  if (!sel) return;
  const current = sel.value;

  sel.innerHTML =
    `<option value="">—</option>` +
    db.clients
      .slice()
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
      .map((c) => `<option value="${c.id}">${esc(c.name || "—")}</option>`)
      .join("");

  if (current) sel.value = current;
}

function renderCalcSelectors() {
  const cSel = $("calcClientSelect");
  const oSel = $("calcObjectSelect");
  if (!cSel || !oSel) return;

  const cCurrent = cSel.value;
  const oCurrent = oSel.value;

  cSel.innerHTML =
    `<option value="">—</option>` +
    db.clients
      .slice()
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
      .map((c) => `<option value="${c.id}">${esc(c.name || "—")}</option>`)
      .join("");

  if (cCurrent) cSel.value = cCurrent;

  const selectedClient = cSel.value;
  const objects = db.objects
    .filter((o) => !selectedClient || String(o.clientId) === String(selectedClient))
    .slice()
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  oSel.innerHTML =
    `<option value="">—</option>` +
    objects.map((o) => `<option value="${o.id}">${esc(o.name || "—")}</option>`).join("");

  if (oCurrent) oSel.value = oCurrent;
  if (oCurrent && !objects.find((o) => String(o.id) === String(oCurrent))) oSel.value = "";

  calcLive();
}

$("calcClientSelect")?.addEventListener("change", () => renderCalcSelectors());

$("calcObjectSelect")?.addEventListener("change", () => {
  const id = $("calcObjectSelect").value;
  if (!id) return;

  const obj = db.objects.find((o) => String(o.id) === String(id));
  if (!obj) return;

  $("typeSelect").value = obj.type || "office";

  if (obj.type === "stairwell") {
    $("stairsFloors").value = obj.stairs?.floors ?? "";
    $("stairsEntrances").value = obj.stairs?.entrances ?? "";
  } else {
    $("mainArea").value = obj.mainArea || "";
    $("extraArea").value = obj.extraArea || "";
    $("wcCount").value = obj.zones?.wc ?? "";
    $("showersCount").value = obj.zones?.showers ?? "";
    $("lockersCount").value = obj.zones?.lockers ?? "";
    $("saunaCount").value = obj.zones?.sauna ?? "";
    $("relaxCount").value = obj.zones?.relax ?? "";
    $("kitchenCount").value = obj.zones?.kitchen ?? "";
  }

  updateTypePanels();
  calcLive();
});

function renderObjects() {
  renderObjectClientSelect();

  const q = ($("objectSearch")?.value || "").toLowerCase().trim();
  const body = $("objectsTableBody");
  if (!body) return;

  const list = db.objects
    .filter((o) => {
      if (!q) return true;
      const cn = clientNameById(o.clientId).toLowerCase();
      return (
        (o.name || "").toLowerCase().includes(q) ||
        cn.includes(q) ||
        (o.address || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  body.innerHTML = "";

  list.forEach((o) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tr rowbtn" + (o.id === selectedObjectId ? " active" : "");
    btn.innerHTML = `
      <div>${esc(o.name || "—")}</div>
      <div>${esc(typeLabel(o.type))}</div>
      <div>${esc(clientNameById(o.clientId))}</div>
      <div><span class="badge">${esc(o.status || "OK")}</span></div>
    `;
    btn.onclick = () => {
      selectedObjectId = o.id;
      $("objectId").value = o.id;
      $("objectClientSelect").value = String(o.clientId || "");
      $("objectTypeSelect").value = o.type || "office";
      $("objectName").value = o.name || "";
      $("objectAddress").value = o.address || "";
      $("objectMainArea").value = o.mainArea || "";
      $("objectExtraArea").value = o.extraArea || "";

      $("objectStairsFloors").value = o.stairs?.floors ?? "";
      $("objectStairsEntrances").value = o.stairs?.entrances ?? "";

      $("objectWc").value = o.zones?.wc ?? "";
      $("objectShowers").value = o.zones?.showers ?? "";
      $("objectLockers").value = o.zones?.lockers ?? "";
      $("objectSauna").value = o.zones?.sauna ?? "";
      $("objectRelax").value = o.zones?.relax ?? "";
      $("objectKitchen").value = o.zones?.kitchen ?? "";

      $("objectNotes").value = o.notes || "";
      renderObjects();
      renderCalcSelectors();
    };
    body.appendChild(btn);
  });
}

function saveObjectFromForm() {
  const id = $("objectId").value ? Number($("objectId").value) : null;
  const clientId = $("objectClientSelect").value ? Number($("objectClientSelect").value) : null;
  const name = ($("objectName").value || "").trim();
  if (!clientId || !name) {
    alert(t("msg_need_object"));
    return;
  }

  const data = {
    id: id ?? uid(),
    clientId,
    type: $("objectTypeSelect").value || "office",
    name,
    address: ($("objectAddress").value || "").trim(),
    mainArea: nnum($("objectMainArea").value),
    extraArea: nnum($("objectExtraArea").value),
    stairs: {
      floors: nnum($("objectStairsFloors").value),
      entrances: nnum($("objectStairsEntrances").value),
    },
    zones: {
      wc: nnum($("objectWc").value),
      showers: nnum($("objectShowers").value),
      lockers: nnum($("objectLockers").value),
      sauna: nnum($("objectSauna").value),
      relax: nnum($("objectRelax").value),
      kitchen: nnum($("objectKitchen").value),
    },
    notes: ($("objectNotes").value || "").trim(),
    status: "OK",
    updatedAt: Date.now(),
  };

  const idx = db.objects.findIndex((o) => o.id === data.id);
  if (idx >= 0) db.objects[idx] = data;
  else db.objects.push(data);

  saveDB(db);
  selectedObjectId = data.id;
  $("objectId").value = data.id;

  renderObjects();
  renderCalcSelectors();
  alert(t("msg_saved"));
}

function deleteObject() {
  if (!selectedObjectId) return;
  if (!confirm(t("msg_confirm_delete"))) return;

  db.offers = db.offers.filter((of) => of.objectId !== selectedObjectId);
  db.objects = db.objects.filter((o) => o.id !== selectedObjectId);

  saveDB(db);
  clearObjectForm();
  renderOffers();
  renderCalcSelectors();
  alert(t("msg_deleted"));
}

$("objectSearch")?.addEventListener("input", renderObjects);
$("btnNewObject")?.addEventListener("click", clearObjectForm);
$("btnSaveObject")?.addEventListener("click", saveObjectFromForm);
$("btnDeleteObject")?.addEventListener("click", deleteObject);

$("btnOpenInCalc")?.addEventListener("click", () => {
  if (!selectedObjectId) return;
  const obj = db.objects.find((o) => o.id === selectedObjectId);
  if (!obj) return;

  goView("calc");

  $("calcClientSelect").value = String(obj.clientId);
  renderCalcSelectors();
  $("calcObjectSelect").value = String(obj.id);

  $("typeSelect").value = obj.type || "office";

  if (obj.type === "stairwell") {
    $("stairsFloors").value = obj.stairs?.floors ?? "";
    $("stairsEntrances").value = obj.stairs?.entrances ?? "";
  } else {
    $("mainArea").value = obj.mainArea || "";
    $("extraArea").value = obj.extraArea || "";
    $("wcCount").value = obj.zones?.wc ?? "";
    $("showersCount").value = obj.zones?.showers ?? "";
    $("lockersCount").value = obj.zones?.lockers ?? "";
    $("saunaCount").value = obj.zones?.sauna ?? "";
    $("relaxCount").value = obj.zones?.relax ?? "";
    $("kitchenCount").value = obj.zones?.kitchen ?? "";
  }

  updateTypePanels();
  calcLive();
});

// =========================
// OFFERS CRUD
// =========================
let selectedOfferId = null;

function offerStatusLabel(status) {
  const m = {
    draft: t("status_draft"),
    sent: t("status_sent"),
    accepted: t("status_accepted"),
    rejected: t("status_rejected"),
  };
  return m[status] || t("status_draft");
}

function setOfferDetailsEmpty() {
  $("dDate").textContent = "—";
  $("dClient").textContent = "—";
  $("dObject").textContent = "—";
  $("dType").textContent = "—";
  $("dHours").textContent = "—";
  $("dRate").textContent = "—";
  $("dSupplies").textContent = "—";
  $("dPriceVisit").textContent = "—";
  $("dPriceMonth").textContent = "—";
  $("dMonthBreakdown").textContent = "—";
  $("dNotes").textContent = "—";
  $("offerStatusSelect").value = "draft";
}

function setOfferDetails(of) {
  selectedOfferId = of.id;

  const obj = db.objects.find((o) => o.id === of.objectId);
  $("dDate").textContent = of.date;
  $("dClient").textContent = clientNameById(of.clientId);
  $("dObject").textContent = obj?.name || "—";
  $("dType").textContent = typeLabel(of.input.type);
  $("dHours").textContent = `${of.calc.billedHours.toFixed(2)} h (${of.calc.minutes} min)`;
  $("dRate").textContent = `${of.calc.rate} €/h`;
  $("dSupplies").textContent = money(of.calc.supplies);
  $("dPriceVisit").textContent = money(of.calc.totalVisit);
  $("dPriceMonth").textContent = money(of.calc.totalMonth);

  $("dMonthBreakdown").textContent = monthBreakdownText(of.calc);

  $("dNotes").textContent = (of.input.notes && of.input.notes.trim()) ? of.input.notes : "—";
  $("offerStatusSelect").value = of.status || "draft";
}

function renderOffers() {
  const q = ($("offerSearch")?.value || "").toLowerCase().trim();
  const listEl = $("offersList");
  const pill = $("offersCountPill");
  if (!listEl) return;

  const list = db.offers
    .filter((of) => {
      if (!q) return true;
      const cn = clientNameById(of.clientId).toLowerCase();
      const on = (db.objects.find((o) => o.id === of.objectId)?.name || "").toLowerCase();
      return cn.includes(q) || on.includes(q) || (of.date || "").toLowerCase().includes(q);
    })
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  if (pill) pill.textContent = String(list.length);

  listEl.innerHTML = "";
  selectedOfferId = null;
  setOfferDetailsEmpty();

  list.forEach((of) => {
    const btn = document.createElement("button");
    btn.type = "button";
    const objName = db.objects.find((o) => o.id === of.objectId)?.name || "—";

    const perLabel = lang === "de" ? "/Monat" : "/mc";

    btn.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:2px;">
        <div style="font-weight:900">${esc(of.date)}</div>
        <div style="font-size:12px;opacity:.75">
          ${esc(clientNameById(of.clientId))} • ${esc(objName)} • ${esc(offerStatusLabel(of.status))}
        </div>
        <div style="font-size:12px;opacity:.75">
          ${esc(typeLabel(of.input.type))} • ${esc(String(of.calc.perMonth))}× ${esc(perLabel)}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;">
        <span class="badge">${esc(money(of.calc.totalVisit))} / visit</span>
        <span class="badge">${esc(money(of.calc.totalMonth))} ${esc(perLabel)}</span>
      </div>
    `;

    btn.onclick = () => {
      document.querySelectorAll("#offersList button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      setOfferDetails(of);
    };

    listEl.appendChild(btn);
  });

  if (list.length > 0) {
    const first = listEl.querySelector("button");
    if (first) first.click();
  }
}

$("offerSearch")?.addEventListener("input", renderOffers);

$("offerStatusSelect")?.addEventListener("change", () => {
  if (!selectedOfferId) return;
  const of = db.offers.find((x) => x.id === selectedOfferId);
  if (!of) return;
  of.status = $("offerStatusSelect").value;
  saveDB(db);
  renderOffers();
});

$("btnDeleteOffer")?.addEventListener("click", () => {
  if (!selectedOfferId) return;
  if (!confirm(t("msg_confirm_delete"))) return;
  db.offers = db.offers.filter((x) => x.id !== selectedOfferId);
  saveDB(db);
  renderOffers();
  alert(t("msg_deleted"));
});

$("btnDuplicateOffer")?.addEventListener("click", () => {
  if (!selectedOfferId) return;
  const of = db.offers.find((x) => x.id === selectedOfferId);
  if (!of) return;

  const copy = {
    ...of,
    id: uid(),
    date: new Date().toLocaleString(),
    status: "draft",
    createdAt: Date.now(),
  };
  db.offers.unshift(copy);
  saveDB(db);
  renderOffers();
  alert(t("msg_saved"));
});

// =========================
// SAVE OFFER FROM CALC
// =========================
$("btnSaveOffer")?.addEventListener("click", () => {
  const { input, calc } = calcLive();
  if (calc.minutes <= 0) {
    alert(t("msg_need_calc"));
    return;
  }

  const clientId = input.clientId ? Number(input.clientId) : 0;
  const objectId = input.objectId ? Number(input.objectId) : 0;

  const offer = {
    id: uid(),
    date: new Date().toLocaleString(),
    createdAt: Date.now(),
    status: "draft",
    clientId,
    objectId,
    input,
    calc,
  };

  db.offers.unshift(offer);
  saveDB(db);
  goView("offers");
  renderOffers();
  alert(t("msg_saved"));
});

// =========================
// RESET CALC
// =========================
$("btnResetCalc")?.addEventListener("click", () => {
  $("calcClientSelect").value = "";
  $("calcObjectSelect").value = "";
  $("typeSelect").value = "office";
  $("freqSelect").value = "once";
  $("intensiveToggle").checked = false;
  $("nightToggle").checked = false;

  ["mainArea","extraArea","wcCount","showersCount","lockersCount","saunaCount","relaxCount","kitchenCount"].forEach((id)=>{
    if ($(id)) $(id).value = "";
  });

  ["stairsFloors","stairsEntrances","addonWindowsCount","addonDoorsCount","addonHandrailsFloors","addonWallsMeters","addonMailboxesCount"].forEach((id)=>{
    if ($(id)) $(id).value = "";
  });

  $("addonWindowsFreq").value = "quarterly";
  $("addonDoorsFreq").value = "monthly";
  $("addonHandrailsFreq").value = "monthly";
  $("addonWallsFreq").value = "yearly";
  $("addonMailboxesFreq").value = "monthly";

  $("addonBasementOn").value = "0";
  $("addonBasementFreq").value = "yearly";
  $("addonAtticOn").value = "0";
  $("addonAtticFreq").value = "yearly";
  $("addonGarageSmallOn").value = "0";
  $("addonGarageSmallFreq").value = "quarterly";
  $("addonGarageLargeOn").value = "0";
  $("addonGarageLargeFreq").value = "quarterly";

  $("notes").value = "";

  updateTypePanels();
  renderCalcSelectors();
  calcLive();
});

// =========================
// PDF (DR-SERVICE ONLY IN PDF)
// =========================
function getSelectedOffer() {
  if (!selectedOfferId) return null;
  return db.offers.find((x) => x.id === selectedOfferId) || null;
}

function freqLabel(f) {
  const map = {
    once: t("freq_once"),
    weekly: t("freq_weekly"),
    "2w": t("freq_2w"),
    "3w": t("freq_3w"),
    biweekly: t("freq_biweekly"),
    daily: t("freq_daily"),
    monthly: t("freq_monthly"),
    quarterly: t("freq_quarterly"),
    yearly: t("freq_yearly"),
    perclean: t("freq_perclean"),
  };
  return map[f] || f;
}

function buildAddonsTableHtml(calc) {
  if (!calc?.addonsItems?.length) return `<div class="muted">—</div>`;
  const rows = calc.addonsItems
    .map((it) => {
      const line = `${t(it.labelKey)} • qty: ${it.qty} • ${money(it.unitPrice)} • ${freqLabel(it.freq)} • /Monat: ${money(it.monthly)}`;
      return `<div class="rowline">${esc(line)}</div>`;
    })
    .join("");
  return `<div class="addonlist">${rows}</div>`;
}

function buildPdfHtml(offer) {
  const c = offer.clientId ? db.clients.find((x) => x.id === offer.clientId) : null;
  const o = offer.objectId ? db.objects.find((x) => x.id === offer.objectId) : null;

  const title = lang === "de" ? "Angebot" : "Oferta";
  const drLogo = "assets/logo/dr-service.png";

  const monthBreak = monthBreakdownText(offer.calc);

  return `<!doctype html>
<html lang="${esc(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>
  body{font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;margin:0;background:#fff;color:#111}
  .page{padding:28px}
  .top{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
  .brand{display:flex;align-items:center;gap:12px}
  .brand img{width:64px;height:64px;object-fit:contain}
  .brand .t1{font-weight:900;font-size:18px}
  .brand .t2{opacity:.7;font-size:12px;margin-top:2px}
  .box{border:1px solid #ddd;border-radius:12px;padding:14px;margin-top:16px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .k{font-size:12px;opacity:.7}
  .v{font-weight:800;margin-top:3px}
  .big{font-size:22px}
  .muted{opacity:.7;font-size:12px}
  .addonlist{margin-top:8px}
  .rowline{font-size:12px;opacity:.9;margin:4px 0}
  @media print{ .page{padding:18px} }
</style>
</head>
<body>
  <div class="page">
    <div class="top">
      <div class="brand">
        <img src="${esc(drLogo)}" alt="DR-Service">
        <div>
          <div class="t1">DR-Service</div>
          <div class="t2">Gebäudereinigung • Angebote</div>
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:900;font-size:18px">${esc(title)}</div>
        <div class="muted">${esc(offer.date)}</div>
        <div class="muted">GR Manager</div>
      </div>
    </div>

    <div class="box grid">
      <div>
        <div class="k">${esc(lang==="de"?"Kunde":"Klient")}</div>
        <div class="v">${esc(c?.name || "—")}</div>
        <div class="muted">${esc(c?.address || "")}</div>
        <div class="muted">${esc(c?.phone || "")}${esc(c?.email ? " • " + c.email : "")}</div>
      </div>
      <div>
        <div class="k">${esc(lang==="de"?"Objekt":"Obiekt")}</div>
        <div class="v">${esc(o?.name || "—")}</div>
        <div class="muted">${esc(o?.address || "")}</div>
        <div class="muted">${esc(typeLabel(offer.input.type))}</div>
      </div>
    </div>

    <div class="box grid">
      <div>
        <div class="k">${esc(lang==="de"?"Frequenz":"Częstotliwość")}</div>
        <div class="v">${esc(freqLabel(offer.input.freq))}</div>
      </div>
      <div>
        <div class="k">${esc(lang==="de"?"Reinigungen/Monat":"Sprzątania/miesiąc")}</div>
        <div class="v">${esc(String(offer.calc.perMonth))}</div>
      </div>

      <div>
        <div class="k">${esc(lang==="de"?"Zeit":"Czas")}</div>
        <div class="v">${esc(String(offer.calc.minutes))} min</div>
      </div>
      <div>
        <div class="k">${esc(lang==="de"?"Abrechnungszeit":"Godz. rozlicz.")}</div>
        <div class="v">${esc(offer.calc.billedHours.toFixed(2))} h</div>
      </div>

      <div>
        <div class="k">${esc(lang==="de"?"Stundensatz":"Stawka")}</div>
        <div class="v">${esc(String(offer.calc.rate))} €/h</div>
      </div>
      <div>
        <div class="k">${esc(lang==="de"?"Reinigungsmittel pro Reinigung":"Środki za sprzątanie")}</div>
        <div class="v">${esc(money(offer.calc.supplies))}</div>
      </div>

      <div style="grid-column:1/-1">
        <div class="k">${esc(lang==="de"?"Preis pro Reinigung (netto)":"Cena za sprzątanie (netto)")}</div>
        <div class="v big">${esc(money(offer.calc.totalVisit))}</div>
      </div>

      <div style="grid-column:1/-1">
        <div class="k">${esc(lang==="de"?"Monatspreis (netto)":"Cena miesięczna (netto)")}</div>
        <div class="v big">${esc(money(offer.calc.totalMonth))}</div>
        <div class="muted">${esc(monthBreak)}</div>
      </div>
    </div>

    <div class="box">
      <div class="k">${esc(lang==="de"?"Zusatzarbeiten (monatlich umgerechnet)":"Prace dodatkowe (przeliczone na miesiąc)")}</div>
      ${buildAddonsTableHtml(offer.calc)}
    </div>

    <div class="box">
      <div class="k">${esc(lang==="de"?"Notizen":"Notatki")}</div>
      <div class="v" style="white-space:pre-wrap">${esc((offer.input.notes||"").trim() || "—")}</div>
    </div>

<script>
  window.onload = () => { window.print(); };
</script>
</body>
</html>`;
}

function openPdfForOffer(offer) {
  const html = buildPdfHtml(offer);
  const w = window.open("", "_blank");
  if (!w) {
    alert(t("msg_popup_blocked"));
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

$("btnExportPdf")?.addEventListener("click", () => {
  const { input, calc } = calcLive();
  if (calc.minutes <= 0) {
    alert(t("msg_need_calc"));
    return;
  }

  const temp = {
    id: uid(),
    date: new Date().toLocaleString(),
    createdAt: Date.now(),
    status: "draft",
    clientId: input.clientId ? Number(input.clientId) : 0,
    objectId: input.objectId ? Number(input.objectId) : 0,
    input,
    calc,
  };
  openPdfForOffer(temp);
});

$("btnExportOfferPdf")?.addEventListener("click", () => {
  const of = getSelectedOffer();
  if (!of) return;
  openPdfForOffer(of);
});

// =========================
// BACKUP / RESTORE
// =========================
$("btnBackup")?.addEventListener("click", async () => {
  const payload = JSON.stringify(db, null, 2);
  try {
    await navigator.clipboard.writeText(payload);
    alert(t("msg_copied_clipboard"));
  } catch {
    const blob = new Blob([payload], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "gr-manager-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }
});

$("btnRestore")?.addEventListener("click", () => {
  const raw = prompt(t("msg_paste_backup"));
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    db = {
      clients: Array.isArray(parsed.clients) ? parsed.clients : [],
      objects: Array.isArray(parsed.objects) ? parsed.objects : [],
      offers: Array.isArray(parsed.offers) ? parsed.offers : [],
    };
    saveDB(db);
    renderAll();
    alert(t("msg_restored"));
  } catch {
    alert(t("msg_invalid_json"));
  }
});

// =========================
// OFFERS BUTTONS (EXPORT/DELETE already wired above)
// =========================
$("btnExportOfferPdf")?.addEventListener("click", () => {
  const of = getSelectedOffer();
  if (!of) return;
  openPdfForOffer(of);
});

// =========================
// INIT RENDER
// =========================
function renderAll() {
  renderClients();
  renderObjects();
  renderCalcSelectors();
  renderOffers();
  updateTypePanels();
  calcLive();
}

renderAll();
goView("calc");
