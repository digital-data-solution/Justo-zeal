// =============================================================================
// JUSTO ZEAL - COMPLETE ENHANCED QUOTE SYSTEM
// Solar Auto-Configuration + CCTV + Smart Home + All Services
// Pure frontend: PDF quote download + WhatsApp lead routing
// =============================================================================

// ---------------------------------------------------------------------------
// WHATSAPP CONFIG — edit these two lines only
// ---------------------------------------------------------------------------
const WA_PHONE = "2348114377822"; // Justo Zeal's number from the footer
const WA_MSG_DEFAULT = "Hi! I found Justo Zeal online and I'd like to get a quote for my project.";

function buildWaURL(msg) {
    return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg || WA_MSG_DEFAULT)}`;
}

// ---------------------------------------------------------------------------
// SOLAR PRODUCT PRICING
// ---------------------------------------------------------------------------
const INVERTERS = {
    '5kva IVEM': 504000,
    '3kva IVEM': 372000,
    '4kva IVEM': 408000,
    '6kva IVEM': 540000,
    '8kva IVEM': 936000,
    '12kva IVEM': 1440000,
    '20kva IVGM': 3420000,
    '10kva IVPS': 996000,
    '10kva IVPM': 1680000,
};

const BATTERIES = {
    '5kwh 24v lithium': 1056000,
    '5kwh 48v lithium': 1104000,
    '7.2kwh lithium': 1320000,
    '10kwh lithium': 1860000,
    '15kwh lithium': 2640000,
    '15kwh lithium Slim': 2760000,
    '17.5kwh lithium': 3180000,
    '25kwh lithium': 4560000,
    '5kwh 48v AllinOne lithium': 1296000,
};

const PANELS = {
    '210w Nevis': 54000,
    '280w Felicity': 96000,
    '320w Nevis': 96000,
    '300w': 66000,
    '310w': 69600,
    'Lifefield 420w': 96000,
    '480w Africell': 99600,
    '400w Africell': 84000,
    '450w Africell': 88800,
    '550w Africell': 108000,
    '600w Africell': 120000,
    'Flames 600w': 138000,
    'Felicity 580w Bifacial': 156000,
    'Trina 605w': 150000,
    'Sunpower 635w': 144000,
    'Sunpower 635w Bifacial': 144000,
    'Jinko 550w Bifacial': 138000,
    'Jinko 590w Bifacial': 146400,
    'Jinko 629w Bifacial': 153600,
};

const SMART_SOLAR_CONFIGS = {
    'One Bedroom (No AC)': {
        inverter: '3kva IVEM', battery: '5kwh 48v lithium',
        panel: '450w Africell', panelQty: 4, accessories: 150000,
        description: 'Basic lighting, fans, TV, small appliances'
    },
    'One Bedroom (With AC)': {
        inverter: '5kva IVEM', battery: '7.2kwh lithium',
        panel: '550w Africell', panelQty: 6, accessories: 200000,
        description: 'Full home + 1 AC unit'
    },
    'Two Bedroom (No AC)': {
        inverter: '5kva IVEM', battery: '10kwh lithium',
        panel: '550w Africell', panelQty: 8, accessories: 250000,
        description: 'All basic appliances, no AC'
    },
    'Two Bedroom (With AC)': {
        inverter: '8kva IVEM', battery: '15kwh lithium',
        panel: '600w Africell', panelQty: 10, accessories: 300000,
        description: 'Full home + 2 AC units'
    },
    'Three Bedroom (No AC)': {
        inverter: '8kva IVEM', battery: '15kwh lithium Slim',
        panel: 'Jinko 590w Bifacial', panelQty: 10, accessories: 350000,
        description: 'Large home, all appliances except AC'
    },
    'Three Bedroom (With AC)': {
        inverter: '10kva IVPS', battery: '17.5kwh lithium',
        panel: 'Jinko 629w Bifacial', panelQty: 12, accessories: 400000,
        description: 'Full home + 3 AC units, premium system'
    }
};

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
// SOLAR AUTO-CONFIGURATION
// ---------------------------------------------------------------------------
window.onSolarPropertyTypeChange = function() {
    const propertyType = document.getElementById('solar_property_type')?.value;

    if (!propertyType || propertyType === 'Custom') {
        document.getElementById('solar-auto-config')?.classList.add('hidden');
        document.getElementById('solar-manual-config')?.classList.remove('hidden');
        updateLiveTotal();
        return;
    }

    const config = SMART_SOLAR_CONFIGS[propertyType];
    if (!config) { updateLiveTotal(); return; }

    document.getElementById('solar_inverter').value   = config.inverter;
    document.getElementById('solar_battery').value    = config.battery;
    document.getElementById('solar_panel').value      = config.panel;
    document.getElementById('solar_panel_qty').value  = config.panelQty;
    document.getElementById('solar_accessories').value = config.accessories;

    const materialCost   = INVERTERS[config.inverter] + BATTERIES[config.battery] + (PANELS[config.panel] * config.panelQty) + config.accessories;
    const serviceCharge  = materialCost * 0.15;
    const total          = materialCost + serviceCharge;

    const summaryEl = document.getElementById('solar-auto-summary');
    if (summaryEl) {
        summaryEl.innerHTML = `
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 class="font-bold text-orange-900 mb-2">✨ Auto-Configured System</h4>
                <p class="text-sm text-orange-800 mb-3">${config.description}</p>
                <div class="grid grid-cols-2 gap-2 text-sm text-orange-900 mb-3">
                    <div>• <strong>Inverter:</strong> ${config.inverter}</div>
                    <div class="text-right">${fmt(INVERTERS[config.inverter])}</div>
                    <div>• <strong>Battery:</strong> ${config.battery}</div>
                    <div class="text-right">${fmt(BATTERIES[config.battery])}</div>
                    <div>• <strong>Panels:</strong> ${config.panelQty}× ${config.panel}</div>
                    <div class="text-right">${fmt(PANELS[config.panel] * config.panelQty)}</div>
                    <div>• <strong>Installation:</strong></div>
                    <div class="text-right">${fmt(config.accessories)}</div>
                </div>
                <div class="border-t border-orange-300 pt-2 mt-2">
                    <div class="flex justify-between text-sm">
                        <span>Material Subtotal:</span><span class="font-semibold">${fmt(materialCost)}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span>Service Charge (15%):</span><span class="font-semibold">${fmt(serviceCharge)}</span>
                    </div>
                    <div class="flex justify-between text-lg font-bold text-orange-700 mt-1">
                        <span>Total Quote:</span><span>${fmt(total)}</span>
                    </div>
                </div>
            </div>`;
    }

    document.getElementById('solar-auto-config')?.classList.remove('hidden');
    document.getElementById('solar-manual-config')?.classList.add('hidden');
    updateLiveTotal();
};

// ---------------------------------------------------------------------------
// DYNAMIC FORM FIELDS
// ---------------------------------------------------------------------------
window.updateFormFields = function () {
    const type = document.getElementById('project_type')?.value;
    const container = document.getElementById('dynamic-fields');
    if (!container) return;
    container.innerHTML = '';

    if (type === 'Solar/Inverter') {
        const propertyOptions = Object.keys(SMART_SOLAR_CONFIGS).map(prop =>
            `<option value="${prop}">${prop}</option>`).join('');
        const inverterOptions = Object.keys(INVERTERS).map(inv =>
            `<option value="${inv}">${inv} — ${fmt(INVERTERS[inv])}</option>`).join('');
        const batteryOptions = Object.keys(BATTERIES).map(bat =>
            `<option value="${bat}">${bat} — ${fmt(BATTERIES[bat])}</option>`).join('');
        const panelOptions = Object.keys(PANELS).map(panel =>
            `<option value="${panel}">${panel} — ${fmt(PANELS[panel])}/panel</option>`).join('');

        container.innerHTML = `
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 mb-4">
            💡 <strong>Smart Setup:</strong> Select your property type for instant configuration, or choose "Custom" to manually select components.
          </div>
          <div class="mb-5">
            <label for="solar_property_type" class="block text-sm font-semibold text-gray-700 mb-1">
              Property Type <span class="text-red-500">*</span>
              <span class="block font-normal text-gray-500 text-xs">Auto-configures the perfect system for you</span>
            </label>
            <select id="solar_property_type" name="Property Type"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                    onchange="onSolarPropertyTypeChange()">
              <option value="">— Select Property Type —</option>
              ${propertyOptions}
              <option value="Custom">🔧 Custom Configuration</option>
            </select>
          </div>
          <div id="solar-auto-config" class="mb-5 hidden"><div id="solar-auto-summary"></div></div>
          <div id="solar-manual-config" class="space-y-4 hidden">
            <h4 class="text-sm font-bold text-gray-700 mb-3">Custom System Components</h4>
            <div>
              <label for="solar_inverter" class="block text-sm font-semibold text-gray-700 mb-1">⚡ Inverter Model <span class="text-red-500">*</span></label>
              <select id="solar_inverter" name="Inverter Model" class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white" onchange="updateLiveTotal()">
                <option value="">— Choose Inverter —</option>${inverterOptions}
              </select>
            </div>
            <div>
              <label for="solar_battery" class="block text-sm font-semibold text-gray-700 mb-1">🔋 Battery Type <span class="text-red-500">*</span></label>
              <select id="solar_battery" name="Battery Type" class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white" onchange="updateLiveTotal()">
                <option value="">— Choose Battery —</option>${batteryOptions}
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="solar_panel" class="block text-sm font-semibold text-gray-700 mb-1">☀️ Solar Panel Model <span class="text-red-500">*</span></label>
                <select id="solar_panel" name="Solar Panel Model" class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white" onchange="updateLiveTotal()">
                  <option value="">— Choose Panel —</option>${panelOptions}
                </select>
              </div>
              <div>
                <label for="solar_panel_qty" class="block text-sm font-semibold text-gray-700 mb-1">Panel Quantity <span class="text-red-500">*</span></label>
                <input type="number" id="solar_panel_qty" name="Panel Quantity" min="1" value="4"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg" oninput="updateLiveTotal()">
              </div>
            </div>
            <div>
              <label for="solar_accessories" class="block text-sm font-semibold text-gray-700 mb-1">
                🔧 Accessories & Installation Cost
                <span class="block font-normal text-gray-500 text-xs">Cables, mounting, circuit breakers, installation labor</span>
              </label>
              <input type="number" id="solar_accessories" name="Accessories Cost" min="0" value="150000"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg" oninput="updateLiveTotal()">
            </div>
          </div>`;

    } else if (type === 'Smart Home') {
        container.innerHTML = `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="rooms" class="block text-sm font-medium text-gray-700 mb-1">Rooms for Automation</label>
              <input type="number" id="rooms" name="Rooms for Automation" min="0" placeholder="e.g., 4"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label for="devices" class="block text-sm font-medium text-gray-700 mb-1">Devices to Automate</label>
              <input type="text" id="devices" name="Type of Devices to Automate" placeholder="e.g., Lights, AC, Curtains"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
          </div>`;

    } else if (type === 'CCTV/Security') {
        const cameraOptions = `
          <optgroup label="📷 Analogue Cameras">
            <option value="HIKVISION 2MP DOME (DS-2CE76D0T-EXIPF)">2MP Dome — Indoor/Outdoor · ${fmt(12075)}</option>
            <option value="HIKVISION 2MP BULLET (DS-2CE16D0T-EXIPF)">2MP Bullet — Outdoor · ${fmt(12075)}</option>
            <option value="2MP SMART HYBRID LIGHT BULLET (DS-2CE16DOT-LPFS)">2MP Smart Hybrid Bullet — Colour Night · ${fmt(25300)}</option>
            <option value="2MP SMART HYBRID LIGHT DOME (DS-2CE76DOT-LPFS)">2MP Smart Hybrid Dome — Colour Night · ${fmt(28750)}</option>
            <option value="HIKVISION 2MP TWO-WAY AUDIO & SIREN PT CAMERA (DS-2CE70D0T-PTLTS)">2MP Audio + Siren PT — Pan/Tilt · ${fmt(51750)}</option>
          </optgroup>
          <optgroup label="🌐 IP / Network Cameras">
            <option value="2MP IP BULLET NON-AUDIO (DS-2CD1021G0-I)">2MP IP Bullet — IR Night · ${fmt(41400)}</option>
            <option value="2MP IP DOME NON-AUDIO (DS-2CD1121-I)">2MP IP Dome — IR Night · ${fmt(41400)}</option>
            <option value="2MP IP SMART HYBRID LIGHT BULLET (DS-2CD1023G2-LIU / LIUF)">2MP IP Smart Hybrid Bullet — Full Colour · ${fmt(54050)}</option>
            <option value="2MP IP SMART HYBRID LIGHT DOME (DS-2CD1123G2-LIU / DS-2CD1323G2-LIUF)">2MP IP Smart Hybrid Dome — Full Colour · ${fmt(54050)}</option>
            <option value="2MP IP COLOURVU DOME (DS-2CD1327G2-L)">2MP IP ColourVu Dome — 24/7 Colour · ${fmt(60950)}</option>
            <option value="HIKVISION 4MP DOME SMART HYBRID LIGHT CAMERA">4MP Dome Smart Hybrid — Ultra Sharp · ${fmt(80500)}</option>
          </optgroup>`;

        const dvrOptions = `
          <optgroup label="4-Channel DVR">
            <option value="4CH DVR 1080P">4-CH 1080P DVR · ${fmt(41400)}</option>
            <option value="4CH DVR 3K/5MP (iDS-7204HQHI-M1/S)">4-CH 3K/5MP DVR · ${fmt(71300)}</option>
            <option value="4CH 1080P ACUSENSE DVR (iDS-7204HQHI-M1/XT)">4-CH AcuSense DVR · ${fmt(89700)}</option>
          </optgroup>
          <optgroup label="8-Channel DVR">
            <option value="8CH DVR 3K/5MP (iDS-7208HQHI-M1/S)">8-CH 3K/5MP DVR · ${fmt(97750)}</option>
            <option value="8CH 3K/5MP ACUSENSE DVR (iDS-7208HQHI-M1/XT)">8-CH AcuSense DVR · ${fmt(132825)}</option>
          </optgroup>
          <optgroup label="16-Channel DVR">
            <option value="16CH DVR 1080P (DS-7216HGHI-M1)">16-CH 1080P DVR · ${fmt(102350)}</option>
            <option value="16CH DVR 3K/5MP (iDS-7216HQHI-M1/E)">16-CH 3K/5MP DVR · ${fmt(166750)}</option>
          </optgroup>
          <optgroup label="32-Channel DVR">
            <option value="32CH DVR 1080P (DS-7232HGHI-M2)">32-CH 1080P DVR · ${fmt(281750)}</option>
            <option value="32CH DVR 3K/5MP (iDS-7232HQHI-M2/S)">32-CH 3K/5MP DVR · ${fmt(377200)}</option>
          </optgroup>`;

        const nvrOptions = `
          <optgroup label="NVR Options">
            <option value="8CH NVR 1 SATA (DS-7108NI-Q1/8P/M)">8-CH NVR PoE · ${fmt(129950)}</option>
            <option value="16CH NVR 2 SATA (DS-7616NI-Q2/16P)">16-CH NVR PoE · ${fmt(301300)}</option>
            <option value="32CH NVR ACUSENSE NON-POE (DS-7632NXI-K2)">32-CH AcuSense NVR · ${fmt(281750)}</option>
            <option value="32CH NVR ACUSENSE POE (DS-7632NXI-K2/16P)">32-CH AcuSense NVR PoE · ${fmt(495075)}</option>
          </optgroup>`;

        container.innerHTML = `
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            💡 <strong>Not sure what to pick?</strong> Dome = indoor/ceiling. Bullet = outdoor. DVR = analogue cameras. NVR = IP cameras.
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">📷 Camera Model & Quantity</label>
            <div id="camera-rows" class="space-y-3">
              <div class="camera-row flex gap-2 items-start">
                <select name="camera_model_0" class="flex-1 px-3 py-3 border border-gray-300 rounded-lg bg-white text-sm" onchange="updateLiveTotal()">
                  <option value="">— Choose Camera Model —</option>${cameraOptions}
                </select>
                <div class="flex flex-col items-center gap-1">
                  <label class="text-xs text-gray-500">Qty</label>
                  <input type="number" name="camera_qty_0" min="1" value="1"
                         class="w-16 px-2 py-3 border border-gray-300 rounded-lg text-sm text-center" oninput="updateLiveTotal()">
                </div>
              </div>
            </div>
            <button type="button" onclick="addCameraRow()" class="mt-3 text-sm text-orange-600 hover:text-orange-800 font-semibold underline">
              + Add Another Camera Model
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="dvr_model" class="block text-sm font-semibold text-gray-700 mb-1">
                📹 DVR <span class="block font-normal text-gray-500 text-xs">For analogue cameras</span>
              </label>
              <select id="dvr_model" name="DVR Model" class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm" onchange="updateLiveTotal()">
                <option value="">— No DVR needed —</option>${dvrOptions}
              </select>
            </div>
            <div>
              <label for="nvr_model" class="block text-sm font-semibold text-gray-700 mb-1">
                🖥️ NVR <span class="block font-normal text-gray-500 text-xs">For IP cameras</span>
              </label>
              <select id="nvr_model" name="NVR Model" class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm" onchange="updateLiveTotal()">
                <option value="">— No NVR needed —</option>${nvrOptions}
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="ptz_model" class="block text-sm font-semibold text-gray-700 mb-1">🔄 PTZ Camera (Optional)</label>
              <select id="ptz_model" name="PTZ Model" class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm" onchange="updateLiveTotal()">
                <option value="">— No PTZ —</option>
                <option value="2MP HD PTZ (DS-2DE4225TI-D)">2MP HD PTZ 25× Zoom · ${fmt(391000)}</option>
                <option value="2MP TANDEMVU COLOURVU PTZ (DS-2SE4C225MWG-E)">2MP TandemVu ColourVu PTZ · ${fmt(460000)}</option>
              </select>
            </div>
            <div>
              <label for="ps_model" class="block text-sm font-semibold text-gray-700 mb-1">⚡ Power Supply (Optional)</label>
              <select id="ps_model" name="Power Supply Model" class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm" onchange="updateLiveTotal()">
                <option value="">— No Power Supply —</option>
                <option value="HIKVISION 4-WAY POWER SUPPLY">4-Way · ${fmt(10925)}</option>
                <option value="HIKVISION 8-WAY POWER SUPPLY">8-Way · ${fmt(14375)}</option>
                <option value="HIKVISION 16-WAY POWER SUPPLY">16-Way · ${fmt(23000)}</option>
              </select>
            </div>
          </div>
          <div>
            <label for="security_type" class="block text-sm font-semibold text-gray-700 mb-1">🚨 Alarm System (Optional)</label>
            <select id="security_type" name="Security System Type" class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white" onchange="updateLiveTotal()">
              <option value="">— CCTV Only —</option>
              <option value="Alarm">🔔 Alarm System Only · ${fmt(200000)}</option>
              <option value="Integrated">🔐 Integrated CCTV + Alarm · ${fmt(300000)}</option>
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

    container.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('change', updateLiveTotal);
        el.addEventListener('input', updateLiveTotal);
    });
    updateLiveTotal();
};

