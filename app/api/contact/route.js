import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { headers } from 'next/headers';

// Rate limiting 
const RATE_LIMIT_WINDOW = 3600000;
const MAX_REQUESTS_PER_WINDOW = 5;
const requestLog = new Map();

// Validation 
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{9,}$/;
const MAX_MESSAGE_LENGTH = 1000;
const BLOCKED_DOMAINS = ['tempmail.com', 'throwawaymail.com'];
const SPAM_KEYWORDS = ['casino', 'lottery', 'viagra', 'crypto'];

// transporter 
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
    for (const [savedIp, { timestamp }] of requestLog.entries()) {
        if (timestamp < windowStart) {
            requestLog.delete(savedIp);
        }
    }
    // Check current IP's requests
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

function validateEmail(email) {
    if (!EMAIL_REGEX.test(email)) return false;
    const domain = email.split('@')[1];
    return !BLOCKED_DOMAINS.includes(domain);
}

function checkForSpam(text) {
    const lowerText = text.toLowerCase();
    return !SPAM_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

function sanitizeInput(str) {
    return str
        .replace(/[<>]/g, '')
        .trim();
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

        // Get and validate request data
        const { fullname, email, phone, subject, message } = await req.json();

        // Input validation
        if (!fullname || fullname.length < 4 || fullname.length > 100) {
            return NextResponse.json({
                error: 'არასწორი სახელი'
            }, { status: 400 });
        }

        if (!validateEmail(email)) {
            return NextResponse.json({
                error: 'არასწორი ემაილი'
            }, { status: 400 });
        }

        if (!PHONE_REGEX.test(phone)) {
            return NextResponse.json({
                error: 'არასწორი ტელეფონის ნომერი'
            }, { status: 400 });
        }

        if (!subject || subject.length < 2 || subject.length > 200) {
            return NextResponse.json({
                error: 'არასწორი თემა'
            }, { status: 400 });
        }

        if (!message || message.length > MAX_MESSAGE_LENGTH) {
            return NextResponse.json({
                error: 'შეტყობინება ძალიან გრძელია'
            }, { status: 400 });
        }

        // Check for spam content
        if (!checkForSpam(message) || !checkForSpam(subject)) {
            return NextResponse.json({
                error: 'შეტყობინება შეიცავს აკრძალულ კონტენტს'
            }, { status: 400 });
        }

        // Sanitize all inputs
        const sanitizedData = {
            fullname: sanitizeInput(fullname),
            email: sanitizeInput(email),
            phone: sanitizeInput(phone),
            subject: sanitizeInput(subject),
            message: sanitizeInput(message)
        };

        const mailOptions = {
            from: 'nikagermanishvili5@gmail.com',
            to: 'nikagermanishvili8@gmail.com',
            subject: `ახალი შეტყობინება: ${sanitizedData.subject}`,
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
                        .message-section {
                            background: #f9fafb;
                            padding: 20px;
                            border-radius: 4px;
                            margin-top: 20px;
                        }
                        .message-content {
                            line-height: 1.6;
                            color: #374151;
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
                            <h2>ახალი შეტყობინება</h2>
                        </div>
                        <div class="ticket-content">
                            <div class="info-item">
                                <div class="info-label">გამომგზავნი</div>
                                <div class="info-value">${sanitizedData.fullname}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">ელ-ფოსტა</div>
                                <div class="info-value">${sanitizedData.email}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">ტელეფონი</div>
                                <div class="info-value">${sanitizedData.phone}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">თემა</div>
                                <div class="info-value">${sanitizedData.subject}</div>
                            </div>
                            <div class="message-section">
                                <div class="info-label">შეტყობინება</div>
                                <div class="message-content">${sanitizedData.message}</div>
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
            message: 'Email sent successfully',
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