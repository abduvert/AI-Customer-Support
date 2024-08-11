import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const systemPromptDetailed = `
You are a highly professional and friendly customer service chatbot for COMSATS University, covering all campuses. You should only provide information related to COMSATS University and no other institutions. If asked about another university, politely inform the user that you only have information about COMSATS University.

For queries related to COMSATS University, format your answers clearly with:

- **Bold headings** for categories such as "University Name", "Location", "Programs Offered", "Tuition Fees", "Accommodation", and "Student Life".
- **Bullet points or numbered lists** where appropriate.
- **Line breaks between sections** to ensure clarity and readability.
- *Semi-bold headings* where appropriate

For example, format the response like this:

**University Name:** COMSATS University

**Location:** City, Country

**Programs Offered:**
1. Program 1
2. Program 2

**Tuition Fees:**
- **Local students:** $XXXX per year
- **International students:** $XXXX per year

**Accommodation:** 
- On-campus options: Dormitories, Apartments.
- Off-campus options: Nearby housing complexes.

**Student Life:**
- **Clubs and Societies:** Over 30 student-run organizations.
- **Support Services:** Academic counseling, health services, career guidance.

Ensure each section is well-organized and easy to read.
`;

const systemPromptSimple = `
You are a basic chatbot providing simple responses only related to COMSATS University. You do not have information about other universities. Handle general inquiries about COMSATS University with brief and clear answers.
`;


const evaluateComplexity = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const complexKeywords = ['university', 'programs', 'fees', 'accommodation', 'student life', 'admissions', 'courses'];
    const simpleKeywords = ['address', 'contact', 'location', 'hours', 'phone number'];

    const hasComplexKeywords = complexKeywords.some(keyword => lowerCaseQuery.includes(keyword));

    const hasSimpleKeywords = simpleKeywords.some(keyword => lowerCaseQuery.includes(keyword));

    if (hasComplexKeywords) {
        return true; 
    }

    if (hasSimpleKeywords || lowerCaseQuery.length <= 10) {
        return false; 
    }

    return lowerCaseQuery.length > 50; 
};


export async function POST(req) {
    const groq = new Groq({
        apiKey: process.env.API_KEY
    });
    const data = await req.json();


    const isComplexQuery = evaluateComplexity(data[0]?.content || '');
    const systemPrompt = isComplexQuery ? systemPromptDetailed : systemPromptSimple;
    const model = isComplexQuery ? 'llama3-8b-8192' : 'gemma-7b-it';  

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: systemPrompt,
            },
            ...data,
        ],
        model: model,
        stream: true,
    });

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const chunk of completion) {
                    const content = chunk?.choices[0]?.delta?.content;
                    if (content) {
                        const text = encoder.encode(content);
                        controller.enqueue(text);
                    }
                }
            } catch (error) {
                console.error(error);
                controller.error(error);
            } finally {
                controller.close();
            }
        }
    });

    return new NextResponse(stream);
}
