const PDFDocument = require('pdfkit');
const sgMail = require('@sendgrid/mail');

// Set SendGrid API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const data = JSON.parse(event.body);
        const { 
            Name, 
            Email, 
            Phone, 
            'Project Type': projectType, 
            'Specific Needs': specificNeeds, 
            'kVA Required': kva, 
            'Number of Batteries': batteries, 
            'Number of Solar Panels': panels, 
            'Rooms for Automation': rooms, 
            'Type of Devices to Automate': devices, 
            'Number of Cameras Required': cameras, 
            'Security System Type': securityType, 
            'Building Size': buildingSize, 
            invoiceNumber, 
            total 
        } = data;

        // Pricing (matching script.js)
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

        // Calculate line items
        let subtotal = 0;
        let lineItems = [];
        if (projectType === 'Solar/Inverter') {
            const kvaCost = (parseFloat(kva) || 0) * PRICING.solarPerKva;
            const batteryCost = (parseInt(batteries) || 0) * PRICING.batteryPerUnit;
            const panelCost = (parseInt(panels) || 0) * PRICING.panelPerUnit;
            subtotal = kvaCost + batteryCost + panelCost;
            lineItems = [
                { desc: `Solar System (${kva || 0} kVA)`, qty: kva || 0, price: PRICING.solarPerKva, total: kvaCost },
                { desc: `Batteries (${batteries || 0} units)`, qty: batteries || 0, price: PRICING.batteryPerUnit, total: batteryCost },
                { desc: `Solar Panels (${panels || 0} units)`, qty: panels || 0, price: PRICING.panelPerUnit, total: panelCost }
            ].filter(item => item.total > 0);
        } else if (projectType === 'Smart Home') {
            subtotal = (parseInt(rooms) || 0) * PRICING.smartHomePerRoom;
            lineItems = [{ desc: `Smart Home Automation (${rooms || 0} rooms, ${devices || ''})`, qty: rooms || 0, price: PRICING.smartHomePerRoom, total: subtotal }];
        } else if (projectType === 'CCTV/Security') {
            const cameraCost = (parseInt(cameras) || 0) * PRICING.cctvPerCamera;
            subtotal = securityType === 'CCTV' ? cameraCost :
                      securityType === 'Alarm' ? PRICING.alarmSystem :
                      securityType === 'Integrated' ? PRICING.integratedSecurity + cameraCost : 0;
            lineItems = [
                { desc: `CCTV Cameras (${cameras || 0} units)`, qty: cameras || 0, price: PRICING.cctvPerCamera, total: cameraCost },
                { desc: `Security System (${securityType || ''})`, qty: 1, price: securityType === 'CCTV' ? 0 : (securityType === 'Alarm' ? PRICING.alarmSystem : PRICING.integratedSecurity), total: securityType === 'CCTV' ? 0 : (securityType === 'Alarm' ? PRICING.alarmSystem : PRICING.integratedSecurity) }
            ].filter(item => item.total > 0);
        } else if (projectType === 'Electrical Wiring') {
            const roomsCount = parseInt(buildingSize || 4);
            subtotal = roomsCount * PRICING.electricalWiringPerRoom;
            lineItems = [{ desc: `Electrical Wiring (${buildingSize || '4 rooms'})`, qty: roomsCount, price: PRICING.electricalWiringPerRoom, total: subtotal }];
        } else if (projectType === 'Multiple') {
            subtotal = PRICING.multipleServicesBase;
            lineItems = [{ desc: `Multiple Services (${specificNeeds})`, qty: 1, price: PRICING.multipleServicesBase, total: subtotal }];
        }

        const taxRate = 0.075;
        const tax = subtotal * taxRate;
        const calculatedTotal = subtotal + tax;

        // Generate PDF
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {});

        doc.fontSize(20).fillColor('#f97316').text('Justo Zeal Invoice', 20, 20);
        doc.fontSize(12).fillColor('black');
        doc.text(`Invoice #: ${invoiceNumber}`, 20, 40);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
        doc.text(`Due Date: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 20, 60);
        doc.text('Bill To:', 20, 80);
        doc.text(`Name: ${Name || 'Client'}`, 20, 90);
        doc.text(`Email: ${Email || 'N/A'}`, 20, 100);
        doc.text(`Phone: ${Phone || 'N/A'}`, 20, 110);
        doc.text('Project Details:', 20, 130);
        doc.text(`Type: ${projectType || 'N/A'}`, 20, 140);
        doc.text(`Description: ${specificNeeds || 'N/A'}`, 20, 150, { width: 400 });
        doc.text('Items:', 20, 170);
        let yPos = 180;
        lineItems.forEach(item => {
            doc.text(`${item.desc}: ₦${item.total.toLocaleString()} (Qty: ${item.qty}, Price: ₦${item.price.toLocaleString()})`, 20, yPos);
            yPos += 10;
        });
        doc.text(`Subtotal: ₦${subtotal.toLocaleString()}`, 20, yPos + 10);
        doc.text(`Tax (7.5%): ₦${tax.toLocaleString()}`, 20, yPos + 20);
        doc.text(`Total: ₦${calculatedTotal.toLocaleString()}`, 20, yPos + 30);
        doc.text('Thank you for choosing Justo Zeal! Contact: +234 811 437 7822 | Justozeal1@gmail.com', 20, 280, { width: 400 });
        doc.end();

        // Wait for PDF buffer
        const pdfBuffer = await new Promise(resolve => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
        });

        // Send email
        if (Email && Email.includes('@')) {
            await sgMail.send({
                to: Email,
                from: 'Justozeal1@gmail.com',
                subject: `Your Justo Zeal Invoice ${invoiceNumber}`,
                text: `Hi ${Name || 'Client'},\n\nThank you for your ${projectType || 'project'} request: ${specificNeeds || 'N/A'}.\n\nYour invoice (${invoiceNumber}) is attached. Total: ₦${calculatedTotal.toLocaleString()}.\n\nContact us at Justozeal1@gmail.com or +234 811 437 7822.\n\nBest,\nJusto Zeal Team`,
                attachments: [
                    {
                        content: pdfBuffer.toString('base64'),
                        filename: `Invoice-${invoiceNumber}.pdf`,
                        type: 'application/pdf',
                        disposition: 'attachment'
                    }
                ]
            });
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Form submitted, invoice sent' })
        };
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process form' })
        };
    }
};