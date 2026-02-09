const PDFDocument = require('pdfkit');
const sgMail = require('@sendgrid/mail');

// Set SendGrid API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Hikvision CCTV Pricing
const HIKVISION_CAMERAS = {
    'HIKVISION 2MP DOME (DS-2CE76D0T-EXIPF)': 12075,
    'HIKVISION 2MP BULLET (DS-2CE16D0T-EXIPF)': 12075,
    'HIKVISION 2MP TWO-WAY AUDIO & SIREN PT CAMERA (DS-2CE70D0T-PTLTS)': 51750,
    '2MP SMART HYBRID LIGHT BULLET (DS-2CE16DOT-LPFS)': 25300,
    '2MP SMART HYBRID LIGHT DOME (DS-2CE76DOT-LPFS)': 28750,
    '2MP IP SMART HYBRID LIGHT BULLET (DS-2CD1023G2-LIU / LIUF)': 54050,
    '2MP IP SMART HYBRID LIGHT DOME (DS-2CD1123G2-LIU / DS-2CD1323G2-LIUF)': 54050,
    '2MP IP BULLET NON-AUDIO (DS-2CD1021G0-I)': 41400,
    '2MP IP DOME NON-AUDIO (DS-2CD1121-I)': 41400,
    'HIKVISION 4MP DOME SMART HYBRID LIGHT CAMERA': 80500,
    '2MP IP COLOURVU DOME (DS-2CD1327G2-L)': 60950
};

const HIKVISION_DVRS = {
    '4CH DVR 1080P': 41400,
    '4CH DVR 3K/5MP (iDS-7204HQHI-M1/S)': 71300,
    '4CH 1080P ACUSENSE DVR (iDS-7204HQHI-M1/XT)': 89700,
    '8CH DVR 3K/5MP (iDS-7208HQHI-M1/S)': 97750,
    '8CH 3K/5MP ACUSENSE DVR (iDS-7208HQHI-M1/XT)': 132825,
    '16CH DVR 1080P (DS-7216HGHI-M1)': 102350,
    '16CH DVR 3K/5MP (iDS-7216HQHI-M1/E)': 166750,
    '32CH DVR 1080P (DS-7232HGHI-M2)': 281750,
    '32CH DVR 3K/5MP (iDS-7232HQHI-M2/S)': 377200
};

const HIKVISION_NVRS = {
    '8CH NVR 1 SATA (DS-7108NI-Q1/8P/M)': 129950,
    '16CH NVR 2 SATA (DS-7616NI-Q2/16P)': 301300,
    '32CH NVR ACUSENSE POE (DS-7632NXI-K2/16P)': 495075,
    '32CH NVR ACUSENSE NON-POE (DS-7632NXI-K2)': 281750
};

const HIKVISION_PTZ = {
    '2MP TANDEMVU COLOURVU PTZ (DS-2SE4C225MWG-E)': 460000,
    '2MP HD PTZ (DS-2DE4225TI-D)': 391000
};

const HIKVISION_POWER_SUPPLIES = {
    'HIKVISION 4-WAY POWER SUPPLY': 10925,
    'HIKVISION 8-WAY POWER SUPPLY': 14375,
    'HIKVISION 16-WAY POWER SUPPLY': 23000
};

// Other service pricing constants
const PRICING = {
    solarPerKva: 350000,
    batteryPerUnit: 200000,
    panelPerUnit: 100000,
    smartHomePerRoom: 150000,
    alarmSystem: 200000,
    integratedSecurity: 300000,
    electricalWiringPerRoom: 100000,
    multipleServicesBase: 500000
};

