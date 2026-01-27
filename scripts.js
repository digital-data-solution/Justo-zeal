/**
 * Pricing configuration for easy updates due to Nigeria's inflation.
 */
const PRICING = {
    solarPerKva: 350000,
    batteryPerUnit: 200000,
    panelPerUnit: 100000,
    smartHomePerRoom: 150000,
    cctvPerCamera: 50000,
    alarmSystem: 200000,
    integratedSecurity: 300000,
    electricalWiringPerRoom: 100000,
    multipleServicesBase: 500000
};

/**
 * Toggles the mobile navigation menu.
 */
window.toggleMobileMenu = function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const isActive = mobileMenu.classList.toggle('active');
    menuIcon.classList.toggle('hidden', isActive);
    closeIcon.classList.toggle('hidden', !isActive);
};

/**
 * Closes the mobile navigation menu.
 */
window.closeMobileMenu = function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }
};

/**
 * Shows or hides the global loading overlay.
 */
function toggleLoadingOverlay(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = show ? 'flex' : 'none';
}

/**
 * Updates the form fields based on the selected project type.
 */
window.updateFormFields = function() {
    const type = document.getElementById('project_type')?.value;
    const dynamicFields = document.getElementById('dynamic-fields');
    if (!dynamicFields) return console.error('Dynamic fields container not found');
    dynamicFields.innerHTML = '';

    let fields = '';
    if (type === 'Solar/Inverter') {
        fields = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label for="kva" class="block text-sm font-medium text-gray-700 mb-1">kVA Required</label>
                    <input type="number" id="kva" name="kVA Required" placeholder="e.g., 5" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label for="batteries" class="block text-sm font-medium text-gray-700 mb-1">Number of Batteries</label>
                    <input type="number" id="batteries" name="Number of Batteries" placeholder="e.g., 4" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label for="panels" class="block text-sm font-medium text-gray-700 mb-1">Number of Solar Panels (Optional)</label>
                    <input type="number" id="panels" name="Number of Solar Panels" placeholder="e.g., 8" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
                </div>
            </div>
        `;
    } else if (type === 'Smart Home') {
        fields = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="rooms" class="block text-sm font-medium text-gray-700 mb-1">Rooms for Automation</label>
                    <input type="number" id="rooms" name="Rooms for Automation" placeholder="e.g., 4" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label for="devices" class="block text-sm font-medium text-gray-700 mb-1">Type of Devices to Automate</label>
                    <input type="text" id="devices" name="Type of Devices to Automate" placeholder="e.g., Lights, AC, Curtains" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
                </div>
            </div>
        `;
    } else if (type === 'CCTV/Security') {
        fields = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="cameras" class="block text-sm font-medium text-gray-700 mb-1">Number of Cameras Required</label>
                    <input type="number" id="cameras" name="Number of Cameras Required" placeholder="e.g., 8" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label for="security_type" class="block text-sm font-medium text-gray-700 mb-1">Security System Type</label>
                    <select id="security_type" name="Security System Type" class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none">
                        <option value="">Select</option>
                        <option value="CCTV">CCTV Only</option>
                        <option value="Alarm">Alarm System Only</option>
                        <option value="Integrated">Integrated (CCTV + Alarm)</option>
                    </select>
                </div>
            </div>
        `;
    } else if (type === 'Electrical Wiring') {
        fields = `
            <div>
                <label for="building_size" class="block text-sm font-medium text-gray-700 mb-1">Building Size (e.g., number of rooms/floors)</label>
                <input type="text" id="building_size" name="Building Size" placeholder="e.g., 4 bedroom duplex" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
        `;
    } else if (type === 'Multiple') {
        fields = `
            <p class="text-sm text-red-600 font-semibold p-3 bg-red-50 rounded-lg">Please ensure your main project details below clearly list ALL services needed (Solar, Smart Home, Security, etc.)</p>
        `;
    }
    dynamicFields.innerHTML = fields;
};

/**
 * Handles form submission to Netlify Function and Tawk.to notification.
 */
window.handleLeadSubmission = async function(event) {
    event.preventDefault();
    const form = document.getElementById('quote-form-element');
    const statusMessage = document.getElementById('status-message');
    const submitButton = document.getElementById('submit-button');
    if (!form || !statusMessage || !submitButton) {
        console.error('Form elements not found');
        statusMessage.textContent = '❌ Error: Form elements missing.';
        statusMessage.classList.remove('hidden', 'status-success');
        statusMessage.classList.add('status-error', 'bg-red-100', 'text-red-800');
        return;
    }

    toggleLoadingOverlay(true);
    statusMessage.classList.remove('hidden', 'status-error', 'status-success');
    statusMessage.classList.add('bg-yellow-100', 'text-yellow-800');
    statusMessage.textContent = 'Submitting your request...';
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const dynamicFields = {};
    document.querySelectorAll('#dynamic-fields input, #dynamic-fields select').forEach(input => {
        if (input.name && input.value) dynamicFields[input.name] = input.value;
    });

    try {
        // Calculate invoice for Tawk.to
        let subtotal = 0;
        if (data.projectType === 'Solar/Inverter') {
            const kva = parseFloat(dynamicFields['kVA Required'] || 0);
            const batteries = parseInt(dynamicFields['Number of Batteries'] || 0);
            const panels = parseInt(dynamicFields['Number of Solar Panels'] || 0);
            subtotal = kva * PRICING.solarPerKva + batteries * PRICING.batteryPerUnit + panels * PRICING.panelPerUnit;
        } else if (data.projectType === 'Smart Home') {
            const rooms = parseInt(dynamicFields['Rooms for Automation'] || 0);
            subtotal = rooms * PRICING.smartHomePerRoom;
        } else if (data.projectType === 'CCTV/Security') {
            const cameras = parseInt(dynamicFields['Number of Cameras Required'] || 0);
            const securityType = dynamicFields['Security System Type'] || '';
            const cameraCost = cameras * PRICING.cctvPerCamera;
            subtotal = securityType === 'CCTV' ? cameraCost :
                      securityType === 'Alarm' ? PRICING.alarmSystem :
                      securityType === 'Integrated' ? PRICING.integratedSecurity + cameraCost : 0;
        } else if (data.projectType === 'Electrical Wiring') {
            const rooms = parseInt(dynamicFields['Building Size'] || 4);
            subtotal = rooms * PRICING.electricalWiringPerRoom;
        } else if (data.projectType === 'Multiple') {
            subtotal = PRICING.multipleServicesBase;
        }
        const total = subtotal * 1.075; // 7.5% VAT
        const invoiceNumber = `JZ-${Date.now()}`;

        // Submit to Netlify Function
        const response = await fetch('/.netlify/functions/submit-form', {
            method: 'POST',
            body: JSON.stringify({ ...data, ...dynamicFields, invoiceNumber, total }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        // Notify via Tawk.to
        if (window.Tawk_API && window.Tawk_API.onLoad) {
            window.Tawk_API.setAttributes({
                name: data.name || 'Client',
                email: data.email || 'N/A',
                phone: data.phone || 'N/A',
                projectType: data.projectType || 'N/A',
                invoiceTotal: `₦${total.toLocaleString()}`
            }, function(error) {
                if (error) console.error('Tawk.to setAttributes error:', error);
            });
            window.Tawk_API.maximize();
            window.Tawk_API.addEvent({
                name: 'leadSubmission',
                attributes: {
                    text: `Hi ${data.name || 'Client'}! Thanks for your ${data.projectType || 'project'} request: ${data.specificNeeds || 'N/A'}. Your invoice (${invoiceNumber}) totals ₦${total.toLocaleString()}. Need adjustments?`
                }
            }, function(error) {
                if (error) console.error('Tawk.to addEvent error:', error);
            });
        }

        statusMessage.textContent = `✅ Request sent! Invoice ${invoiceNumber} generated and emailed. Check the chat window.`;
        statusMessage.classList.remove('hidden', 'bg-yellow-100', 'text-yellow-800', 'status-error');
        statusMessage.classList.add('status-success', 'bg-green-100', 'text-green-800');
        form.reset();
        window.updateFormFields();
    } catch (err) {
        console.error('Submission error:', err);
        statusMessage.textContent = '❌ Error submitting request. Please try again or contact Justozeal1@gmail.com.';
        statusMessage.classList.remove('hidden', 'bg-yellow-100', 'text-yellow-800', 'status-success');
        statusMessage.classList.add('status-error', 'bg-red-100', 'text-red-800');
    } finally {
        toggleLoadingOverlay(false);
        submitButton.textContent = 'Get Instant Quote & Submit Lead';
        submitButton.disabled = false;
    }
};

/**
 * Generates and downloads an invoice PDF with logo.
 */
window.generateInvoice = function() {
    const form = document.getElementById('quote-form-element');
    const statusMessage = document.getElementById('status-message');
    if (!form || !statusMessage) {
        console.error('Form or status message element not found');
        statusMessage.textContent = '❌ Error: Form not found.';
        statusMessage.classList.remove('hidden', 'status-success');
        statusMessage.classList.add('status-error', 'bg-red-100', 'text-red-800');
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    if (!data.name || !data.projectType) {
        statusMessage.textContent = '❌ Please fill out name and project type.';
        statusMessage.classList.remove('hidden', 'status-success');
        statusMessage.classList.add('status-error', 'bg-red-100', 'text-red-800');
        return;
    }

    const dynamicFields = {};
    document.querySelectorAll('#dynamic-fields input, #dynamic-fields select').forEach(input => {
        if (input.name && input.value) dynamicFields[input.name] = input.value;
    });

    let subtotal = 0;
    let lineItems = [];
    if (data.projectType === 'Solar/Inverter') {
        const kva = parseFloat(dynamicFields['kVA Required'] || 0);
        const batteries = parseInt(dynamicFields['Number of Batteries'] || 0);
        const panels = parseInt(dynamicFields['Number of Solar Panels'] || 0);
        const kvaCost = kva * PRICING.solarPerKva;
        const batteryCost = batteries * PRICING.batteryPerUnit;
        const panelCost = panels * PRICING.panelPerUnit;
        subtotal = kvaCost + batteryCost + panelCost;
        lineItems = [
            { desc: `Solar System (${kva} kVA)`, qty: kva || 0, price: PRICING.solarPerKva, cost: kvaCost },
            { desc: `Batteries (${batteries} units)`, qty: batteries || 0, price: PRICING.batteryPerUnit, cost: batteryCost },
            { desc: `Solar Panels (${panels} units)`, qty: panels || 0, price: PRICING.panelPerUnit, cost: panelCost }
        ].filter(item => item.cost > 0);
    } else if (data.projectType === 'Smart Home') {
        const rooms = parseInt(dynamicFields['Rooms for Automation'] || 0);
        const devices = dynamicFields['Type of Devices to Automate'] || '';
        subtotal = rooms * PRICING.smartHomePerRoom;
        lineItems = [{ desc: `Smart Home Automation (${rooms} rooms, ${devices})`, qty: rooms || 0, price: PRICING.smartHomePerRoom, cost: subtotal }];
    } else if (data.projectType === 'CCTV/Security') {
        const cameras = parseInt(dynamicFields['Number of Cameras Required'] || 0);
        const securityType = dynamicFields['Security System Type'] || '';
        const cameraCost = cameras * PRICING.cctvPerCamera;
        subtotal = securityType === 'CCTV' ? cameraCost :
                  securityType === 'Alarm' ? PRICING.alarmSystem :
                  securityType === 'Integrated' ? PRICING.integratedSecurity + cameraCost : 0;
        lineItems = [
            { desc: `CCTV Cameras (${cameras} units)`, qty: cameras || 0, price: PRICING.cctvPerCamera, cost: cameraCost },
            { desc: `Security System (${securityType})`, qty: 1, price: securityType === 'CCTV' ? 0 : (securityType === 'Alarm' ? PRICING.alarmSystem : PRICING.integratedSecurity), cost: securityType === 'CCTV' ? 0 : (securityType === 'Alarm' ? PRICING.alarmSystem : PRICING.integratedSecurity) }
        ].filter(item => item.cost > 0);
    } else if (data.projectType === 'Electrical Wiring') {
        const rooms = parseInt(dynamicFields['Building Size'] || 4);
        subtotal = rooms * PRICING.electricalWiringPerRoom;
        lineItems = [{ desc: `Electrical Wiring (${dynamicFields['Building Size'] || '4 rooms'})`, qty: rooms, price: PRICING.electricalWiringPerRoom, cost: subtotal }];
    } else if (data.projectType === 'Multiple') {
        subtotal = PRICING.multipleServicesBase;
        lineItems = [{ desc: `Multiple Services (${data.specificNeeds})`, qty: 1, price: PRICING.multipleServicesBase, cost: subtotal }];
    }

    if (subtotal <= 0) {
        statusMessage.textContent = '❌ Please provide valid project details (e.g., kVA, rooms).';
        statusMessage.classList.remove('hidden', 'status-success');
        statusMessage.classList.add('status-error', 'bg-red-100', 'text-red-800');
        return;
    }

    const taxRate = 0.075;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    const invoiceNumber = `JZ-${Date.now()}`;

    try {
        if (!window.jspdf || !window.jspdf.jsPDF) throw new Error('jsPDF not loaded');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        try {
            doc.addImage('images/logo-removebg-preview.png', 'PNG', 20, 10, 30, 15);
        } catch (imgError) {
            console.warn('Logo failed, using text:', imgError);
            doc.setFontSize(12);
            doc.text('Justo Zeal Logo', 20, 15);
        }

        doc.setFontSize(20);
        doc.setFillColor(249, 115, 22); // Orange theme
        doc.text('Justo Zeal Invoice', 20, 30);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Black text
        doc.text(`Invoice #: ${invoiceNumber}`, 20, 40);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
        doc.text(`Due Date: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 20, 60);
        doc.text('Bill To:', 20, 80);
        doc.text(`Name: ${data.name || 'Client'}`, 20, 90);
        doc.text(`Email: ${data.email || 'N/A'}`, 20, 100);
        doc.text(`Phone: ${data.phone || 'N/A'}`, 20, 110);
        doc.text('Project Details:', 20, 130);
        doc.text(`Type: ${data.projectType || 'N/A'}`, 20, 140);
        doc.text(`Description: ${data.specificNeeds || 'N/A'}`, 20, 150, { maxWidth: 170 });
        doc.text('Items:', 20, 170);
        let yPos = 180;
        lineItems.forEach(item => {
            doc.text(`${item.desc}: ₦${item.cost.toLocaleString()} (Qty: ${item.qty}, Price: ₦${item.price.toLocaleString()})`, 20, yPos);
            yPos += 10;
        });
        doc.text('Totals:', 20, yPos + 10);
        doc.text(`Subtotal: ₦${subtotal.toLocaleString()}`, 20, yPos + 20);
        doc.text(`Tax (7.5%): ₦${tax.toLocaleString()}`, 20, yPos + 30);
        doc.text(`Total: ₦${total.toLocaleString()}`, 20, yPos + 40);
        doc.text('Thank you for choosing Justo Zeal! Contact: +234 811 437 7822 | Justozeal1@gmail.com', 20, 280, { maxWidth: 170 });

        doc.save(`Invoice-${invoiceNumber}.pdf`);

        if (window.Tawk_API && window.Tawk_API.onLoad) {
            window.Tawk_API.maximize();
            window.Tawk_API.addEvent({
                name: 'invoiceGenerated',
                attributes: {
                    text: `Hi ${data.name || 'Client'}! Your invoice (${invoiceNumber}) for ${data.projectType || 'project'} totals ₦${total.toLocaleString()}. Need adjustments?`
                }
            }, function(error) {
                if (error) console.error('Tawk.to error:', error);
            });
        }

        statusMessage.textContent = `✅ Invoice ${invoiceNumber} downloaded! Check the chat window.`;
        statusMessage.classList.remove('hidden', 'status-error');
        statusMessage.classList.add('status-success', 'bg-green-100', 'text-green-800');
    } catch (err) {
        console.error('Error generating invoice:', err);
        statusMessage.textContent = '❌ Error generating invoice. Try again.';
        statusMessage.classList.remove('hidden', 'status-success');
        statusMessage.classList.add('status-error', 'bg-red-100', 'text-red-800');
    }
};

/**
 * Initialize Tawk.to and form functionality.
 */
document.addEventListener('DOMContentLoaded', () => {
    window.updateFormFields();
    const chatToggle = document.getElementById('chat-toggle');
    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            if (window.Tawk_API) window.Tawk_API.toggle();
            else console.error('Tawk.to API not loaded');
        });
    }
    window.Tawk_API?.onLoad(() => {
        window.Tawk_API.addEvent({
            name: 'welcomeMessage',
            attributes: {
                text: 'Hello! I’m the Justo Zeal Assistant. Ask about solar, smart homes, or security systems!'
            }
        }, function(error) {
            if (error) console.error('Tawk.to welcomeMessage error:', error);
        });
    });
    const invoiceButton = document.getElementById('generate-invoice');
    if (invoiceButton) {
        invoiceButton.addEventListener('click', window.generateInvoice);
    } else {
        console.warn('Generate Invoice button not found');
    }
});