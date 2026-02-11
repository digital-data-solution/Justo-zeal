// =============================================================================
// JUSTO ZEAL - scripts.js
// Pure frontend: PDF quote download + Tawk.to admin biodata push
// No backend / SendGrid required
// =============================================================================

// ---------------------------------------------------------------------------
// HIKVISION PRODUCT PRICING
// ---------------------------------------------------------------------------
const HIKVISION_CAMERAS = {
    'HIKVISION 2MP DOME (DS-2CE76D0T-EXIPF)':                                   12075,
    'HIKVISION 2MP BULLET (DS-2CE16D0T-EXIPF)':                                 12075,
    'HIKVISION 2MP TWO-WAY AUDIO & SIREN PT CAMERA (DS-2CE70D0T-PTLTS)':        51750,
    '2MP SMART HYBRID LIGHT BULLET (DS-2CE16DOT-LPFS)':                         25300,
    '2MP SMART HYBRID LIGHT DOME (DS-2CE76DOT-LPFS)':                           28750,
    '2MP IP SMART HYBRID LIGHT BULLET (DS-2CD1023G2-LIU / LIUF)':               54050,
    '2MP IP SMART HYBRID LIGHT DOME (DS-2CD1123G2-LIU / DS-2CD1323G2-LIUF)':    54050,
    '2MP IP BULLET NON-AUDIO (DS-2CD1021G0-I)':                                 41400,
    '2MP IP DOME NON-AUDIO (DS-2CD1121-I)':                                     41400,
    'HIKVISION 4MP DOME SMART HYBRID LIGHT CAMERA':                              80500,
    '2MP IP COLOURVU DOME (DS-2CD1327G2-L)':                                    60950
};

const HIKVISION_DVRS = {
    '4CH DVR 1080P':                                     41400,
    '4CH DVR 3K/5MP (iDS-7204HQHI-M1/S)':               71300,
    '4CH 1080P ACUSENSE DVR (iDS-7204HQHI-M1/XT)':       89700,
    '8CH DVR 3K/5MP (iDS-7208HQHI-M1/S)':               97750,
    '8CH 3K/5MP ACUSENSE DVR (iDS-7208HQHI-M1/XT)':     132825,
    '16CH DVR 1080P (DS-7216HGHI-M1)':                  102350,
    '16CH DVR 3K/5MP (iDS-7216HQHI-M1/E)':              166750,
    '32CH DVR 1080P (DS-7232HGHI-M2)':                  281750,
    '32CH DVR 3K/5MP (iDS-7232HQHI-M2/S)':              377200
};

const HIKVISION_NVRS = {
    '8CH NVR 1 SATA (DS-7108NI-Q1/8P/M)':               129950,
    '16CH NVR 2 SATA (DS-7616NI-Q2/16P)':               301300,
    '32CH NVR ACUSENSE POE (DS-7632NXI-K2/16P)':         495075,
    '32CH NVR ACUSENSE NON-POE (DS-7632NXI-K2)':         281750
};

const HIKVISION_PTZ = {
    '2MP TANDEMVU COLOURVU PTZ (DS-2SE4C225MWG-E)': 460000,
    '2MP HD PTZ (DS-2DE4225TI-D)':                  391000
};

