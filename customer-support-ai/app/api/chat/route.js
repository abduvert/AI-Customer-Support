import  {NextResponse} from 'next/server';
import Groq from 'groq-sdk';
/*import { ReadableStream } from 'groq-sdk/_shims';*/


const systemprompt = `
You are a highly professional and friendly customer service chatbot for university students.For generic questions just give good answers with good formatting. Be clear and concise

When asked about a specific university - please format your answers clearly with:

- **Bold headings** for categories such as "University Name", "Location", "Programs Offered", "Tuition Fees", "Accommodation", and "Student Life".
- **Bullet points or numbered lists** where appropriate.
- **Line breaks between sections** to ensure clarity and readability.

For example, format the response like this:

**University Name:** XYZ University

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



export async function POST(req){

    const groq = new Groq(
        {
            apiKey : process.env.API_KEY
        }
    );
    const data=await req.json();

    const completion = await  groq.chat.completions.create({
        messages:[
            {
                role: 'user',
                content: systemprompt,
            },
            ...data,
        ],
        model: "llama3-8b-8192",
        stream: true,
        
    })

    const stream = new ReadableStream({
        async start(controller){
            const encoder =new TextEncoder();
            try{
                for await (const chunk of completion){
                    const content = chunk?.choices[0]?.delta?.content;
                    if(content){
                        const text=encoder.encode(content);
                        controller.enqueue(text);
                    }
                }

            }
            catch(error){
                console.error(error);
                controller.error(error);
            }
            finally{
                controller.close();
            }
        }
    })


    return  new NextResponse(stream);




}