import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import nodemailer from 'nodemailer';

// Rate limiting 
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;
const requestLog = new Map();

// Validation 
const PHONE_REGEX = /^\d{9,}$/;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nikagermanishvili5@gmail.com',
        pass: 'gkko zoxo imet apud'
    }
});

function checkRateLimit(ip) {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    // Clear old entries
    for (const [savedIp, { timestamp }] of requestLog.entries()) {
        if (timestamp < windowStart) {
            requestLog.delete(savedIp);
        }
    }

    const ipData = requestLog.get(ip) || { count: 0, timestamp: now };
    if (ipData.count >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }

    requestLog.set(ip, {
        count: ipData.count + 1,
        timestamp: now
    });
    return true;
}

function sanitizeInput(str) {
    if (!str) return '';
    return str.replace(/[<>]/g, '').trim();
}

export async function POST(req) {
    try {
        const headersList = headers();
        const ip = headersList.get('x-forwarded-for') || 'unknown';

        if (!checkRateLimit(ip)) {
            return NextResponse.json({
                error: 'გთხოვთ სცადოთ მოგვიანებით'
            }, { status: 429 });
        }

        const { fullname, phone, terms_accepted, marketing_accepted } = await req.json();

        // Input validation
        if (!fullname || fullname.length < 2 || fullname.length > 100) {
            return NextResponse.json({
                error: 'არასწორი სახელი'
            }, { status: 400 });
        }

        if (!phone || !PHONE_REGEX.test(phone)) {
            return NextResponse.json({
                error: 'არასწორი ტელეფონის ნომერი'
            }, { status: 400 });
        }

        if (!terms_accepted || !marketing_accepted) {
            return NextResponse.json({
                error: 'გთხოვთ დაეთანხმოთ წესებს და პირობებს'
            }, { status: 400 });
        }

        // Sanitize inputs
        const sanitizedData = {
            fullname: sanitizeInput(fullname),
            phone: sanitizeInput(phone),
        };

        const mailOptions = {
            from: 'nikagermanishvili5@gmail.com',
            to: 'nikagermanishvili5@gmail.com',
            subject: `ზარის მოთხოვნა: ${sanitizedData.fullname}`,
            html: `
            <!DOCTYPE html> 
            <html>
                <head>
                    <style>
                        .ticket-container {
                            max-width: 600px;
                            margin: 0 auto;
                            font-family: Arial, sans-serif;
                            border: 1px solid #e0e0e0;
                            border-radius: 8px;
                            overflow: hidden;
                        }
                        .ticket-header {
                            background: #2563eb;
                            color: white;
                            padding: 20px;
                            text-align: left;
                        }
                        .ticket-header h2 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .ticket-content {
                            padding: 30px;
                            background: #ffffff;
                        }
                        .info-item {
                            margin-bottom: 20px;
                            border-bottom: 1px solid #f0f0f0;
                            padding-bottom: 15px;
                        }
                        .info-label {
                            color: #666;
                            font-size: 14px;
                            margin-bottom: 5px;
                        }
                        .info-value {
                            color: #333;
                            font-size: 16px;
                            font-weight: 500;
                        }
                        .terms-section {
                            background: #f9fafb;
                            padding: 20px;
                            border-radius: 4px;
                            margin-top: 20px;
                        }
                        .footer {
                            background: #f3f4f6;
                            padding: 15px;
                            text-align: center;
                            font-size: 12px;
                            color: #6b7280;
                        }
                    </style>
                </head>
                <body>
                    <div class="ticket-container">
                        <div class="ticket-header">
                            <h2>ზარის მოთხოვნა</h2>
                        </div>
                        <div class="ticket-content">
                            <div class="info-item">
                                <div class="info-label">სახელი</div>
                                <div class="info-value">${sanitizedData.fullname}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">ტელეფონი</div>
                                <div class="info-value">${sanitizedData.phone}</div>
                            </div>
                            <div class="terms-section">
                                <div class="info-label">დამატებითი ინფორმაცია</div>
                                <div class="info-value">
                                    • წესები და პირობები: ${terms_accepted ? 'დათანხმდა' : 'არ დათანხმებულა'}<br>
                                    • მარკეტინგული კომუნიკაცია: ${marketing_accepted ? 'დათანხმდა' : 'არ დათანხმებულა'}
                                </div>
                            </div>
                        </div>
                        <div class="footer">
                            გაგზავნილია Formus.ge-ს საკონტაქტო ფორმიდან | IP: ${ip}
                        </div>
                    </div>
                </body>
            </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info);

        return NextResponse.json({
            message: 'მონაცემები წარმატებით გაიგზავნა',
            info: info
        }, { status: 200 });

    } catch (error) {
        console.error('Detailed error:', error);
        return NextResponse.json({
            error: error.message || 'შეტყობინების გაგზავნა ვერ მოხერხდა',
            details: error.toString()
        }, { status: 500 });
    }
}