const HIKVISION_POWER_SUPPLIES = {
    'HIKVISION 4-WAY POWER SUPPLY':  10925,
    'HIKVISION 8-WAY POWER SUPPLY':  14375,
    'HIKVISION 16-WAY POWER SUPPLY': 23000
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
function fmt(num) {
    return '₦' + Number(num || 0).toLocaleString('en-NG');
}

function toggleLoadingOverlay(show) {
    const el = document.getElementById('loading-overlay');
    if (el) el.style.display = show ? 'flex' : 'none';
}

function showStatus(msg, type) {
    // type: 'success' | 'error' | 'info'
    const el = document.getElementById('status-message');
    if (!el) return;
    el.className = 'p-4 mb-6 rounded-xl font-semibold text-center';
    if (type === 'success') el.classList.add('bg-green-100', 'text-green-800');
    else if (type === 'error') el.classList.add('bg-red-100', 'text-red-800');
    else el.classList.add('bg-yellow-100', 'text-yellow-800');
    el.textContent = msg;
    el.classList.remove('hidden');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ---------------------------------------------------------------------------
// MOBILE MENU
// ---------------------------------------------------------------------------
window.toggleMobileMenu = function () {
    const menu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const isActive = menu.classList.toggle('active');
    menuIcon.classList.toggle('hidden', isActive);
    closeIcon.classList.toggle('hidden', !isActive);
};

window.closeMobileMenu = function () {
    const menu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }
};

// ---------------------------------------------------------------------------
// DYNAMIC FORM FIELDS — CCTV now has full Hikvision dropdowns
// ---------------------------------------------------------------------------
window.updateFormFields = function () {
    const type = document.getElementById('project_type')?.value;
    const container = document.getElementById('dynamic-fields');
    if (!container) return;
    container.innerHTML = '';

    if (type === 'Solar/Inverter') {
        container.innerHTML = `
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="kva" class="block text-sm font-medium text-gray-700 mb-1">kVA Required</label>
              <input type="number" id="kva" name="kVA Required" min="0" step="0.5"
                     placeholder="e.g., 5" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label for="batteries" class="block text-sm font-medium text-gray-700 mb-1">Number of Batteries</label>
              <input type="number" id="batteries" name="Number of Batteries" min="0"
                     placeholder="e.g., 4" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label for="panels" class="block text-sm font-medium text-gray-700 mb-1">Solar Panels (Optional)</label>
              <input type="number" id="panels" name="Number of Solar Panels" min="0"
                     placeholder="e.g., 8" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
          </div>`;

    } else if (type === 'Smart Home') {
        container.innerHTML = `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="rooms" class="block text-sm font-medium text-gray-700 mb-1">Rooms for Automation</label>
              <input type="number" id="rooms" name="Rooms for Automation" min="0"
                     placeholder="e.g., 4" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label for="devices" class="block text-sm font-medium text-gray-700 mb-1">Devices to Automate</label>
              <input type="text" id="devices" name="Type of Devices to Automate"
                     placeholder="e.g., Lights, AC, Curtains" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
          </div>`;

    } else if (type === 'CCTV/Security') {

        // ── Camera options — grouped by technology type for easy reading ──
        const cameraOptions = `
          <optgroup label="📷 Analogue Cameras (Wired, cost-effective)">
            <option value="HIKVISION 2MP DOME (DS-2CE76D0T-EXIPF)">2MP Dome — Indoor/Outdoor, Basic, Wide Angle · ${fmt(12075)}</option>
            <option value="HIKVISION 2MP BULLET (DS-2CE16D0T-EXIPF)">2MP Bullet — Outdoor, Long-Range, Weatherproof · ${fmt(12075)}</option>
            <option value="2MP SMART HYBRID LIGHT BULLET (DS-2CE16DOT-LPFS)">2MP Smart Hybrid Bullet — Colour Night Vision, Outdoor · ${fmt(25300)}</option>
            <option value="2MP SMART HYBRID LIGHT DOME (DS-2CE76DOT-LPFS)">2MP Smart Hybrid Dome — Colour Night Vision, Indoor/Outdoor · ${fmt(28750)}</option>
            <option value="HIKVISION 2MP TWO-WAY AUDIO & SIREN PT CAMERA (DS-2CE70D0T-PTLTS)">2MP Audio + Siren PT Camera — Pan/Tilt, Two-Way Audio, Alarm · ${fmt(51750)}</option>
          </optgroup>
          <optgroup label="🌐 IP / Network Cameras (Higher quality, PoE)">
            <option value="2MP IP BULLET NON-AUDIO (DS-2CD1021G0-I)">2MP IP Bullet — Outdoor, IR Night Vision, No Audio · ${fmt(41400)}</option>
            <option value="2MP IP DOME NON-AUDIO (DS-2CD1121-I)">2MP IP Dome — Indoor/Outdoor, IR Night Vision, No Audio · ${fmt(41400)}</option>
            <option value="2MP IP SMART HYBRID LIGHT BULLET (DS-2CD1023G2-LIU / LIUF)">2MP IP Smart Hybrid Bullet — Full Colour Night, Audio · ${fmt(54050)}</option>
            <option value="2MP IP SMART HYBRID LIGHT DOME (DS-2CD1123G2-LIU / DS-2CD1323G2-LIUF)">2MP IP Smart Hybrid Dome — Full Colour Night, Audio · ${fmt(54050)}</option>
            <option value="2MP IP COLOURVU DOME (DS-2CD1327G2-L)">2MP IP ColourVu Dome — 24/7 Full Colour, No IR · ${fmt(60950)}</option>
            <option value="HIKVISION 4MP DOME SMART HYBRID LIGHT CAMERA">4MP Dome Smart Hybrid — Ultra Sharp, Colour Night Vision · ${fmt(80500)}</option>
          </optgroup>`;

        // ── DVR options — grouped by channel size ──
        const dvrOptions = `
          <optgroup label="📹 4-Channel DVR (Up to 4 cameras)">
            <option value="4CH DVR 1080P">4-Channel 1080P DVR — Standard HD Recording · ${fmt(41400)}</option>
            <option value="4CH DVR 3K/5MP (iDS-7204HQHI-M1/S)">4-Channel 3K/5MP DVR — High Resolution Recording · ${fmt(71300)}</option>
            <option value="4CH 1080P ACUSENSE DVR (iDS-7204HQHI-M1/XT)">4-Channel 1080P AcuSense DVR — Smart AI Detection · ${fmt(89700)}</option>
          </optgroup>
          <optgroup label="📹 8-Channel DVR (Up to 8 cameras)">
            <option value="8CH DVR 3K/5MP (iDS-7208HQHI-M1/S)">8-Channel 3K/5MP DVR — High Resolution Recording · ${fmt(97750)}</option>
            <option value="8CH 3K/5MP ACUSENSE DVR (iDS-7208HQHI-M1/XT)">8-Channel 3K/5MP AcuSense DVR — Smart AI Detection · ${fmt(132825)}</option>
          </optgroup>
          <optgroup label="📹 16-Channel DVR (Up to 16 cameras)">
            <option value="16CH DVR 1080P (DS-7216HGHI-M1)">16-Channel 1080P DVR — Standard HD Recording · ${fmt(102350)}</option>
            <option value="16CH DVR 3K/5MP (iDS-7216HQHI-M1/E)">16-Channel 3K/5MP DVR — High Resolution Recording · ${fmt(166750)}</option>
          </optgroup>
          <optgroup label="📹 32-Channel DVR (Up to 32 cameras)">
            <option value="32CH DVR 1080P (DS-7232HGHI-M2)">32-Channel 1080P DVR — Large Site, Standard HD · ${fmt(281750)}</option>
            <option value="32CH DVR 3K/5MP (iDS-7232HQHI-M2/S)">32-Channel 3K/5MP DVR — Large Site, High Resolution · ${fmt(377200)}</option>
          </optgroup>`;

        // ── NVR options — grouped by channel size ──
        const nvrOptions = `
          <optgroup label="🖥️ 8-Channel NVR (Up to 8 IP cameras)">
            <option value="8CH NVR 1 SATA (DS-7108NI-Q1/8P/M)">8-Channel NVR with PoE — Powers cameras via cable, 1 Hard Drive Bay · ${fmt(129950)}</option>
          </optgroup>
          <optgroup label="🖥️ 16-Channel NVR (Up to 16 IP cameras)">
            <option value="16CH NVR 2 SATA (DS-7616NI-Q2/16P)">16-Channel NVR with PoE — Powers cameras via cable, 2 Hard Drive Bays · ${fmt(301300)}</option>
          </optgroup>
          <optgroup label="🖥️ 32-Channel NVR (Up to 32 IP cameras)">
            <option value="32CH NVR ACUSENSE NON-POE (DS-7632NXI-K2)">32-Channel AcuSense NVR — Smart AI, No PoE, 2 Hard Drive Bays · ${fmt(281750)}</option>
            <option value="32CH NVR ACUSENSE POE (DS-7632NXI-K2/16P)">32-Channel AcuSense NVR with PoE — Smart AI, Powers cameras via cable · ${fmt(495075)}</option>
          </optgroup>`;

        // ── PTZ options ──
        const ptzOptions = `
          <optgroup label="🔄 PTZ Cameras (Remote pan, tilt & zoom control)">
            <option value="2MP HD PTZ (DS-2DE4225TI-D)">2MP HD PTZ — 25× Optical Zoom, IR Night Vision, Remote Control · ${fmt(391000)}</option>
            <option value="2MP TANDEMVU COLOURVU PTZ (DS-2SE4C225MWG-E)">2MP TandemVu ColourVu PTZ — Dual Lens, Full Colour + Zoom Simultaneously · ${fmt(460000)}</option>
          </optgroup>`;

        // ── Power Supply options ──
        const psOptions = `
          <optgroup label="⚡ Camera Power Supplies">
            <option value="HIKVISION 4-WAY POWER SUPPLY">4-Way Power Supply — Powers up to 4 cameras from one unit · ${fmt(10925)}</option>
            <option value="HIKVISION 8-WAY POWER SUPPLY">8-Way Power Supply — Powers up to 8 cameras from one unit · ${fmt(14375)}</option>
            <option value="HIKVISION 16-WAY POWER SUPPLY">16-Way Power Supply — Powers up to 16 cameras from one unit · ${fmt(23000)}</option>
          </optgroup>`;

        container.innerHTML = `
          <!-- Helper tip -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            💡 <strong>Not sure what to pick?</strong> Dome cameras suit indoor/ceiling use. Bullet cameras are best outdoors. 
            DVR = for analogue cameras. NVR = for IP/network cameras. Use the chat button if you need help choosing.
          </div>

          <!-- Camera rows -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              📷 Camera Model &amp; Quantity
              <span class="font-normal text-gray-500 ml-1">(select each model you need, set quantity)</span>
            </label>
            <div id="camera-rows" class="space-y-3">
              <div class="camera-row flex gap-2 items-start">
                <select name="camera_model_0"
                        class="flex-1 px-3 py-3 border border-gray-300 rounded-lg bg-white text-sm"
                        onchange="updateLiveTotal()">
                  <option value="">— Choose a Camera Model —</option>
                  ${cameraOptions}
                </select>
                <div class="flex flex-col items-center gap-1">
                  <label class="text-xs text-gray-500">Qty</label>
                  <input type="number" name="camera_qty_0" min="1" value="1"
                         class="w-16 px-2 py-3 border border-gray-300 rounded-lg text-sm text-center"
                         oninput="updateLiveTotal()">
                </div>
              </div>
            </div>
            <button type="button" onclick="addCameraRow()"
                    class="mt-3 text-sm text-orange-600 hover:text-orange-800 font-semibold underline">
              + Add Another Camera Model
            </button>
          </div>

          <!-- Recorder selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="dvr_model" class="block text-sm font-semibold text-gray-700 mb-1">
                📹 DVR — Digital Video Recorder
                <span class="block font-normal text-gray-500 text-xs">For analogue/HDTVI cameras · leave blank if using NVR</span>
              </label>
              <select id="dvr_model" name="DVR Model"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm"
                      onchange="updateLiveTotal()">
                <option value="">— I don't need a DVR —</option>
                ${dvrOptions}
              </select>
            </div>
            <div>
              <label for="nvr_model" class="block text-sm font-semibold text-gray-700 mb-1">
                🖥️ NVR — Network Video Recorder
                <span class="block font-normal text-gray-500 text-xs">For IP/PoE cameras · leave blank if using DVR</span>
              </label>
              <select id="nvr_model" name="NVR Model"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm"
                      onchange="updateLiveTotal()">
                <option value="">— I don't need an NVR —</option>
                ${nvrOptions}
              </select>
            </div>
          </div>

          <!-- PTZ & Power Supply -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="ptz_model" class="block text-sm font-semibold text-gray-700 mb-1">
                🔄 PTZ Camera (Optional)
                <span class="block font-normal text-gray-500 text-xs">Pan/Tilt/Zoom — remotely steerable camera</span>
              </label>
              <select id="ptz_model" name="PTZ Model"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm"
                      onchange="updateLiveTotal()">
                <option value="">— No PTZ Camera —</option>
                ${ptzOptions}
              </select>
            </div>
            <div>
              <label for="ps_model" class="block text-sm font-semibold text-gray-700 mb-1">
                ⚡ Camera Power Supply (Optional)
                <span class="block font-normal text-gray-500 text-xs">Centralised power unit for analogue cameras</span>
              </label>
              <select id="ps_model" name="Power Supply Model"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm"
                      onchange="updateLiveTotal()">
                <option value="">— No Power Supply Needed —</option>
                ${psOptions}
              </select>
            </div>
          </div>

          <!-- Alarm add-on -->
          <div>
            <label for="security_type" class="block text-sm font-semibold text-gray-700 mb-1">
              🚨 Alarm / Integrated Security (Optional)
              <span class="block font-normal text-gray-500 text-xs">Add a burglar alarm or full integrated system on top of CCTV</span>
            </label>
            <select id="security_type" name="Security System Type"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                    onchange="updateLiveTotal()">
              <option value="">— CCTV Only, No Alarm Needed —</option>
              <option value="Alarm">🔔 Alarm System Only — Motion sensors, sirens &amp; control panel · ${fmt(200000)}</option>
              <option value="Integrated">🔐 Integrated CCTV + Alarm — Full surveillance &amp; alarm bundle · ${fmt(300000)}</option>
            </select>
          </div>`;

    } else if (type === 'Electrical Wiring') {
        container.innerHTML = `
          <div>
            <label for="building_size" class="block text-sm font-medium text-gray-700 mb-1">Building Size</label>
            <input type="text" id="building_size" name="Building Size"
                   placeholder="e.g., 4 (rooms) or 3-bedroom duplex"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg">
          </div>`;

    } else if (type === 'Multiple') {
        container.innerHTML = `
          <p class="text-sm text-orange-700 font-semibold p-3 bg-orange-50 rounded-lg border border-orange-200">
            ⚠️ Please describe ALL services needed in the Project Details box below (Solar, Smart Home, CCTV, etc.)
          </p>`;
    }

    // Recalculate live total whenever a field changes
    container.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('change', updateLiveTotal);
        el.addEventListener('input', updateLiveTotal);
    });
    updateLiveTotal();
};