window.addCameraRow = function () {
    const cameraOptions = `
      <optgroup label="📷 Analogue Cameras">
        <option value="HIKVISION 2MP DOME (DS-2CE76D0T-EXIPF)">2MP Dome · ${fmt(12075)}</option>
        <option value="HIKVISION 2MP BULLET (DS-2CE16D0T-EXIPF)">2MP Bullet · ${fmt(12075)}</option>
        <option value="2MP SMART HYBRID LIGHT BULLET (DS-2CE16DOT-LPFS)">Smart Hybrid Bullet · ${fmt(25300)}</option>
        <option value="2MP SMART HYBRID LIGHT DOME (DS-2CE76DOT-LPFS)">Smart Hybrid Dome · ${fmt(28750)}</option>
        <option value="HIKVISION 2MP TWO-WAY AUDIO & SIREN PT CAMERA (DS-2CE70D0T-PTLTS)">Audio + Siren PT · ${fmt(51750)}</option>
      </optgroup>
      <optgroup label="🌐 IP / Network Cameras">
        <option value="2MP IP BULLET NON-AUDIO (DS-2CD1021G0-I)">2MP IP Bullet · ${fmt(41400)}</option>
        <option value="2MP IP DOME NON-AUDIO (DS-2CD1121-I)">2MP IP Dome · ${fmt(41400)}</option>
        <option value="2MP IP SMART HYBRID LIGHT BULLET (DS-2CD1023G2-LIU / LIUF)">IP Smart Hybrid Bullet · ${fmt(54050)}</option>
        <option value="2MP IP SMART HYBRID LIGHT DOME (DS-2CD1123G2-LIU / DS-2CD1323G2-LIUF)">IP Smart Hybrid Dome · ${fmt(54050)}</option>
        <option value="2MP IP COLOURVU DOME (DS-2CD1327G2-L)">IP ColourVu Dome · ${fmt(60950)}</option>
        <option value="HIKVISION 4MP DOME SMART HYBRID LIGHT CAMERA">4MP Dome Smart Hybrid · ${fmt(80500)}</option>
      </optgroup>`;
    const rows = document.getElementById('camera-rows');
    if (!rows) return;
    const idx = rows.children.length;
    const div = document.createElement('div');
    div.className = 'camera-row flex gap-2 items-start';
    div.innerHTML = `
      <select name="camera_model_${idx}" class="flex-1 px-3 py-3 border border-gray-300 rounded-lg bg-white text-sm" onchange="updateLiveTotal()">
        <option value="">— Choose Camera Model —</option>${cameraOptions}
      </select>
      <div class="flex flex-col items-center gap-1">
        <label class="text-xs text-gray-500">Qty</label>
        <input type="number" name="camera_qty_${idx}" min="1" value="1"
               class="w-16 px-2 py-3 border border-gray-300 rounded-lg text-sm text-center" oninput="updateLiveTotal()">
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
        const dynFields = document.getElementById('dynamic-fields');
        if (dynFields) dynFields.appendChild(liveEl);
    }
    if (result.subtotal > 0) {
        liveEl.innerHTML = `Estimated Total: <span>${fmt(result.subtotal)}</span>`;
        liveEl.classList.remove('hidden');
    } else {
        liveEl.classList.add('hidden');
    }
}

// ---------------------------------------------------------------------------
// CORE CALCULATION
// ---------------------------------------------------------------------------
function calculateLineItems() {
    const projectType = document.getElementById('project_type')?.value || '';
    let subtotal = 0;
    let lineItems = [];

    if (projectType === 'Solar/Inverter') {
        const inverter    = document.getElementById('solar_inverter')?.value || '';
        const battery     = document.getElementById('solar_battery')?.value || '';
        const panel       = document.getElementById('solar_panel')?.value || '';
        const panelQty    = parseInt(document.getElementById('solar_panel_qty')?.value) || 0;
        const accessories = parseInt(document.getElementById('solar_accessories')?.value) || 0;
        let materialCost  = 0;

        if (inverter && INVERTERS[inverter]) {
            const p = INVERTERS[inverter]; materialCost += p;
            lineItems.push({ desc: `Inverter: ${inverter}`, qty: 1, price: p, total: p });
        }
        if (battery && BATTERIES[battery]) {
            const p = BATTERIES[battery]; materialCost += p;
            lineItems.push({ desc: `Battery: ${battery}`, qty: 1, price: p, total: p });
        }
        if (panel && PANELS[panel] && panelQty > 0) {
            const p = PANELS[panel]; const t = p * panelQty; materialCost += t;
            lineItems.push({ desc: `Solar Panels: ${panelQty}× ${panel}`, qty: panelQty, price: p, total: t });
        }
        if (accessories > 0) {
            materialCost += accessories;
            lineItems.push({ desc: 'Installation & Accessories', qty: 1, price: accessories, total: accessories });
        }
        const serviceCharge = materialCost * 0.15;
        if (serviceCharge > 0) lineItems.push({ desc: 'Service Charge (15%)', qty: 1, price: serviceCharge, total: serviceCharge });
        subtotal = materialCost + serviceCharge;

    } else if (projectType === 'Smart Home') {
        const rooms = parseInt(document.querySelector('[name="Rooms for Automation"]')?.value) || 0;
        const devices = document.querySelector('[name="Type of Devices to Automate"]')?.value || '';
        const cost = rooms * 150000;
        subtotal = cost;
        if (cost > 0) lineItems.push({ desc: `Smart Home Automation — ${rooms} room(s)${devices ? ', ' + devices : ''}`, qty: rooms, price: 150000, total: cost });

    } else if (projectType === 'CCTV/Security') {
        document.querySelectorAll('.camera-row').forEach(row => {
            const model = row.querySelector('select')?.value || '';
            const qty   = parseInt(row.querySelector('input[type="number"]')?.value) || 1;
            if (model && HIKVISION_CAMERAS[model]) {
                const p = HIKVISION_CAMERAS[model]; const t = p * qty;
                subtotal += t;
                lineItems.push({ desc: `${model} ×${qty}`, qty, price: p, total: t });
            }
        });
        const dvrModel = document.querySelector('[name="DVR Model"]')?.value || '';
        if (dvrModel && HIKVISION_DVRS[dvrModel]) { const p = HIKVISION_DVRS[dvrModel]; subtotal += p; lineItems.push({ desc: dvrModel, qty: 1, price: p, total: p }); }
        const nvrModel = document.querySelector('[name="NVR Model"]')?.value || '';
        if (nvrModel && HIKVISION_NVRS[nvrModel]) { const p = HIKVISION_NVRS[nvrModel]; subtotal += p; lineItems.push({ desc: nvrModel, qty: 1, price: p, total: p }); }
        const ptzModel = document.querySelector('[name="PTZ Model"]')?.value || '';
        if (ptzModel && HIKVISION_PTZ[ptzModel]) { const p = HIKVISION_PTZ[ptzModel]; subtotal += p; lineItems.push({ desc: ptzModel, qty: 1, price: p, total: p }); }
        const psModel = document.querySelector('[name="Power Supply Model"]')?.value || '';
        if (psModel && HIKVISION_POWER_SUPPLIES[psModel]) { const p = HIKVISION_POWER_SUPPLIES[psModel]; subtotal += p; lineItems.push({ desc: psModel, qty: 1, price: p, total: p }); }
        const secType = document.querySelector('[name="Security System Type"]')?.value || '';
        if (secType === 'Alarm')      { subtotal += 200000; lineItems.push({ desc: 'Alarm System', qty: 1, price: 200000, total: 200000 }); }
        else if (secType === 'Integrated') { subtotal += 300000; lineItems.push({ desc: 'Integrated Security System', qty: 1, price: 300000, total: 300000 }); }

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
// PDF GENERATION
// ---------------------------------------------------------------------------
function generateAndDownloadPDF(data) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        showStatus('❌ PDF library not loaded. Please refresh and try again.', 'error');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc       = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW     = doc.internal.pageSize.getWidth();
    const orange    = [249, 115, 22];
    const dark      = [31, 41, 55];
    const gray      = [107, 114, 128];
    const lightGray = [243, 244, 246];

    doc.setFillColor(...orange);
    doc.rect(0, 0, pageW, 28, 'F');
    doc.setFontSize(20); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('JUSTO ZEAL', 15, 13);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text('Professional Electrical & Automation Services', 15, 20);
    doc.text('QUOTATION', pageW - 15, 13, { align: 'right' });
    doc.text(data.invoiceNumber, pageW - 15, 20, { align: 'right' });

    const today   = new Date();
    const dueDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const fmtDate = d => d.toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });

    doc.setFillColor(...lightGray);
    doc.rect(0, 28, pageW, 10, 'F');
    doc.setTextColor(...gray); doc.setFontSize(8);
    doc.text(`Date: ${fmtDate(today)}`, 15, 34);
    doc.text(`Valid Until: ${fmtDate(dueDate)}`, pageW - 15, 34, { align: 'right' });

    let y = 48;
    doc.setTextColor(...dark); doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text('BILL TO', 15, y);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    y += 6; doc.text(data.name  || 'N/A', 15, y);
    y += 5; doc.text(data.email || 'N/A', 15, y);
    y += 5; doc.text(data.phone || 'N/A', 15, y);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...orange);
    doc.text('PROJECT TYPE', pageW - 75, 48);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...dark);
    doc.text(data.projectType || 'N/A', pageW - 75, 54);

    y += 8;
    doc.setFillColor(...orange);
    doc.rect(10, y, pageW - 20, 8, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5);
    doc.text('ITEM DESCRIPTION', 13, y + 5.5);
    doc.text('QTY',       pageW - 70, y + 5.5, { align: 'right' });
    doc.text('UNIT PRICE', pageW - 40, y + 5.5, { align: 'right' });
    doc.text('TOTAL',      pageW - 12, y + 5.5, { align: 'right' });
    y += 8;

    doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
    let rowBg = false;
    data.lineItems.forEach(item => {
        if (y > 260) { doc.addPage(); y = 20; }
        if (rowBg) { doc.setFillColor(255, 247, 237); doc.rect(10, y - 1, pageW - 20, 7, 'F'); }
        rowBg = !rowBg;
        doc.setTextColor(...dark);
        const descLines = doc.splitTextToSize(item.desc, 95);
        doc.text(descLines, 13, y + 4);
        const rowH = Math.max(7, descLines.length * 4.5);
        doc.text(String(item.qty),  pageW - 70, y + 4, { align: 'right' });
        doc.text(fmt(item.price),   pageW - 40, y + 4, { align: 'right' });
        doc.text(fmt(item.total),   pageW - 12, y + 4, { align: 'right' });
        y += rowH;
    });

    y += 6;
    doc.setDrawColor(...orange); doc.setLineWidth(0.5);
    doc.line(10, y, pageW - 10, y);
    y += 6;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...orange);
    doc.text('TOTAL AMOUNT:', pageW - 65, y);
    doc.text(fmt(data.subtotal), pageW - 12, y, { align: 'right' });
    doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(...gray);
    y += 5;
    doc.text('(Prices include 15% service charge where applicable — subject to site audit)', pageW - 12, y, { align: 'right' });

    if (data.specificNeeds) {
        y += 12;
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...dark);
        doc.text('PROJECT NOTES:', 15, y);
        y += 5;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...gray);
        const noteLines = doc.splitTextToSize(data.specificNeeds, pageW - 30);
        doc.text(noteLines, 15, y);
        y += noteLines.length * 4.5;
    }

    const footerY = doc.internal.pageSize.getHeight() - 18;
    doc.setFillColor(...orange);
    doc.rect(0, footerY - 4, pageW, 22, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
    doc.text('Thank you for choosing Justo Zeal!', pageW / 2, footerY + 2, { align: 'center' });
    doc.text('+234 811 437 7822   |   Justozeal1@gmail.com   |   instagram.com/JUSTZEAL', pageW / 2, footerY + 7, { align: 'center' });
    doc.text('This quote is valid for 7 days. Prices subject to site inspection.', pageW / 2, footerY + 12, { align: 'center' });

    doc.save(`JustoZeal-Quote-${data.invoiceNumber}.pdf`);
}

// ---------------------------------------------------------------------------
// FORM SUBMIT — PDF download
// ---------------------------------------------------------------------------
window.handleLeadSubmission = function (event) {
    event.preventDefault();

    const name          = (document.getElementById('name')?.value          || '').trim();
    const email         = (document.getElementById('email')?.value         || '').trim();
    const phone         = (document.getElementById('phone')?.value         || '').trim();
    const projectType   = (document.getElementById('project_type')?.value  || '').trim();
    const specificNeeds = (document.getElementById('specificNeeds')?.value || '').trim();

    if (!name)                    { showStatus('❌ Please enter your full name.', 'error'); return; }
    if (!email || !email.includes('@')) { showStatus('❌ Please enter a valid email.', 'error'); return; }
    if (!phone)                   { showStatus('❌ Please enter your phone number.', 'error'); return; }
    if (!projectType)             { showStatus('❌ Please select a project type.', 'error'); return; }
    if (!specificNeeds)           { showStatus('❌ Please fill in the Project Details field.', 'error'); return; }

    const { subtotal, lineItems } = calculateLineItems();
    if (subtotal <= 0) { showStatus('❌ Could not calculate a total. Please fill in the project details.', 'error'); return; }

    const invoiceNumber = `JZ-${Date.now()}`;
    const btn = document.getElementById('submit-button');

    toggleLoadingOverlay(true);
    if (btn) { btn.disabled = true; btn.textContent = 'Generating…'; }

    setTimeout(() => {
        try {
            generateAndDownloadPDF({ name, email, phone, projectType, specificNeeds, invoiceNumber, subtotal, lineItems });

            showStatus(
                `✅ Your quote (${invoiceNumber}) has been downloaded! Total: ${fmt(subtotal)}. ` +
                `Our team will contact you soon. You can also WhatsApp us directly below.`,
                'success'
            );

            document.getElementById('quote-form-element')?.reset();
            window.updateFormFields();

        } catch (err) {
            console.error('Quote generation error:', err);
            showStatus('❌ Error generating quote. Please contact Justozeal1@gmail.com.', 'error');
        } finally {
            toggleLoadingOverlay(false);
            if (btn) { btn.disabled = false; btn.innerHTML = '📥 Download Quote PDF'; }
        }
    }, 100);
};

// ---------------------------------------------------------------------------
// OPEN WHATSAPP WITH FORM CONTEXT
// Used by the "Chat on WhatsApp" button in the quote form
// ---------------------------------------------------------------------------
window.openWhatsAppWithContext = function () {
    const name          = (document.getElementById('name')?.value          || '').trim();
    const phone         = (document.getElementById('phone')?.value         || '').trim();
    const projectType   = (document.getElementById('project_type')?.value  || '').trim();
    const specificNeeds = (document.getElementById('specificNeeds')?.value || '').trim();
    const { subtotal }  = calculateLineItems();

    let msg = `Hi Justo Zeal! I'd like to discuss a project.\n\n`;
    if (name)          msg += `👤 Name: ${name}\n`;
    if (phone)         msg += `📞 Phone: ${phone}\n`;
    if (projectType)   msg += `🔧 Service: ${projectType}\n`;
    if (subtotal > 0)  msg += `💰 Estimated Total: ${fmt(subtotal)}\n`;
    if (specificNeeds) msg += `\n📝 Details: ${specificNeeds}`;

    window.open(buildWaURL(msg), '_blank', 'noopener');
};

