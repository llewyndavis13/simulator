{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 <!-- PapaParse -->\
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>\
\
<script>\
// 1) HTML do app (SEM <html>, <head>, <body>)\
const OCEANO_HTML = `\
  <div class="max-w-7xl mx-auto pb-24 md:pb-0">\
    <h1 class="text-3xl font-bold mb-6">Oceano na Tela</h1>\
    <div class="flex flex-col gap-8 md:flex-row md:justify-between">\
      <!-- ESQUERDA -->\
      <div class="basis-[45%] shrink-0 space-y-6">\
        <div>\
          <label class="block text-sm font-medium mb-1">Quanto voc\'ea tem para investir (R$)?</label>\
          <input id="totalBudget" type="text" inputmode="numeric" placeholder="10.000"\
            class="w-full border border-zinc-300 bg-white rounded-lg px-4 py-2 focus:ring focus:ring-blue-400 outline-none"/>\
        </div>\
\
        <div>\
          <label class="block text-sm font-medium mb-1">Selecione a <b>regi\'e3o</b> que quer anunciar</label>\
          <div id="regionButtons" class="flex flex-wrap gap-2"></div>\
        </div>\
\
        <div id="broadcasterSection" class="hidden">\
          <label class="block text-sm font-medium mb-1">Escolha a <b>emissora</b></label>\
          <div id="broadcasterButtons" class="flex flex-wrap gap-2"></div>\
        </div>\
\
        <div id="broadcasterInfo" style="background-color:#EDF5FF"\
             class="hidden text-black text-[14px] rounded-lg p-4 leading-relaxed"></div>\
\
        <div id="programListSection" class="hidden">\
          <h2 class="text-xl font-semibold mb-2">Programas Dispon\'edveis</h2>\
          <div id="programList" class="flex flex-wrap gap-4"></div>\
        </div>\
      </div>\
\
      <!-- DIREITA (desktop) -->\
      <div class="hidden md:block basis-[45%] shrink-0 bg-white p-6 rounded-xl shadow-lg space-y-6">\
        <h2 class="text-2xl font-bold">Seu Plano</h2>\
        <div id="selectedPrograms" class="space-y-4 mb-2"></div>\
\
        <div class="grid grid-cols-2 gap-4 text-sm">\
          <div class="rounded-xl bg-zinc-50 p-4 text-center">\
            <p class="text-zinc-600">Investimento (com Token $SAL)</p>\
            <p class="text-2xl font-extrabold mt-1">\
              <span id="totalInvestmentSal" class="text-blue-600">\'97</span> <span class="text-zinc-500 text-base">$SAL</span>\
            </p>\
            <p class="text-xs text-zinc-600 mt-1">\uc0\u8776  R$ <span id="totalInvestment" class="font-semibold">0,00</span></p>\
            <p id="budgetWarning" class="text-xs font-medium mt-2 hidden text-red-500">Ultrapassou o or\'e7amento</p>\
          </div>\
\
          <div class="rounded-xl bg-zinc-50 p-4 text-center">\
            <p class="text-zinc-600">Valor Negociado</p>\
            <p class="text-xl font-bold mt-1 text-zinc-900">R$ <span id="totalInvestmentFull">0,00</span></p>\
          </div>\
\
          <div class="rounded-xl bg-zinc-50 p-4 text-center">\
            <p class="text-zinc-600">CPM (com Token $SAL)</p>\
            <p class="text-xl font-bold mt-1" id="cpm">-</p>\
          </div>\
\
          <div class="rounded-xl bg-zinc-50 p-4 text-center">\
            <p class="text-zinc-600">CPM (sem Token $SAL)</p>\
            <p class="text-xl font-bold mt-1" id="cpmFull">-</p>\
          </div>\
\
          <div class="rounded-xl bg-zinc-50 p-4 text-center">\
            <p class="text-zinc-600">Inser\'e7\'f5es Totais</p>\
            <p class="text-xl font-bold mt-1" id="totalInsertions">0</p>\
          </div>\
\
          <div class="rounded-xl bg-zinc-50 p-4 text-center">\
            <p class="text-zinc-600">Espectadores</p>\
            <p class="text-xl font-bold mt-1" id="totalReach">0</p>\
          </div>\
        </div>\
      </div>\
    </div>\
  </div>\
\
  <!-- MOBILE BAR + SHEET -->\
  <div class="md:hidden fixed inset-x-0 bottom-0 z-40">\
    <div class="mx-auto max-w-7xl">\
      <div class="m-4 rounded-2xl shadow-lg bg-white border flex items-center justify-between px-4 py-3">\
        <div>\
          <div class="text-xs text-zinc-600">Plano (itens)</div>\
          <div class="text-base font-semibold">\
            <span id="mobileCartCount">0</span> itens \'95 R$ <span id="mobileCartTotal">0,00</span>\
          </div>\
        </div>\
        <button id="openCartBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl">\
          Ver plano\
        </button>\
      </div>\
    </div>\
  </div>\
\
  <div id="cartOverlay" class="md:hidden fixed inset-0 z-50 hidden">\
    <div id="overlayBg" class="absolute inset-0 bg-black/40"></div>\
    <div id="cartSheet" class="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto">\
      <div class="sticky top-0 bg-white rounded-t-2xl border-b px-4 pt-3 pb-3 flex items-center justify-between">\
        <h3 class="text-lg font-bold">Seu Plano</h3>\
        <button id="closeCartBtn" class="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-sm">Fechar</button>\
      </div>\
      <div class="px-4 py-4 space-y-4">\
        <div id="mobileSelectedPrograms" class="space-y-3"></div>\
        <div id="mobileTrafficFeeNote" class="hidden rounded-lg p-3 text-[12px] leading-snug" style="background:#FFF8CC;color:#111;">\
          Algumas emissoras possuem taxa de tr\'e1fego, e o valor ser\'e1 adicionado ao final da compra\
        </div>\
        <div class="pt-2">\
          <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-xl">\
            Avan\'e7ar\
          </button>\
        </div>\
      </div>\
    </div>\
  </div>\
`;\
\
// 2) Depois que a p\'e1gina do Framer terminar, injeta e roda seu JS\
(function bootOceano()\{\
  function ready(fn)\{ if(document.readyState==='loading')\{document.addEventListener('DOMContentLoaded', fn);\} else \{ fn(); \} \}\
  ready(() => \{\
    const root = document.getElementById('app-oceano');\
    if(!root)\{ console.warn('[Oceano] cont\'eainer #app-oceano n\'e3o encontrado'); return; \}\
    root.innerHTML = OCEANO_HTML;\
\
    // === AQUI EMBAIXO: COLE TODO O SEU JS ORIGINAL (sem <script>), ajustando s\'f3 o WEBAPP_URL se quiser ===\
\
    const sheetId = "1SbCipiypV6OAYse2jmEWf5V19rKDx82oApGMj1NQ2Uk";\
    const sheets = \{\
      praca:     `https://docs.google.com/spreadsheets/d/$\{sheetId\}/gviz/tq?tqx=out:csv&sheet=$\{encodeURIComponent('Pra\'e7a')\}`,\
      emissoras: `https://docs.google.com/spreadsheets/d/$\{sheetId\}/gviz/tq?tqx=out:csv&sheet=$\{encodeURIComponent('Emissoras')\}`,\
      programas: `https://docs.google.com/spreadsheets/d/$\{sheetId\}/gviz/tq?tqx=out:csv&sheet=$\{encodeURIComponent('Programas')\}`\
    \};\
\
    const MB_V4_BASE = "https://api.mercadobitcoin.net/api/v4";\
    const MB_V3_BASE = "https://www.mercadobitcoin.net/api";\
    const MB_SYMBOL = "SAL-BRL";\
    let salPriceBRL = null, salLastFetch = null;\
\
      async function fetchSALPrice() \{\
        try \{\
          try \{\
            const r = await fetch(`$\{MB_V4_BASE\}/tickers?symbols=$\{encodeURIComponent(MB_SYMBOL)\}`);\
            if (r.ok) \{\
              const j = await r.json();\
              const first = Array.isArray(j) ? j[0] : (Array.isArray(j?.data) ? j.data[0] : null);\
              const last = Number(first?.last || first?.close || first?.price);\
              if (Number.isFinite(last) && last > 0) \{\
                salPriceBRL = last;\
                salLastFetch = new Date();\
                renderSalMeta();\
                renderSelected(getCurrentAlloc());\
                return;\
              \}\
            \}\
          \} catch \{\}\
\
          try \{\
            const r2 = await fetch(`$\{MB_V3_BASE\}/SAL/ticker/`);\
            if (r2.ok) \{\
              const j2 = await r2.json();\
              const last = Number(j2?.ticker?.last || j2?.last);\
              if (Number.isFinite(last) && last > 0) \{\
                salPriceBRL = last;\
                salLastFetch = new Date();\
                renderSalMeta();\
                renderSelected(getCurrentAlloc());\
                return;\
              \}\
            \}\
          \} catch \{\}\
\
          try \{\
            const r3 = await fetch(`$\{MB_V4_BASE\}/orderbook/$\{encodeURIComponent(MB_SYMBOL)\}`);\
            if (r3.ok) \{\
              const j3 = await r3.json();\
              const ask = Number(j3?.asks?.[0]?.[0] ?? j3?.asks?.[0]?.price);\
              const bid = Number(j3?.bids?.[0]?.[0] ?? j3?.bids?.[0]?.price);\
              const mid = (Number.isFinite(ask) && Number.isFinite(bid)) ? (ask + bid) / 2 : null;\
              if (Number.isFinite(mid) && mid > 0) \{\
                salPriceBRL = mid;\
                salLastFetch = new Date();\
                renderSalMeta();\
                renderSelected(getCurrentAlloc());\
                return;\
              \}\
            \}\
          \} catch \{\}\
\
          console.warn("N\'e3o foi poss\'edvel obter cota\'e7\'e3o do SAL em nenhum endpoint.");\
        \} catch (e) \{\
          console.warn("Falha cota\'e7\'e3o SAL:", e);\
        \}\
      \}\
\
      function renderSalMeta() \{\
        const priceEls = [document.getElementById("salPriceBRL"), document.getElementById("mobileSalPriceBRL")];\
        const tsEl = document.getElementById("salLastUpdate");\
        if (salPriceBRL) priceEls.forEach(el => el && (el.textContent = formatBRL(salPriceBRL)));\
        if (salLastFetch && tsEl) \{\
          const d = salLastFetch, hh = String(d.getHours()).padStart(2,"0"), mm = String(d.getMinutes()).padStart(2,"0");\
          tsEl.textContent = `atualizado $\{hh\}:$\{mm\}`;\
        \}\
      \}\
\
      function brlToSAL(v) \{ return (salPriceBRL && salPriceBRL > 0) ? v / salPriceBRL : null; \}\
      function formatSAL(n) \{\
        if (!Number.isFinite(n)) return "\'97";\
        const a = Math.abs(n);\
        const dec = a >= 100 ? 2 : a >= 10 ? 3 : a >= 1 ? 4 : 6;\
        return n.toLocaleString("pt-BR", \{ minimumFractionDigits: dec, maximumFractionDigits: dec \});\
      \}\
\
      /* ===== Estado / Persist\'eancia ===== */\
      let data = \{ praca: [], emissoras: [], programas: [] \};\
      let selectedRegion = "";\
      let selectedBroadcaster = "";\
      let selectedMap = new Map();\
      let lastAlloc = new Map();\
\
      const LS_KEY = "oceano_plano_v2";\
\
      function saveState() \{\
        try \{\
          const payload = \{\
            selectedRegion,\
            selectedBroadcaster,\
            budget: document.getElementById("totalBudget")?.value || "",\
            items: Array.from(selectedMap.entries()),\
            lastAlloc: Array.from(lastAlloc.entries())\
          \};\
          localStorage.setItem(LS_KEY, JSON.stringify(payload));\
        \} catch (e) \{ console.warn("N\'e3o salvou estado:", e); \}\
      \}\
      const saveStateDebounced = debounce(saveState, 150);\
\
      function loadState() \{\
        try \{\
          const raw = localStorage.getItem(LS_KEY);\
          if (!raw) return;\
          const s = JSON.parse(raw);\
          if (s.budget) document.getElementById("totalBudget").value = s.budget;\
          selectedRegion = s.selectedRegion || "";\
          selectedBroadcaster = s.selectedBroadcaster || "";\
          selectedMap = new Map(s.items || []);\
          lastAlloc  = new Map(s.lastAlloc || []);\
        \} catch (e) \{ console.warn("N\'e3o carregou estado:", e); \}\
      \}\
\
      function debounce(fn, wait)\{ let t; return (...a)=>\{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); \}; \}\
\
      /* ===== Utils ===== */\
      const onlyDigits = (s) => (s || "").replace(/\\D+/g, "");\
      function formatThousandsInt(n)\{ const i = Math.max(0, parseInt(n || 0, 10)); return i.toLocaleString("pt-BR"); \}\
      function parseMaskedBudget(str)\{ const d = onlyDigits(str); return d ? parseInt(d, 10) : 0; \}\
      function formatBRL(n)\{ return (n || 0).toLocaleString("pt-BR", \{ minimumFractionDigits: 2, maximumFractionDigits: 2 \}); \}\
      function parseNumberPossibleComma(v)\{\
        if (typeof v === "number") return v;\
        if (!v) return 0;\
        const s = String(v).trim().replace(/\\./g, "").replace(",", ".");\
        return Number.isFinite(parseFloat(s)) ? parseFloat(s) : 0;\
      \}\
      function parseIntLocale(v)\{\
        if (typeof v === "number") return Math.round(v);\
        const d = onlyDigits(String(v || "")); return d ? parseInt(d, 10) : 0;\
      \}\
      function getFirst(obj, keys)\{ for (const k of keys)\{ if (obj[k]!=null && String(obj[k]).trim()!=="") return obj[k]; \} return ""; \}\
      function keyFor(eid, pid)\{ return `$\{eid\}||$\{pid\}`; \}\
\
      /* === Helpers de nomes === */\
      function pracaNomeById(idPra\'e7a)\{\
        const p = data.praca.find(pr => String(pr.ID) === String(idPra\'e7a));\
        return p?.["Pra\'e7a"] || p?.["Praca"] || "";\
      \}\
      function pracaNomeByEmissoraId(emissoraId)\{\
        const em = data.emissoras.find(e => String(e.ID) === String(emissoraId));\
        const idPra\'e7a = em?.["Pra\'e7a"] || em?.["Praca"] || "";\
        return pracaNomeById(idPra\'e7a) || "";\
      \}\
\
      /* ===== Carregar planilha e boot ===== */\
      async function loadData() \{\
        for (let key in sheets) \{\
          const res = await fetch(sheets[key]);\
          const text = await res.text();\
          data[key] = Papa.parse(text, \{ header: true \}).data;\
        \}\
        data.emissoras.sort((a,b)=>(a["Emissora"]||"").localeCompare(b["Emissora"]||""));\
\
        loadState();\
        renderFilters();\
        renderBroadcasterInfo();\
        renderProgramList();\
\
        autoAllocateAndRender('auto');\
\
        await fetchSALPrice();\
        setInterval(fetchSALPrice, 60000);\
      \}\
\
      /* ===== Filtros ===== */\
      function renderFilters() \{\
        const regionEl = document.getElementById("regionButtons");\
        const broadcasterEl = document.getElementById("broadcasterButtons");\
        const broadcasterSection = document.getElementById("broadcasterSection");\
\
        regionEl.innerHTML = "";\
        broadcasterEl.innerHTML = "";\
\
        const regions = [...new Set(data.praca.map(p => p["Pra\'e7a"]).filter(Boolean))];\
\
        // \uc0\u8680  Pr\'e9-seleciona "Brasil" se nada estiver escolhido\
        if (!selectedRegion) \{\
          const brasilKey = regions.find(r => String(r).trim().toLowerCase() === "brasil");\
          if (brasilKey) selectedRegion = brasilKey;\
        \}\
\
        regions.forEach(region => \{\
          const active = selectedRegion === region;\
          const btn = document.createElement("button");\
          btn.className = `px-4 py-2 rounded-full border text-sm $\{active ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700'\} hover:bg-zinc-200`;\
          btn.textContent = region;\
          btn.onclick = () => \{\
            selectedRegion = active ? "" : region;\
            selectedBroadcaster = "";\
            renderFilters(); renderBroadcasterInfo(); renderProgramList();\
            saveStateDebounced();\
          \};\
          regionEl.appendChild(btn);\
        \});\
\
        if (!selectedRegion) \{ broadcasterSection.classList.add("hidden"); return; \}\
        broadcasterSection.classList.remove("hidden");\
\
        const regionId = data.praca.find(p => p["Pra\'e7a"] === selectedRegion)?.ID;\
        let filteredEmissoras = data.emissoras.filter(e => e["Pra\'e7a"] === regionId);\
\
        filteredEmissoras.forEach(em => \{\
          const active = selectedBroadcaster === em.ID;\
          const btn = document.createElement("button");\
          btn.className = `px-4 py-2 rounded-full border text-sm $\{active ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700'\} hover:bg-zinc-200`;\
          btn.textContent = em["Emissora"];\
          btn.onclick = () => \{\
            selectedBroadcaster = active ? "" : em.ID;\
            renderFilters(); renderBroadcasterInfo(); renderProgramList();\
            saveStateDebounced();\
          \};\
          broadcasterEl.appendChild(btn);\
        \});\
      \}\
\
      /* ===== Info da Emissora ===== */\
      function renderBroadcasterInfo() \{\
        const infoBox = document.getElementById("broadcasterInfo");\
        infoBox.innerHTML = ""; infoBox.classList.add("hidden");\
        if (!selectedRegion || !selectedBroadcaster) return;\
\
        const em = data.emissoras.find(e => e.ID === selectedBroadcaster);\
        if (!em) return;\
\
        const infoText = String(getFirst(em, ["Info","INFO","info","Informa\'e7\'e3o","Informacoes","Informa\'e7\'f5es"]))?.trim();\
        if (infoText) \{\
          infoBox.innerHTML = `<div class="space-y-1"><div class="font-semibold">Informa\'e7\'f5es da emissora</div><div>$\{infoText\}</div></div>`;\
          infoBox.classList.remove("hidden");\
        \}\
      \}\
\
      /* ===== Programas ===== */\
      function renderProgramList() \{\
        const list = document.getElementById("programList");\
        const section = document.getElementById("programListSection");\
        list.innerHTML = "";\
\
        if (!selectedRegion) \{ section.classList.add("hidden"); return; \}\
\
        let filtered = data.programas;\
        if (selectedBroadcaster) \{\
          filtered = filtered.filter(p => (getFirst(p, ["Emissora"]) || "").trim() === selectedBroadcaster);\
        \} else \{ section.classList.add("hidden"); return; \}\
\
        if (filtered.length) section.classList.remove("hidden"); else section.classList.add("hidden");\
\
        filtered.forEach(p => \{\
          const nome = getFirst(p, ["Programa","programa"]) || "";\
          const valorFull = parseNumberPossibleComma(getFirst(p, ["Valor","valor"]));\
          const valorConsiderado = Math.max(0, valorFull * 0.5);\
          const alcance = parseIntLocale(getFirst(p, ["Alcance","alcance"]));\
          const programaId = getFirst(p, ["ID","Id","id"]) || nome;\
\
          const horarioInicio = String(getFirst(p, [\
            "horario inicio","hor\'e1rio in\'edcio","Horario inicio","Hor\'e1rio In\'edcio","Horario In\'edcio","Hor\'e1rio inicio"\
          ]) || "").trim();\
          const horarioFim = String(getFirst(p, [\
            "horario fim","Hor\'e1rio Fim","Horario fim","Hor\'e1rio fim","Hor\'e1rio Fim"\
          ]) || "").trim();\
\
          const card = document.createElement("div");\
          card.className = "bg-white p-4 rounded-xl w-64 shadow text-sm space-y-2";\
          card.innerHTML = `\
            <h3 class="text-lg font-semibold">$\{nome\}</h3>\
            <p class="text-zinc-600"><span class="font-medium">Hor\'e1rio:</span> $\{horarioInicio || "-"\} - $\{horarioFim || "-"\}</p>\
            <p class="text-zinc-600">Valor Negociado: R$ $\{formatBRL(valorFull)\}</p>\
            <p class="text-zinc-600">Desconto Token $SAL: R$ $\{formatBRL(valorConsiderado)\}</p>\
            <p class="text-zinc-600">Alcance: $\{alcance.toLocaleString("pt-BR")\} indiv\'edduos</p>\
            <button class="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1.5">Adicionar</button>\
          `;\
          card.querySelector("button").onclick = () => addProgram(\{\
            emissoraId: selectedBroadcaster,\
            programaId, nomePrograma: nome,\
            valorFull, valorConsiderado, alcance,\
            horarioInicio, horarioFim\
          \});\
          list.appendChild(card);\
        \});\
      \}\
\
      /* ===== Sele\'e7\'e3o ===== */\
      function addProgram(item) \{\
        const k = keyFor(item.emissoraId, item.programaId);\
        if (selectedMap.has(k)) \{\
          const cur = selectedMap.get(k);\
          const currentShown = lastAlloc.get(k) || 0;\
          cur.manualQty = (cur.manualQty != null ? cur.manualQty : currentShown) + 1;\
          selectedMap.set(k, cur);\
          autoAllocateAndRender('manual');\
        \} else \{\
          selectedMap.set(k, \{ ...item, manualQty: 1 \});\
          autoAllocateAndRender('auto');\
        \}\
        saveStateDebounced();\
      \}\
\
      function removeProgram(eid, pid) \{\
        const k = keyFor(eid, pid);\
        selectedMap.delete(k);\
        lastAlloc.delete(k);\
        autoAllocateAndRender('auto');\
        saveStateDebounced();\
      \}\
\
      function getBudgetNumber()\{ return parseMaskedBudget(document.getElementById("totalBudget").value); \}\
\
      /* ===== Aloca\'e7\'e3o ===== */\
      function autoAllocateInsertionsRespectingManuals(budget, items) \{\
        if (items.length === 0) return [];\
        const locked = items.filter(i => i.manualQty != null);\
        const unlocked = items.filter(i => i.manualQty == null);\
\
        const lockedSpend = locked.reduce((s, it) => s + (Math.max(0, parseInt(it.manualQty || 0)) * (it.valorConsiderado || 0)), 0);\
        let remaining = Math.max(0, budget - lockedSpend);\
\
        if (unlocked.length === 0) \{\
          return items.map(it => (\{ ...it, insercoes: it.manualQty != null ? Math.max(0, parseInt(it.manualQty || 0)) : 0 \}));\
        \}\
\
        const unlockedSorted = [...unlocked].sort((a,b)=>(a.valorConsiderado||0)-(b.valorConsiderado||0));\
        const baseMap = new Map();\
        unlockedSorted.forEach(u => baseMap.set(keyFor(u.emissoraId, u.programaId), 0));\
\
        for (const u of unlockedSorted) \{\
          const price = u.valorConsiderado || 0;\
          if (price > 0 && remaining >= price) \{ \
            baseMap.set(keyFor(u.emissoraId,u.programaId),1); \
            remaining -= price; \
          \}\
        \}\
\
        if (remaining > 0) \{\
          const share = remaining / unlocked.length;\
          const quotas = unlocked.map(it => \{\
            const base = baseMap.get(keyFor(it.emissoraId, it.programaId)) || 0;\
            const exact = share / Math.max(1e-9, it.valorConsiderado || 0);\
            const extra = Math.max(0, Math.floor(exact));\
            const frac = exact - extra;\
            return \{ it, base: base + extra, frac \};\
          \});\
\
          let spent = quotas.reduce((s,q)=>s+(q.base*(q.it.valorConsiderado||0)),0);\
          let rem = (budget - lockedSpend) - spent;\
\
          const order = [...quotas].sort((a,b)=>b.frac - a.frac);\
          for (const q of order) \{ \
            if (rem >= q.it.valorConsiderado) \{ \
              q.base += 1; rem -= q.it.valorConsiderado; \
            \} \
          \}\
\
          if (rem > 0) \{\
            const byCost = [...quotas].sort((a,b)=>(a.it.valorConsiderado||0)-(b.it.valorConsiderado||0));\
            let idx = 0;\
            while (rem >= (byCost[0]?.it.valorConsiderado || Infinity)) \{\
              const q = byCost[idx % byCost.length];\
              if (rem >= q.it.valorConsiderado) \{ q.base += 1; rem -= q.it.valorConsiderado; \}\
              idx++;\
            \}\
          \}\
\
          const unlockedAlloc = quotas.map(q => (\{ ...q.it, insercoes: q.base \}));\
          const lockedAlloc = locked.map(l => (\{ ...l, insercoes: Math.max(0, parseInt(l.manualQty || 0)) \}));\
          return [...lockedAlloc, ...unlockedAlloc];\
        \} else \{\
          const unlockedAlloc = unlocked.map(u => (\{ \
            ...u, \
            insercoes: baseMap.get(keyFor(u.emissoraId, u.programaId)) || 0 \
          \}));\
          const lockedAlloc = locked.map(l => (\{ ...l, insercoes: Math.max(0, parseInt(l.manualQty || 0)) \}));\
          return [...lockedAlloc, ...unlockedAlloc];\
        \}\
      \}\
\
      function autoAllocateAndRender(trigger='auto') \{\
        const budget = getBudgetNumber();\
        const items = Array.from(selectedMap.values());\
        const kOf = (it)=>keyFor(it.emissoraId, it.programaId);\
\
        let alloc;\
        if (trigger === 'manual') \{\
          alloc = items.map(it => \{\
            const k = kOf(it);\
            if (it.manualQty != null) return \{ ...it, insercoes: Math.max(0, parseInt(it.manualQty || 0)) \};\
            const prev = lastAlloc.get(k);\
            return \{ ...it, insercoes: Math.max(0, parseInt(prev || 0)) \};\
          \});\
          renderSelected(alloc);\
          alloc.forEach(a => lastAlloc.set(kOf(a), a.insercoes));\
          saveStateDebounced();\
          return;\
        \}\
\
        alloc = autoAllocateInsertionsRespectingManuals(budget, items);\
        renderSelected(alloc);\
        alloc.forEach(a => lastAlloc.set(kOf(a), a.insercoes));\
        saveStateDebounced();\
      \}\
\
      /* ===== Aloca\'e7\'e3o atual (novo) ===== */\
      function getCurrentAlloc() \{\
        return Array.from(selectedMap.values()).map(it => \{\
          const k = keyFor(it.emissoraId, it.programaId);\
          const qty = (it.manualQty != null) ? Math.max(0, parseInt(it.manualQty,10)) : Math.max(0, parseInt(lastAlloc.get(k) || 0,10));\
          return \{ ...it, insercoes: qty \};\
        \});\
      \}\
\
      /* ===== Render (desktop + mobile) ===== */\
      function renderSelected(listAlloc) \{\
        const container = document.getElementById("selectedPrograms");\
        if (container) container.innerHTML = "";\
\
        let totalInvestmentConsidered = 0, totalInvestmentFull = 0;\
        let totalReach = 0, totalInsertions = 0;\
        let sumCpmConsideredTimesQty = 0, sumCpmFullTimesQty = 0;\
\
        const byEm = new Map();\
        for (const it of listAlloc) \{\
          if (!byEm.has(it.emissoraId)) byEm.set(it.emissoraId, []);\
          byEm.get(it.emissoraId).push(it);\
        \}\
\
        const emName = (id) => data.emissoras.find(e => e.ID === id)?.Emissora || "Emissora";\
        const emHeader = (id) => \{\
          const em = emName(id);\
          const pr = pracaNomeByEmissoraId(id);\
          return pr ? `$\{em\} \'96 $\{pr\}` : em;\
        \};\
\
        byEm.forEach((items, emissoraId) => \{\
          if (container) \{\
            const bloco = document.createElement("div");\
            bloco.innerHTML = `<h3 class="text-lg font-bold mb-2">$\{emHeader(emissoraId)\}</h3>`;\
            const list = document.createElement("div");\
            list.className = "space-y-2 mb-4";\
            bloco.appendChild(list);\
            container.appendChild(bloco);\
\
items.forEach(p => \{\
  const vFull = p.valorFull || 0;\
  const vHalf = p.valorConsiderado || 0;\
  const alcance = parseIntLocale(p.alcance);\
  const insercoes = Math.max(0, parseInt(p.insercoes || 0, 10));\
\
  const investCheio = insercoes * vFull;\
  const investConsiderado = insercoes * vHalf;\
\
  totalInvestmentFull += investCheio;\
  totalInvestmentConsidered += investConsiderado;\
  totalReach += alcance * insercoes;\
  totalInsertions += insercoes;\
\
  const cpmUnitConsidered = (alcance > 0 && vHalf > 0) ? (vHalf / alcance) * 1000 : 0;\
  const cpmUnitFull = (alcance > 0 && vFull > 0) ? (vFull / alcance) * 1000 : 0;\
  sumCpmConsideredTimesQty += cpmUnitConsidered * insercoes;\
  sumCpmFullTimesQty += cpmUnitFull * insercoes;\
\
  // \uc0\u9989  deixe a declara\'e7\'e3o FORA do innerHTML e use text-xs\
  const horariosLinha = (p.horarioInicio || p.horarioFim)\
    ? `<p class="text-xs text-zinc-600 whitespace-nowrap">Hor\'e1rio: $\{p.horarioInicio || "-"\} \'96 $\{p.horarioFim || "-"\}</p>`\
    : "";\
\
  const item = document.createElement("div");\
  item.className = "bg-zinc-50 border border-zinc-200 rounded-xl p-3 grid grid-cols-12 items-center gap-3";\
\
  item.innerHTML = `\
    <!-- COL ESQUERDA (info) -->\
    <div class="col-span-8 min-w-0">\
      <p class="font-semibold truncate" title="$\{p.nomePrograma\}">$\{p.nomePrograma\}</p>\
      $\{horariosLinha\}\
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 mt-1">\
        <span class="whitespace-nowrap">Negociado: R$ $\{formatBRL(vFull)\}</span>\
        <span class="whitespace-nowrap">Desc. $SAL: R$ $\{formatBRL(vHalf)\}</span>\
        <span class="whitespace-nowrap">Alcance: $\{alcance.toLocaleString("pt-BR")\}</span>\
      </div>\
    </div>\
\
    <!-- COL DIREITA (controles) -->\
    <div class="col-span-4 flex items-center justify-end gap-2">\
      <div class="text-right">\
        <div class="flex items-center justify-end">\
          <button class="btn-minus px-2 py-1 bg-zinc-200 rounded-l hover:bg-zinc-300" title="Diminuir" aria-label="Diminuir">-</button>\
          <input type="number" min="0" value="$\{insercoes\}" class="qty-input w-16 text-center rounded bg-zinc-100 text-zinc-900 border-0" />\
          <button class="btn-plus px-2 py-1 bg-zinc-200 rounded-r hover:bg-zinc-300" title="Aumentar" aria-label="Aumentar">+</button>\
        </div>\
        <div class="mt-1 text-[11px] leading-tight text-zinc-600">\
          <div class="whitespace-nowrap">Total (com $SAL): R$ $\{formatBRL(investConsiderado)\}</div>\
          <div class="whitespace-nowrap">Total (100%): R$ $\{formatBRL(investCheio)\}</div>\
        </div>\
      </div>\
\
      <button class="btn-remove p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white" title="Remover" aria-label="Remover">\
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">\
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a2 2 0 012-2h3a2 2 0 012 2v2" />\
        </svg>\
      </button>\
    </div>\
  `;\
\
  // handlers\
  const btnRemove = item.querySelector(".btn-remove");\
  const btnMenos  = item.querySelector(".btn-minus");\
  const inputQty  = item.querySelector(".qty-input");\
  const btnMais   = item.querySelector(".btn-plus");\
\
  btnRemove.onclick = () => removeProgram(p.emissoraId, p.programaId);\
  btnMenos.onclick  = () => \{ const v = Math.max(0, parseInt(inputQty.value||"0",10)-1); inputQty.value=v; applyManualOverride(p.emissoraId,p.programaId,v); \};\
  btnMais.onclick   = () => \{ const v = Math.max(0, parseInt(inputQty.value||"0",10)+1); inputQty.value=v; applyManualOverride(p.emissoraId,p.programaId,v); \};\
  inputQty.onchange = () => \{ let v=parseInt(inputQty.value||"0",10); if(isNaN(v)||v<0) v=0; inputQty.value=v; applyManualOverride(p.emissoraId,p.programaId,v); \};\
\
  list.appendChild(item);\
\});\
          \} else \{\
            items.forEach(p => \{\
              const vFull = p.valorFull || 0, vHalf = p.valorConsiderado || 0;\
              const alcance = parseIntLocale(p.alcance);\
              const insercoes = Math.max(0, parseInt(p.insercoes || 0, 10));\
              totalInvestmentFull += insercoes * vFull;\
              totalInvestmentConsidered += insercoes * vHalf;\
              totalReach += alcance * insercoes;\
              totalInsertions += insercoes;\
              const cpmUnitConsidered = (alcance>0 && vHalf>0)? (vHalf/alcance)*1000 : 0;\
              const cpmUnitFull = (alcance>0 && vFull>0)? (vFull/alcance)*1000 : 0;\
              sumCpmConsideredTimesQty += cpmUnitConsidered * insercoes;\
              sumCpmFullTimesQty += cpmUnitFull * insercoes;\
            \});\
          \}\
        \});\
\
        // Totais (desktop + mobile)\
        const invEl = document.getElementById("totalInvestment");\
        const invFullEl = document.getElementById("totalInvestmentFull");\
        const totalInsEl = document.getElementById("totalInsertions");\
        const totalReachEl = document.getElementById("totalReach");\
        if (invEl) invEl.textContent = formatBRL(totalInvestmentConsidered);\
        if (invFullEl) invFullEl.textContent = formatBRL(totalInvestmentFull);\
        if (totalInsEl) totalInsEl.textContent = totalInsertions;\
        if (totalReachEl) totalReachEl.textContent = totalReach.toLocaleString('pt-BR');\
\
        const salQty = brlToSAL(totalInvestmentConsidered);\
        const salEl = document.getElementById("totalInvestmentSal");\
        const mobileSalEl = document.getElementById("mobileTotalInvestmentSal");\
        if (salEl) salEl.textContent = salQty != null ? formatSAL(salQty) : "\'97";\
        if (mobileSalEl) mobileSalEl.textContent = salQty != null ? formatSAL(salQty) : "\'97";\
\
        const cpmMedioConsidered = totalInsertions > 0 ? (sumCpmConsideredTimesQty / totalInsertions) : null;\
        const cpmMedioFull = totalInsertions > 0 ? (sumCpmFullTimesQty / totalInsertions) : null;\
        const cpmEl = document.getElementById("cpm"), cpmFullEl = document.getElementById("cpmFull");\
        if (cpmEl) cpmEl.textContent = (cpmMedioConsidered != null) ? formatBRL(cpmMedioConsidered) : "-";\
        if (cpmFullEl) cpmFullEl.textContent = (cpmMedioFull != null) ? formatBRL(cpmMedioFull) : "-";\
\
        const budget = getBudgetNumber();\
        const warn = document.getElementById("budgetWarning");\
        if (warn && invEl) warn.classList.toggle("hidden", !(totalInvestmentConsidered > budget && budget > 0));\
\
        const mobileCartCount = document.getElementById("mobileCartCount");\
        const mobileCartTotal = document.getElementById("mobileCartTotal");\
        if (mobileCartCount) mobileCartCount.textContent = listAlloc.length.toString();\
        if (mobileCartTotal) mobileCartTotal.textContent = formatBRL(totalInvestmentConsidered);\
\
        // ===== MOBILE LIST CARDS (compactos) =====\
        const mobileList = document.getElementById("mobileSelectedPrograms");\
        if (mobileList) \{\
          mobileList.innerHTML = "";\
          if (listAlloc.length === 0) \{\
            mobileList.innerHTML = `<div class="text-center text-sm text-zinc-500">Nenhum programa adicionado ao plano.</div>`;\
          \} else \{\
            byEm.forEach((items, emissoraId) => \{\
              const bloco = document.createElement("div");\
              bloco.innerHTML = `<h4 class="text-base font-bold mb-2">$\{emHeader(emissoraId)\}</h4>`;\
              const groupList = document.createElement("div");\
              groupList.className = "space-y-2 mb-4";\
              bloco.appendChild(groupList);\
              mobileList.appendChild(bloco);\
\
              items.forEach(p => \{\
                const vFull = p.valorFull || 0;\
                const vHalf = p.valorConsiderado || 0;\
                const alcance = parseIntLocale(p.alcance);\
                const insercoes = Math.max(0, parseInt(p.insercoes || 0, 10));\
                const investConsiderado = insercoes * vHalf;\
                const investCheio = insercoes * vFull;\
\
                const horariosLinha = (p.horarioInicio || p.horarioFim)\
                  ? `<p class="text-[12px] text-zinc-600 whitespace-nowrap">Hor\'e1rio: $\{p.horarioInicio || "-"\} \'96 $\{p.horarioFim || "-"\}</p>` : "";\
\
                const item = document.createElement("div");\
                item.className = "bg-zinc-50 border border-zinc-200 rounded-xl p-3 grid grid-cols-12 items-center gap-3";\
                item.innerHTML = `\
                  <div class="col-span-7 min-w-0">\
                    <p class="font-medium truncate" title="$\{p.nomePrograma\}">$\{p.nomePrograma\}</p>\
                    $\{horariosLinha\}\
                    <div class="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-zinc-600 mt-1">\
                      <span class="whitespace-nowrap">V. 100%: R$ $\{formatBRL(vFull)\}</span>\
                      <span class="whitespace-nowrap">V. $SAL: R$ $\{formatBRL(vHalf)\}</span>\
                      <span class="whitespace-nowrap">Alcance: $\{alcance.toLocaleString("pt-BR")\}</span>\
                    </div>\
                  </div>\
                  <div class="col-span-5 flex items-center justify-end gap-2">\
                    <button class="btn-remove p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white" title="Remover" aria-label="Remover">\
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">\
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a2 2 0 012-2h3a2 2 0 012 2v2" />\
                      </svg>\
                    </button>\
                    <div class="text-right">\
                      <div class="flex items-center justify-end">\
                        <button class="btn-minus px-2 py-1 bg-zinc-200 rounded-l hover:bg-zinc-300" title="Diminuir">-</button>\
                        <input type="number" min="0" value="$\{insercoes\}" class="qty-input w-14 text-center rounded bg-zinc-100 text-zinc-900 border-0" />\
                        <button class="btn-plus px-2 py-1 bg-zinc-200 rounded-r hover:bg-zinc-300" title="Aumentar">+</button>\
                      </div>\
                      <div class="mt-1 text-[11px] leading-tight text-zinc-600">\
                        <div class="whitespace-nowrap">Total ($SAL): R$ $\{formatBRL(investConsiderado)\}</div>\
                        <div class="whitespace-nowrap">Total (100%): R$ $\{formatBRL(investCheio)\}</div>\
                      </div>\
                    </div>\
                  </div>\
                `;\
\
                const btnRemove = item.querySelector(".btn-remove");\
                const btnMenos  = item.querySelector(".btn-minus");\
                const inputQty  = item.querySelector(".qty-input");\
                const btnMais   = item.querySelector(".btn-plus");\
\
                btnRemove.onclick = () => removeProgram(p.emissoraId, p.programaId);\
                btnMenos.onclick  = () => \{ const v = Math.max(0, parseInt(inputQty.value||"0",10)-1); inputQty.value=v; applyManualOverride(p.emissoraId,p.programaId,v); \};\
                btnMais.onclick   = () => \{ const v = Math.max(0, parseInt(inputQty.value||"0",10)+1); inputQty.value=v; applyManualOverride(p.emissoraId,p.programaId,v); \};\
                inputQty.onchange = () => \{ let v=parseInt(inputQty.value||"0",10); if(isNaN(v)||v<0) v=0; inputQty.value=v; applyManualOverride(p.emissoraId,p.programaId,v); \};\
\
                groupList.appendChild(item);\
              \});\
            \});\
          \}\
        \}\
\
        // Mostrar aviso de taxa (desktop): logo acima do bot\'e3o Enviar Plano\
        ensureTrafficFeeNotes();\
      \}\
\
      function applyManualOverride(emissoraId, programaId, newInsertions) \{\
        const k = keyFor(emissoraId, programaId);\
        const it = selectedMap.get(k);\
        if (!it) return;\
        it.manualQty = Math.max(0, parseInt(newInsertions || 0, 10));\
        selectedMap.set(k, it);\
        autoAllocateAndRender('manual');\
        saveStateDebounced();\
      \}\
\
      const budgetInput = document.getElementById("totalBudget");\
      function maskBudgetInput(e) \{\
        const digits = onlyDigits(e.target.value);\
        e.target.value = formatThousandsInt(digits);\
        autoAllocateAndRender('auto');\
        saveStateDebounced();\
      \}\
      budgetInput.addEventListener("input", maskBudgetInput);\
      budgetInput.addEventListener("blur", maskBudgetInput);\
\
      const openCartBtn = document.getElementById("openCartBtn");\
      const closeCartBtn = document.getElementById("closeCartBtn");\
      const cartOverlay = document.getElementById("cartOverlay");\
      const overlayBg = document.getElementById("overlayBg");\
      const cartSheet = document.getElementById("cartSheet");\
\
      function openCart() \{\
        if (!cartOverlay) return;\
        renderSelected(getCurrentAlloc());\
        cartOverlay.classList.remove("hidden");\
        cartSheet.style.transform = "translateY(100%)";\
        requestAnimationFrame(() => \{\
          cartSheet.style.transition = "transform 200ms ease-out";\
          cartSheet.style.transform = "translateY(0)";\
        \});\
      \}\
      function closeCart() \{\
        if (!cartOverlay) return;\
        cartSheet.style.transform = "translateY(100%)";\
        setTimeout(() => \{\
          cartOverlay.classList.add("hidden");\
          cartSheet.style.transition = "";\
          cartSheet.style.transform = "";\
        \}, 200);\
      \}\
      if (openCartBtn) openCartBtn.addEventListener("click", openCart);\
      if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);\
      if (overlayBg) overlayBg.addEventListener("click", closeCart);\
\
      loadData();\
    </script>\
\
    <!-- ===== SCRIPT DE ENVIO (WEBAPP_URL + BOT\'d5ES) ===== -->\
    <script>\
      const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbx5dgzbTX-9QcKva8-EbUFCvRHZjRlBef_FvGOuBQaAtAJ0D8fKjE46byKLbISQD3sY/exec";\
\
      function emissoraNomeById(id) \{\
        try \{ return (data.emissoras.find(e => e.ID === id)?.Emissora) || id || ''; \}\
        catch \{ return id || ''; \}\
      \}\
\
      function askRequiredEmail(defaultVal="") \{\
        while (true) \{\
          const v = window.prompt("E-mail para contato (obrigat\'f3rio):", defaultVal);\
          if (v === null) return null;\
          const s = (v || "").trim();\
          if (/^[^\\s@]+@[^\\s@]+\\.[^\\s@]\{2,\}$/i.test(s)) return s;\
          alert("Informe um e-mail v\'e1lido. Ex.: nome@empresa.com");\
        \}\
      \}\
\
      function buildPlanPayload() \{\
        const alloc = getCurrentAlloc();\
        const orcamento = parseMaskedBudget(document.getElementById("totalBudget").value);\
        const regiao = selectedRegion || '';\
        const emissoraId = selectedBroadcaster || '';\
        const emissoraNome = emissoraNomeById(emissoraId);\
        const pracaNome = pracaNomeByEmissoraId(emissoraId);\
\
        let totalInvestmentConsidered = 0, totalInvestmentFull = 0;\
        let totalReach = 0, totalInsertions = 0, sumCpmConsideredTimesQty = 0, sumCpmFullTimesQty = 0;\
\
        alloc.forEach(p => \{\
          const vFull = p.valorFull || 0;\
          const vHalf = p.valorConsiderado || 0;\
          const alcance = parseIntLocale(p.alcance);\
          const qtd = Math.max(0, parseInt(p.insercoes || 0, 10));\
\
          totalInvestmentFull += qtd * vFull;\
          totalInvestmentConsidered += qtd * vHalf;\
          totalReach += alcance * qtd;\
          totalInsertions += qtd;\
\
          const cpmUnitConsidered = (alcance > 0 && vHalf > 0) ? (vHalf / alcance) * 1000 : 0;\
          const cpmUnitFull = (alcance > 0 && vFull > 0) ? (vFull / alcance) * 1000 : 0;\
          sumCpmConsideredTimesQty += cpmUnitConsidered * qtd;\
          sumCpmFullTimesQty += cpmUnitFull * qtd;\
        \});\
\
        const cpmConsidered = totalInsertions > 0 ? (sumCpmConsideredTimesQty / totalInsertions) : 0;\
        const cpmFull = totalInsertions > 0 ? (sumCpmFullTimesQty / totalInsertions) : 0;\
\
        const empresa = window.prompt("Qual \'e9 o nome da sua empresa?", "") || "";\
        const contatoEmail = askRequiredEmail();\
        if (contatoEmail === null) return null;\
        const contatoTelefone = window.prompt("Telefone/WhatsApp:", "") || "";\
\
        const itens = alloc\
          .filter(p => (p.insercoes || 0) > 0)\
          .map(p => (\{\
            programaId: p.programaId,\
            programaNome: p.nomePrograma,\
            insercoes: p.insercoes,\
            valorFull: p.valorFull || 0,\
            valorConsiderado: p.valorConsiderado || 0,\
            alcance: parseIntLocale(p.alcance),\
            horarioInicio: p.horarioInicio || "",\
            horarioFim: p.horarioFim || ""\
          \}));\
\
        const planId = `$\{Date.now()\}-$\{Math.random().toString(36).slice(2,8)\}`;\
\
        return \{\
          planId,\
          empresa, contatoEmail, contatoTelefone,\
          regiao, emissoraId, emissoraNome,\
          pracaNome, // inclu\'eddo\
          orcamento,\
          salPriceBRL,\
          totais: \{\
            totalInvestmentConsidered,\
            totalInvestmentFull,\
            totalReach,\
            totalInsertions,\
            cpmConsidered,\
            cpmFull\
          \},\
          itens\
        \};\
      \}\
\
      async function sendPlan() \{\
        const btn = document.querySelector('#cartOverlay .w-full.bg-blue-600, button.enviarPlanoDesktop');\
        try \{\
          const payload = buildPlanPayload();\
\
          if (!payload) \{\
            if (btn) \{ btn.disabled = false; btn.textContent = "Avan\'e7ar"; \}\
            alert("Envio cancelado: o e-mail \'e9 obrigat\'f3rio.");\
            return;\
          \}\
\
          if (!payload.regiao || !payload.emissoraId) \{\
            alert("Selecione a regi\'e3o e a emissora antes de enviar.");\
            return;\
          \}\
\
          const somaInser = payload.itens.reduce((acc, it) => acc + (parseInt(it.insercoes||0,10)), 0);\
          if (somaInser <= 0) \{\
            alert("Defina pelo menos 1 inser\'e7\'e3o em algum programa antes de enviar.");\
            return;\
          \}\
\
          if (!payload.contatoEmail || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]\{2,\}$/i.test(payload.contatoEmail)) \{\
            alert("Informe um e-mail v\'e1lido para prosseguir.");\
            return;\
          \}\
\
          if (!payload.itens || payload.itens.length === 0) \{\
            alert("Adicione pelo menos um programa ao plano antes de enviar.");\
            return;\
          \}\
          if (!WEBAPP_URL) \{\
            alert("WEBAPP_URL vazia.");\
            return;\
          \}\
\
          if (btn) \{ btn.disabled = true; btn.textContent = "Enviando..."; \}\
\
          const res = await fetch(WEBAPP_URL, \{\
            method: "POST",\
            body: new URLSearchParams(\{ payload: JSON.stringify(payload) \})\
          \});\
          const raw = await res.text();\
          let j; try \{ j = JSON.parse(raw); \} catch \{\}\
          if (j?.ok) \{\
            alert("Plano enviado com sucesso! \uc0\u9989 ");\
          \} else \{\
            alert("N\'e3o foi poss\'edvel enviar o plano.\\n" + (j?.error || `Status $\{res.status\}`));\
          \}\
        \} catch (e) \{\
          console.error("[sendPlan] erro inesperado:", e);\
          alert("Erro ao enviar o plano. Veja o console para detalhes.");\
        \} finally \{\
          if (btn) \{ btn.disabled = false; btn.textContent = "Avan\'e7ar"; \}\
        \}\
      \}\
\
      // Mobile: ligar bot\'e3o "Avan\'e7ar"\
      function wireSendButton() \{\
        const mobileSendBtn = document.querySelector('#cartOverlay .w-full.bg-blue-600');\
        if (mobileSendBtn && !mobileSendBtn.dataset.wired) \{\
          const note = document.getElementById('mobileTrafficFeeNote');\
          if (note) note.classList.remove('hidden');\
\
          mobileSendBtn.addEventListener('click', sendPlan);\
          mobileSendBtn.dataset.wired = '1';\
        \}\
      \}\
      if (document.readyState === 'loading') \{\
        document.addEventListener('DOMContentLoaded', wireSendButton);\
      \} else \{\
        wireSendButton();\
      \}\
\
      // Desktop: injetar bot\'e3o "Enviar Plano" + aviso amarelo acima\
      function ensureDesktopSendButton() \{\
        const selected = document.getElementById('selectedPrograms');\
        const desktopTotalsBox = selected ? selected.closest('div.space-y-6') : null;\
        if (!desktopTotalsBox) return;\
\
        // aviso amarelo\
        if (!desktopTotalsBox.querySelector('#desktopTrafficFeeNote')) \{\
          const warn = document.createElement('div');\
          warn.id = 'desktopTrafficFeeNote';\
          warn.className = 'rounded-lg p-3 text-[12px] leading-snug';\
          warn.style.background = '#FFF8CC';\
          warn.style.color = '#111';\
          warn.textContent = 'Algumas emissoras possuem taxa de tr\'e1fego, e o valor ser\'e1 adicionado ao final da compra';\
          desktopTotalsBox.appendChild(warn);\
        \}\
\
        // bot\'e3o Enviar\
        if (!desktopTotalsBox.querySelector('button.enviarPlanoDesktop')) \{\
          const b = document.createElement('button');\
          b.className = 'enviarPlanoDesktop mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-xl w-full';\
          b.textContent = 'Enviar Plano';\
          b.onclick = sendPlan;\
          desktopTotalsBox.appendChild(b);\
        \}\
      \}\
      if (document.readyState === 'loading') \{\
        document.addEventListener('DOMContentLoaded', ensureDesktopSendButton);\
      \} else \{\
        ensureDesktopSendButton();\
      \}\
\
      // Garante que os avisos/bot\'f5es existam ap\'f3s cada render\
      function ensureTrafficFeeNotes() \{\
        ensureDesktopSendButton();\
        const note = document.getElementById('mobileTrafficFeeNote');\
        if (note) note.classList.remove('hidden');\
        wireSendButton(); // garante que o bot\'e3o mobile esteja \'93wireado\'94\
      \}\
    </script>\
  </body>\
</html>\
\
}