// Add extra camera row
window.addCameraRow = function () {
    const cameraOptions = `
      <optgroup label="📷 Analogue Cameras (Wired, cost-effective)">
        <option value="HIKVISION 2MP DOME (DS-2CE76D0T-EXIPF)">2MP Dome — Indoor/Outdoor, Basic, Wide Angle · ${fmt(12075)}</option>
        <option value="HIKVISION 2MP BULLET (DS-2CE16D0T-EXIPF)">2MP Bullet — Outdoor, Long-Range, Weatherproof · ${fmt(12075)}</option>
        <option value="2MP SMART HYBRID LIGHT BULLET (DS-2CE16DOT-LPFS)">2MP Smart Hybrid Bullet — Colour Night Vision, Outdoor · ${fmt(25300)}</option>
        <option value="2MP SMART HYBRID LIGHT DOME (DS-2CE76DOT-LPFS)">2MP Smart Hybrid Dome — Colour Night Vision, Indoor/Outdoor · ${fmt(28750)}</option>
        <option value="HIKVISION 2MP TWO-WAY AUDIO & SIREN PT CAMERA (DS-2CE70D0T-PTLTS)">2MP Audio + Siren PT Camera — Pan/Tilt, Two-Way Audio, Alarm · ${fmt(51750)}</option>
      </optgroup>
      <optgroup label="🌐 IP / Network Cameras (Higher quality, PoE)">
        <option value="2MP IP BULLET NON-AUDIO (DS-2CD1021G0-I)">2MP IP Bullet — Outdoor, IR Night Vision, No Audio · ${fmt(41400)}</option>
        <option value="2MP IP DOME NON-AUDIO (DS-2CD1121-I)">2MP IP Dome — Indoor/Outdoor, IR Night Vision, No Audio · ${fmt(41400)}</option>
        <option value="2MP IP SMART HYBRID LIGHT BULLET (DS-2CD1023G2-LIU / LIUF)">2MP IP Smart Hybrid Bullet — Full Colour Night, Audio · ${fmt(54050)}</option>
        <option value="2MP IP SMART HYBRID LIGHT DOME (DS-2CD1123G2-LIU / DS-2CD1323G2-LIUF)">2MP IP Smart Hybrid Dome — Full Colour Night, Audio · ${fmt(54050)}</option>
        <option value="2MP IP COLOURVU DOME (DS-2CD1327G2-L)">2MP IP ColourVu Dome — 24/7 Full Colour, No IR · ${fmt(60950)}</option>
        <option value="HIKVISION 4MP DOME SMART HYBRID LIGHT CAMERA">4MP Dome Smart Hybrid — Ultra Sharp, Colour Night Vision · ${fmt(80500)}</option>
      </optgroup>`;
    const rows = document.getElementById('camera-rows');
    if (!rows) return;
    const idx = rows.children.length;
    const div = document.createElement('div');
    div.className = 'camera-row flex gap-2 items-start';
    div.innerHTML = `
      <select name="camera_model_${idx}"
              class="flex-1 px-3 py-3 border border-gray-300 rounded-lg bg-white text-sm"
              onchange="updateLiveTotal()">
        <option value="">— Choose a Camera Model —</option>
        ${cameraOptions}
      </select>
      <div class="flex flex-col items-center gap-1">
        <label class="text-xs text-gray-500">Qty</label>
        <input type="number" name="camera_qty_${idx}" min="1" value="1"
               class="w-16 px-2 py-3 border border-gray-300 rounded-lg text-sm text-center"
               oninput="updateLiveTotal()">
      </div>
      <button type="button" onclick="this.closest('.camera-row').remove(); updateLiveTotal();"
              class="mt-6 text-red-500 hover:text-red-700 font-bold text-xl leading-none" title="Remove">✕</button>`;
    rows.appendChild(div);
    div.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('change', updateLiveTotal);
        el.addEventListener('input', updateLiveTotal);
    });
};

