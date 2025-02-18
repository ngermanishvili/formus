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

        const currentDate = new Date().toLocaleString('ka-GE', {
            timeZone: 'Asia/Tbilisi',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const mailOptions = {
            from: 'nikagermanishvili5@gmail.com',
            to: 'info@formus.ge',
            subject: `ახალი მოთხოვნა - ${sanitizedData.fullname}`,
            html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                            line-height: 1.6;
                            color: #1F2937;
                        }
                        .email-wrapper {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #F9FAFB;
                        }
                        .email-header {
                            background: linear-gradient(135deg, #1E40AF 0%, #1D4ED8 100%);
                            padding: 32px 40px;
                            text-align: center;
                        }
                        .header-title {
                            color: #FFFFFF;
                            font-size: 24px;
                            font-weight: 600;
                            margin: 0;
                            letter-spacing: -0.5px;
                        }
                        .header-subtitle {
                            color: #E5E7EB;
                            font-size: 16px;
                            margin-top: 8px;
                        }
                        .email-content {
                            background: #FFFFFF;
                            padding: 40px;
                            border-radius: 8px;
                            margin: 24px;
                            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                        }
                        .section {
                            margin-bottom: 32px;
                            padding-bottom: 24px;
                            border-bottom: 1px solid #E5E7EB;
                        }
                        .section:last-child {
                            margin-bottom: 0;
                            padding-bottom: 0;
                            border-bottom: none;
                        }
                        .section-title {
                            font-size: 14px;
                            text-transform: uppercase;
                            color: #6B7280;
                            letter-spacing: 0.1em;
                            margin-bottom: 16px;
                            font-weight: 600;
                        }
                        .info-grid {
                            display: grid;
                            grid-template-columns: repeat(2, 1fr);
                            gap: 24px;
                        }
                        .info-item {
                            background: #F9FAFB;
                            padding: 16px;
                            border-radius: 6px;
                            border: 1px solid #E5E7EB;
                        }
                        .info-label {
                            font-size: 13px;
                            color: #6B7280;
                            margin-bottom: 4px;
                        }
                        .info-value {
                            font-size: 16px;
                            color: #111827;
                            font-weight: 500;
                        }
                        .consent-item {
                            display: flex;
                            align-items: center;
                            margin-bottom: 12px;
                            background: #F9FAFB;
                            padding: 12px 16px;
                            border-radius: 6px;
                            border: 1px solid #E5E7EB;
                        }
                        .consent-icon {
                            width: 20px;
                            height: 20px;
                            margin-right: 12px;
                            background-color: #059669;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-shrink: 0;
                        }
                        .consent-icon::before {
                            content: "✓";
                            color: white;
                            font-size: 12px;
                            font-weight: bold;
                        }
                        .consent-text {
                            font-size: 14px;
                            color: #374151;
                        }
                        .email-footer {
                            text-align: center;
                            padding: 24px;
                            color: #6B7280;
                            font-size: 13px;
                        }
                        .timestamp {
                            color: #9CA3AF;
                            font-size: 12px;
                            text-align: center;
                            margin-top: 8px;
                        }
                        .divider {
                            height: 1px;
                            background-color: #E5E7EB;
                            margin: 16px 0;
                        }
                        @media (max-width: 600px) {
                            .email-header {
                                padding: 24px 20px;
                            }
                            .email-content {
                                padding: 24px;
                                margin: 16px;
                            }
                            .info-grid {
                                grid-template-columns: 1fr;
                                gap: 16px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="email-wrapper">
                        <div class="email-header">
                            <h1 class="header-title">ახალი მოთხოვნა მიღებულია</h1>
                            <p class="header-subtitle">დაკავშირების მოთხოვნა Formus.ge-დან</p>
                        </div>
                        
                        <div class="email-content">
                            <div class="section">
                                <h2 class="section-title">მომხმარებლის ინფორმაცია</h2>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <div class="info-label">სახელი და გვარი</div>
                                        <div class="info-value">${sanitizedData.fullname}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">ტელეფონის ნომერი</div>
                                        <div class="info-value">${sanitizedData.phone}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="section">
                                <h2 class="section-title">თანხმობები</h2>
                                <div class="consent-item">
                                    <span class="consent-icon"></span>
                                    <span class="consent-text">წესები და პირობები</span>
                                </div>
                                <div class="consent-item">
                                    <span class="consent-icon"></span>
                                    <span class="consent-text">მარკეტინგული კომუნიკაცია</span>
                                </div>
                            </div>

                            <div class="section">
                                <h2 class="section-title">ტექნიკური ინფორმაცია</h2>
                                <div class="info-item">
                                    <div class="info-label">IP მისამართი</div>
                                    <div class="info-value">${ip}</div>
                                </div>
                            </div>

                            <div class="timestamp">
                                მოთხოვნა მიღებულია: ${currentDate}
                            </div>
                        </div>

                        <div class="email-footer">
                            <div>© 2025 Formus.ge - ყველა უფლება დაცულია</div>
                            <div class="divider"></div>
                            <div>ეს არის ავტომატური შეტყობინება, გთხოვთ არ უპასუხოთ</div>
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