// ---------------------------------------------------------------------------
// WHATSAPP FLOATING WIDGET LOGIC
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    toggleLoadingOverlay(false);
    window.updateFormFields();

    const submitBtn = document.getElementById('submit-button');
    if (submitBtn) submitBtn.innerHTML = '📥 Download Quote PDF';

    const specificNeedsEl = document.getElementById('specificNeeds');
    if (specificNeedsEl) specificNeedsEl.addEventListener('input', updateLiveTotal);

    // ── Widget elements ──
    const fab     = document.getElementById('wa-fab');
    const popup   = document.getElementById('wa-popup');
    const badge   = document.getElementById('wa-badge');
    const tooltip = document.getElementById('wa-tooltip');
    const ctaLink = document.getElementById('wa-cta-link');

    if (!fab || !popup) return; // widget not in DOM

    // Set CTA href
    ctaLink.href = buildWaURL();

    // Toggle popup on FAB click
    fab.addEventListener('click', () => {
        const isOpen = popup.classList.toggle('open');
        fab.classList.toggle('active', isOpen);
        if (isOpen) {
            if (badge) badge.style.display = 'none';
            if (tooltip) tooltip.classList.add('hidden');
        }
    });

    // Close popup when CTA is clicked
    if (ctaLink) {
        ctaLink.addEventListener('click', () => {
            popup.classList.remove('open');
            fab.classList.remove('active');
        });
    }

    // Auto-open once after 8 seconds
    const hasSeenPopup = sessionStorage.getItem('jz_wa_popup_shown');
    if (!hasSeenPopup) {
        setTimeout(() => {
            popup.classList.add('open');
            fab.classList.add('active');
            if (badge) badge.style.display = 'none';
            sessionStorage.setItem('jz_wa_popup_shown', '1');
        }, 8000);
    }

    // ── Tawk.to integration ──
    // When Tawk goes offline, pulse the WhatsApp button to redirect visitors
    window.addEventListener('load', () => {
        if (typeof Tawk_API !== 'undefined') {
            Tawk_API.onStatusChange = function (status) {
                if (status === 'offline' && fab) {
                    // Brief re-animation to draw attention
                    fab.style.animation = 'none';
                    void fab.offsetWidth; // reflow
                    fab.style.animation = '';
                }
            };
        }
    });
});