// ---------------------------------------------------------------------------
// LIVE TOTAL DISPLAY
// ---------------------------------------------------------------------------
function updateLiveTotal() {
    const result = calculateLineItems();
    let liveEl = document.getElementById('live-total');
    if (!liveEl) {
        liveEl = document.createElement('div');
        liveEl.id = 'live-total';
        liveEl.className = 'mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl text-right font-bold text-orange-700 text-lg';
        const dynFields = document.getElementById('dynamic-fields');
        if (dynFields) dynFields.appendChild(liveEl);
    }
    if (result.subtotal > 0) {
        liveEl.innerHTML = `Estimated Total: <span class="text-2xl">${fmt(result.subtotal)}</span>`;
        liveEl.classList.remove('hidden');
    } else {
        liveEl.classList.add('hidden');
    }
}

// ---------------------------------------------------------------------------
// CORE CALCULATION — returns { subtotal, lineItems }
// ---------------------------------------------------------------------------
function calculateLineItems() {
    const projectType = document.getElementById('project_type')?.value || '';
    let subtotal = 0;
    let lineItems = [];

    if (projectType === 'Solar/Inverter') {
        const kva      = parseFloat(document.querySelector('[name="kVA Required"]')?.value) || 0;
        const batteries= parseInt(document.querySelector('[name="Number of Batteries"]')?.value) || 0;
        const panels   = parseInt(document.querySelector('[name="Number of Solar Panels"]')?.value) || 0;
        const kvaCost  = kva * 350000;
        const batCost  = batteries * 200000;
        const panCost  = panels * 100000;
        subtotal = kvaCost + batCost + panCost;
        if (kvaCost  > 0) lineItems.push({ desc: `Solar System (${kva} kVA)`,          qty: kva,       price: 350000, total: kvaCost });
        if (batCost  > 0) lineItems.push({ desc: `Batteries (${batteries} units)`,      qty: batteries, price: 200000, total: batCost });
        if (panCost  > 0) lineItems.push({ desc: `Solar Panels (${panels} units)`,      qty: panels,    price: 100000, total: panCost });

    } else if (projectType === 'Smart Home') {
        const rooms   = parseInt(document.querySelector('[name="Rooms for Automation"]')?.value) || 0;
        const devices = document.querySelector('[name="Type of Devices to Automate"]')?.value || '';
        const cost    = rooms * 150000;
        subtotal = cost;
        if (cost > 0) lineItems.push({ desc: `Smart Home Automation — ${rooms} room(s)${devices ? ', ' + devices : ''}`, qty: rooms, price: 150000, total: cost });

    } else if (projectType === 'CCTV/Security') {
        // Cameras
        document.querySelectorAll('.camera-row').forEach(row => {
            const model = row.querySelector('select')?.value || '';
            const qty   = parseInt(row.querySelector('input[type="number"]')?.value) || 1;
            if (model && HIKVISION_CAMERAS[model]) {
                const price = HIKVISION_CAMERAS[model];
                const tot   = price * qty;
                subtotal += tot;
                lineItems.push({ desc: `${model} ×${qty}`, qty, price, total: tot });
            }
        });
        // DVR
        const dvrModel = document.querySelector('[name="DVR Model"]')?.value || '';
        if (dvrModel && HIKVISION_DVRS[dvrModel]) {
            const p = HIKVISION_DVRS[dvrModel];
            subtotal += p;
            lineItems.push({ desc: dvrModel, qty: 1, price: p, total: p });
        }
        // NVR
        const nvrModel = document.querySelector('[name="NVR Model"]')?.value || '';
        if (nvrModel && HIKVISION_NVRS[nvrModel]) {
            const p = HIKVISION_NVRS[nvrModel];
            subtotal += p;
            lineItems.push({ desc: nvrModel, qty: 1, price: p, total: p });
        }
        // PTZ
        const ptzModel = document.querySelector('[name="PTZ Model"]')?.value || '';
        if (ptzModel && HIKVISION_PTZ[ptzModel]) {
            const p = HIKVISION_PTZ[ptzModel];
            subtotal += p;
            lineItems.push({ desc: ptzModel, qty: 1, price: p, total: p });
        }
        // Power Supply
        const psModel = document.querySelector('[name="Power Supply Model"]')?.value || '';
        if (psModel && HIKVISION_POWER_SUPPLIES[psModel]) {
            const p = HIKVISION_POWER_SUPPLIES[psModel];
            subtotal += p;
            lineItems.push({ desc: psModel, qty: 1, price: p, total: p });
        }
        // Security system type
        const secType = document.querySelector('[name="Security System Type"]')?.value || '';
        if (secType === 'Alarm') {
            subtotal += 200000;
            lineItems.push({ desc: 'Alarm System', qty: 1, price: 200000, total: 200000 });
        } else if (secType === 'Integrated') {
            subtotal += 300000;
            lineItems.push({ desc: 'Integrated Security System', qty: 1, price: 300000, total: 300000 });
        }

    } else if (projectType === 'Electrical Wiring') {
        const rawSize = document.querySelector('[name="Building Size"]')?.value || '';
        const rooms   = parseInt(rawSize) || 4;
        const cost    = rooms * 100000;
        subtotal = cost;
        if (cost > 0) lineItems.push({ desc: `Electrical Wiring (${rawSize || '4 rooms'})`, qty: rooms, price: 100000, total: cost });

    } else if (projectType === 'Multiple') {
        const needs = document.getElementById('specificNeeds')?.value || '';
        subtotal = 500000;
        lineItems.push({ desc: `Multiple Services${needs ? ' — ' + needs : ''}`, qty: 1, price: 500000, total: 500000 });
    }

    return { subtotal, lineItems };
}