// Function to validate required fields
function validateInput(data) {
    const requiredFields = ['Name', 'Email', 'Phone', 'Project Type', 'invoiceNumber', 'total'];
    for (const field of requiredFields) {
        if (!data[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
    if (!data.Email.includes('@')) {
        throw new Error('Invalid email address');
    }
}

// Function to calculate line items and subtotal
function calculateLineItems(data) {
    const { 
        'Project Type': projectType, 
        'Specific Needs': specificNeeds, 
        'kVA Required': kva, 
        'Number of Batteries': batteries, 
        'Number of Solar Panels': panels, 
        'Rooms for Automation': rooms, 
        'Type of Devices to Automate': devices, 
        'Security System Type': securityType, 
        'Building Size': buildingSize,
        'Camera Models': cameraModels,
        'DVR Model': dvrModel,
        'NVR Model': nvrModel,
        'PTZ Model': ptzModel,
        'Power Supply Model': powerSupplyModel
    } = data;
    
    let subtotal = 0;
    let lineItems = [];

    switch (projectType) {
        case 'Solar/Inverter':
            const kvaCost = (parseFloat(kva) || 0) * PRICING.solarPerKva;
            const batteryCost = (parseInt(batteries) || 0) * PRICING.batteryPerUnit;
            const panelCost = (parseInt(panels) || 0) * PRICING.panelPerUnit;
            subtotal = kvaCost + batteryCost + panelCost;
            lineItems = [
                { desc: `Solar System (${kva || 0} kVA)`, qty: kva || 0, price: PRICING.solarPerKva, total: kvaCost },
                { desc: `Batteries (${batteries || 0} units)`, qty: batteries || 0, price: PRICING.batteryPerUnit, total: batteryCost },
                { desc: `Solar Panels (${panels || 0} units)`, qty: panels || 0, price: PRICING.panelPerUnit, total: panelCost }
            ].filter(item => item.total > 0);
            break;
            
        case 'Smart Home':
            subtotal = (parseInt(rooms) || 0) * PRICING.smartHomePerRoom;
            lineItems = [{ 
                desc: `Smart Home Automation (${rooms || 0} rooms, ${devices || ''})`, 
                qty: rooms || 0, 
                price: PRICING.smartHomePerRoom, 
                total: subtotal 
            }];
            break;
            
        case 'CCTV/Security':
            // Handle Hikvision cameras
            if (cameraModels && Array.isArray(cameraModels)) {
                cameraModels.forEach(camera => {
                    const price = HIKVISION_CAMERAS[camera.model] || 0;
                    const qty = parseInt(camera.quantity) || 1;
                    const total = price * qty;
                    subtotal += total;
                    lineItems.push({
                        desc: camera.model,
                        qty: qty,
                        price: price,
                        total: total
                    });
                });
            }
            
            // Handle DVR
            if (dvrModel) {
                const price = HIKVISION_DVRS[dvrModel] || 0;
                subtotal += price;
                lineItems.push({
                    desc: dvrModel,
                    qty: 1,
                    price: price,
                    total: price
                });
            }
            
            // Handle NVR
            if (nvrModel) {
                const price = HIKVISION_NVRS[nvrModel] || 0;
                subtotal += price;
                lineItems.push({
                    desc: nvrModel,
                    qty: 1,
                    price: price,
                    total: price
                });
            }
            
            // Handle PTZ
            if (ptzModel) {
                const price = HIKVISION_PTZ[ptzModel] || 0;
                subtotal += price;
                lineItems.push({
                    desc: ptzModel,
                    qty: 1,
                    price: price,
                    total: price
                });
            }
            
            // Handle Power Supply
            if (powerSupplyModel) {
                const price = HIKVISION_POWER_SUPPLIES[powerSupplyModel] || 0;
                subtotal += price;
                lineItems.push({
                    desc: powerSupplyModel,
                    qty: 1,
                    price: price,
                    total: price
                });
            }
            
            // Handle security system type (Alarm or Integrated)
            if (securityType === 'Alarm') {
                subtotal += PRICING.alarmSystem;
                lineItems.push({
                    desc: 'Alarm System',
                    qty: 1,
                    price: PRICING.alarmSystem,
                    total: PRICING.alarmSystem
                });
            } else if (securityType === 'Integrated') {
                subtotal += PRICING.integratedSecurity;
                lineItems.push({
                    desc: 'Integrated Security System',
                    qty: 1,
                    price: PRICING.integratedSecurity,
                    total: PRICING.integratedSecurity
                });
            }
            break;
            
        case 'Electrical Wiring':
            const roomsCount = parseInt(buildingSize) || 4;
            subtotal = roomsCount * PRICING.electricalWiringPerRoom;
            lineItems = [{ 
                desc: `Electrical Wiring (${buildingSize || '4 rooms'})`, 
                qty: roomsCount, 
                price: PRICING.electricalWiringPerRoom, 
                total: subtotal 
            }];
            break;
            
        case 'Multiple':
            subtotal = PRICING.multipleServicesBase;
            lineItems = [{ 
                desc: `Multiple Services (${specificNeeds})`, 
                qty: 1, 
                price: PRICING.multipleServicesBase, 
                total: subtotal 
            }];
            break;
            
        default:
            throw new Error('Invalid project type');
    }

    return { subtotal, lineItems };
}

// Function to generate PDF
function generatePDF(data, lineItems, total) {
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Header
    doc.fontSize(24).fillColor('#f97316').text('Justo Zeal Invoice', 50, 50);
    doc.fontSize(12).fillColor('black').text('Professional Electrical & Automation Services', 50, 75);

    // Invoice details
    doc.fontSize(10);
    doc.text(`Invoice Number: ${data.invoiceNumber}`, 50, 100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 115);
    doc.text(`Due Date: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 50, 130);

    // Bill to
    doc.text('Bill To:', 50, 150);
    doc.text(`Name: ${data.Name}`, 50, 165);
    doc.text(`Email: ${data.Email}`, 50, 180);
    doc.text(`Phone: ${data.Phone}`, 50, 195);

    // Project details
    doc.text('Project Details:', 50, 215);
    doc.text(`Type: ${data['Project Type']}`, 50, 230);
    doc.text(`Description: ${data['Specific Needs'] || 'N/A'}`, 50, 245, { width: 400 });

    // Line items table
    doc.text('Items:', 50, 270);
    let yPos = 285;
    lineItems.forEach(item => {
        doc.text(`${item.desc}`, 50, yPos);
        doc.text(`Qty: ${item.qty}, Price: ₦${item.price.toLocaleString()}, Total: ₦${item.total.toLocaleString()}`, 280, yPos);
        yPos += 15;
    });

    // Total (no tax)
    yPos += 10;
    doc.fontSize(12).text(`Total: ₦${total.toLocaleString()}`, 280, yPos);

    // Footer
    doc.fontSize(8).text('Thank you for choosing Justo Zeal. For inquiries, contact us at +234 811 437 7822 or Justozeal1@gmail.com', 50, 700, { width: 500 });

    doc.end();

    return new Promise(resolve => {
        doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
}

// Function to send email
async function sendEmail(data, pdfBuffer, total) {
    const msg = {
        to: data.Email,
        from: 'Justozeal1@gmail.com',
        subject: `Your Justo Zeal Invoice - ${data.invoiceNumber}`,
        html: `
            <p>Dear ${data.Name},</p>
            <p>Thank you for your interest in our ${data['Project Type']} services. We have prepared your invoice for the following project: ${data['Specific Needs'] || 'N/A'}.</p>
            <p><strong>Invoice Details:</strong></p>
            <ul>
                <li>Invoice Number: ${data.invoiceNumber}</li>
                <li>Total Amount: ₦${total.toLocaleString()}</li>
                <li>Due Date: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</li>
            </ul>
            <p>Please find the attached PDF invoice for your records. If you have any questions, feel free to contact us at Justozeal1@gmail.com or +234 811 437 7822.</p>
            <p>Best regards,<br>The Justo Zeal Team</p>
        `,
        attachments: [
            {
                content: pdfBuffer.toString('base64'),
                filename: `Invoice-${data.invoiceNumber}.pdf`,
                type: 'application/pdf',
                disposition: 'attachment'
            }
        ]
    };
    await sgMail.send(msg);
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const data = JSON.parse(event.body);

        // Validate input
        validateInput(data);

        // Calculate pricing (no tax)
        const { subtotal, lineItems } = calculateLineItems(data);
        const total = subtotal;

        // Verify total matches
        if (Math.abs(total - parseFloat(data.total)) > 0.01) {
            throw new Error('Calculated total does not match provided total');
        }

        // Generate PDF
        const pdfBuffer = await generatePDF(data, lineItems, total);

        // Send email
        await sendEmail(data, pdfBuffer, total);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Form submitted successfully. Invoice sent to your email.' })
        };
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message || 'Failed to process form' })
        };
    }
};