// ---------------------------------------------------------------------------
// TAWK.TO — push visitor biodata so admin can see it
// ---------------------------------------------------------------------------
function pushBiodataToTawk(name, email, phone, projectType, invoiceNo, total) {
    if (typeof Tawk_API === 'undefined') return;

    // setAttributes makes the data appear in the visitor panel for the admin
    try {
        Tawk_API.setAttributes({
            name:        name        || 'N/A',
            email:       email       || 'N/A',
            phone:       phone       || 'N/A',
            projectType: projectType || 'N/A',
            invoiceNo:   invoiceNo   || 'N/A',
            totalQuote:  total ? fmt(total) : 'N/A'
        }, function (err) {
            if (err) console.warn('Tawk setAttributes:', err);
        });
    } catch (e) {
        console.warn('Tawk setAttributes failed:', e);
    }

    // addEvent logs a timeline event the admin can read in the conversation
    try {
        Tawk_API.addEvent('Quote Generated', {
            invoiceNo:   invoiceNo,
            projectType: projectType,
            total:       total ? fmt(total) : 'N/A',
            name:        name,
            email:       email,
            phone:       phone
        }, function (err) {
            if (err) console.warn('Tawk addEvent:', err);
        });
    } catch (e) {
        console.warn('Tawk addEvent failed:', e);
    }
}

// ---------------------------------------------------------------------------
// PDF GENERATION — pure frontend, browser download
// ---------------------------------------------------------------------------
function generateAndDownloadPDF(data) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        showStatus('❌ PDF library not loaded. Please refresh the page and try again.', 'error');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc       = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW     = doc.internal.pageSize.getWidth();
    const orange    = [249, 115, 22];
    const dark      = [31, 41, 55];
    const gray      = [107, 114, 128];
    const lightGray = [243, 244, 246];

    // ── Header bar ──────────────────────────────────────────────────────────
    doc.setFillColor(...orange);
    doc.rect(0, 0, pageW, 28, 'F');

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('JUSTO ZEAL', 15, 13);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Electrical & Automation Services', 15, 20);

    doc.setFontSize(9);
    doc.text('QUOTATION', pageW - 15, 13, { align: 'right' });
    doc.text(data.invoiceNumber, pageW - 15, 20, { align: 'right' });

    // ── Meta row (Date / Due) ────────────────────────────────────────────────
    const today   = new Date();
    const dueDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const fmtDate = d => d.toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });

    doc.setFillColor(...lightGray);
    doc.rect(0, 28, pageW, 10, 'F');
    doc.setTextColor(...gray);
    doc.setFontSize(8);
    doc.text(`Date: ${fmtDate(today)}`, 15, 34);
    doc.text(`Valid Until: ${fmtDate(dueDate)}`, pageW - 15, 34, { align: 'right' });

    // ── Bill To ──────────────────────────────────────────────────────────────
    let y = 48;
    doc.setTextColor(...dark);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO', 15, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    y += 6;
    doc.text(data.name    || 'N/A', 15, y); y += 5;
    doc.text(data.email   || 'N/A', 15, y); y += 5;
    doc.text(data.phone   || 'N/A', 15, y); y += 5;

    // Project type label on right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...orange);
    doc.text('PROJECT TYPE', pageW - 75, 48);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...dark);
    doc.text(data.projectType || 'N/A', pageW - 75, 54);

    // ── Line items table ─────────────────────────────────────────────────────
    y += 8;
    // Table header
    doc.setFillColor(...orange);
    doc.rect(10, y, pageW - 20, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('ITEM DESCRIPTION', 13, y + 5.5);
    doc.text('QTY',   pageW - 70, y + 5.5, { align: 'right' });
    doc.text('UNIT PRICE',   pageW - 40, y + 5.5, { align: 'right' });
    doc.text('TOTAL',  pageW - 12, y + 5.5, { align: 'right' });
    y += 8;

    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    let rowBg = false;
    data.lineItems.forEach(item => {
        if (y > 260) {
            doc.addPage();
            y = 20;
        }
        if (rowBg) {
            doc.setFillColor(255, 247, 237);
            doc.rect(10, y - 1, pageW - 20, 7, 'F');
        }
        rowBg = !rowBg;
        doc.setTextColor(...dark);
        // Wrap long description
        const descLines = doc.splitTextToSize(item.desc, 95);
        doc.text(descLines, 13, y + 4);
        const rowH = Math.max(7, descLines.length * 4.5);
        doc.text(String(item.qty),         pageW - 70, y + 4, { align: 'right' });
        doc.text(fmt(item.price),           pageW - 40, y + 4, { align: 'right' });
        doc.text(fmt(item.total),            pageW - 12, y + 4, { align: 'right' });
        y += rowH;
    });

    // ── Totals block ──────────────────────────────────────────────────────────
    y += 6;
    // Separator line
    doc.setDrawColor(...orange);
    doc.setLineWidth(0.5);
    doc.line(10, y, pageW - 10, y);
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...orange);
    doc.text('TOTAL AMOUNT:', pageW - 65, y);
    doc.text(fmt(data.subtotal), pageW - 12, y, { align: 'right' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...gray);
    y += 5;
    doc.text('(No VAT applied — prices are final estimates subject to site audit)', pageW - 12, y, { align: 'right' });

    // ── Project description ──────────────────────────────────────────────────
    if (data.specificNeeds) {
        y += 12;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...dark);
        doc.text('PROJECT NOTES:', 15, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...gray);
        const noteLines = doc.splitTextToSize(data.specificNeeds, pageW - 30);
        doc.text(noteLines, 15, y);
        y += noteLines.length * 4.5;
    }

    // ── Footer ────────────────────────────────────────────────────────────────
    const footerY = doc.internal.pageSize.getHeight() - 18;
    doc.setFillColor(...orange);
    doc.rect(0, footerY - 4, pageW, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Thank you for choosing Justo Zeal!', pageW / 2, footerY + 2, { align: 'center' });
    doc.text('+234 811 437 7822   |   Justozeal1@gmail.com   |   instagram.com/JUSTZEAL', pageW / 2, footerY + 7, { align: 'center' });
    doc.text('This quote is valid for 7 days. Prices subject to site inspection.', pageW / 2, footerY + 12, { align: 'center' });

    // ── Save ──────────────────────────────────────────────────────────────────
    doc.save(`JustoZeal-Quote-${data.invoiceNumber}.pdf`);
}

// ---------------------------------------------------------------------------
// FORM SUBMIT HANDLER — calculates, generates PDF, pushes to Tawk
// ---------------------------------------------------------------------------
window.handleLeadSubmission = function (event) {
    event.preventDefault();

    const name        = (document.getElementById('name')?.value         || '').trim();
    const email       = (document.getElementById('email')?.value        || '').trim();
    const phone       = (document.getElementById('phone')?.value        || '').trim();
    const projectType = (document.getElementById('project_type')?.value || '').trim();
    const specificNeeds = (document.getElementById('specificNeeds')?.value || '').trim();

    // Basic validation
    if (!name) { showStatus('❌ Please enter your full name.', 'error'); return; }
    if (!email || !email.includes('@')) { showStatus('❌ Please enter a valid email address.', 'error'); return; }
    if (!phone) { showStatus('❌ Please enter your phone number.', 'error'); return; }
    if (!projectType) { showStatus('❌ Please select a project type.', 'error'); return; }
    if (!specificNeeds) { showStatus('❌ Please fill in the Project Details field.', 'error'); return; }

    // Calculate
    const { subtotal, lineItems } = calculateLineItems();

    if (subtotal <= 0) {
        showStatus('❌ Could not calculate a total. Please fill in the project details (kVA, cameras, rooms, etc.).', 'error');
        return;
    }

    const invoiceNumber = `JZ-${Date.now()}`;
    const btn = document.getElementById('submit-button');

    toggleLoadingOverlay(true);
    if (btn) { btn.disabled = true; btn.textContent = 'Generating…'; }

    // Short timeout to allow the overlay to render
    setTimeout(() => {
        try {
            generateAndDownloadPDF({
                name, email, phone, projectType, specificNeeds,
                invoiceNumber, subtotal, lineItems
            });

            // Push to Tawk.to
            pushBiodataToTawk(name, email, phone, projectType, invoiceNumber, subtotal);

            showStatus(
                `✅ Your quote (${invoiceNumber}) has been downloaded! Total: ${fmt(subtotal)}. ` +
                `Our team will contact you soon. You can also chat with us below.`,
                'success'
            );

            // Reset form
            document.getElementById('quote-form-element')?.reset();
            window.updateFormFields();

        } catch (err) {
            console.error('Quote generation error:', err);
            showStatus('❌ Error generating quote. Please try again or contact Justozeal1@gmail.com.', 'error');
        } finally {
            toggleLoadingOverlay(false);
            if (btn) { btn.disabled = false; btn.innerHTML = '📥 Download Quote PDF'; }
        }
    }, 100);
};

// ---------------------------------------------------------------------------
// OPEN CHAT — prefills Tawk with form data for admin visibility
// ---------------------------------------------------------------------------
window.openChatWithContext = function () {
    const name        = (document.getElementById('name')?.value         || '').trim();
    const email       = (document.getElementById('email')?.value        || '').trim();
    const phone       = (document.getElementById('phone')?.value        || '').trim();
    const projectType = (document.getElementById('project_type')?.value || '').trim();
    const specificNeeds = (document.getElementById('specificNeeds')?.value || '').trim();

    const { subtotal } = calculateLineItems();

    // Always push biodata even before PDF is generated
    if (typeof Tawk_API !== 'undefined') {
        try {
            Tawk_API.setAttributes({
                name:        name        || 'N/A',
                email:       email       || 'N/A',
                phone:       phone       || 'N/A',
                projectType: projectType || 'N/A',
                estimatedTotal: subtotal > 0 ? fmt(subtotal) : 'Not calculated'
            }, function (err) {
                if (err) console.warn('Tawk setAttributes (chat):', err);
            });
        } catch (e) { console.warn(e); }

        Tawk_API.maximize();

        // Pre-fill the chat input with the user's context
        setTimeout(() => {
            // Build a human-readable opening message
            let msg = `Hi! I'd like to discuss a project with Justo Zeal.\n\n`;
            msg += `👤 Name: ${name || 'Not provided'}\n`;
            msg += `📧 Email: ${email || 'Not provided'}\n`;
            msg += `📞 Phone: ${phone || 'Not provided'}\n`;
            msg += `🔧 Project Type: ${projectType || 'Not selected'}\n`;
            if (subtotal > 0) msg += `💰 Estimated Total: ${fmt(subtotal)}\n`;
            if (specificNeeds) msg += `\n📝 Details: ${specificNeeds}`;

            const chatInput = document.querySelector('.tawk-textarea') ||
                              document.querySelector('textarea[data-tawk]') ||
                              document.querySelector('iframe')?.contentDocument?.querySelector('textarea');
            if (chatInput) {
                chatInput.value = msg;
                chatInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }, 800);

    } else {
        // Tawk not loaded yet — retry once
        showStatus('⌛ Chat is loading, please wait a moment…', 'info');
        setTimeout(window.openChatWithContext, 2500);
    }
};

// ---------------------------------------------------------------------------
// DOMContentLoaded bootstrap
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading overlay
    toggleLoadingOverlay(false);

    // Initialise dynamic fields
    window.updateFormFields();

    // Update submit button label to reflect no-email flow
    const submitBtn = document.getElementById('submit-button');
    if (submitBtn) submitBtn.innerHTML = '📥 Download Quote PDF';

    // Bind specificNeeds to recalc for 'Multiple' type
    const specificNeedsEl = document.getElementById('specificNeeds');
    if (specificNeedsEl) {
        specificNeedsEl.addEventListener('input', updateLiveTotal);
    }

    // Tawk.to — fire welcome event when the widget is ready
    if (typeof Tawk_API !== 'undefined') {
        Tawk_API.onLoad = function () {
            try {
                Tawk_API.addEvent('Page Visit', {
                    page: 'Quote Form',
                    url: window.location.href
                }, function (err) {
                    if (err) console.warn('Tawk onLoad event:', err);
                });
            } catch (e) { console.warn(e); }
        };
    }
});