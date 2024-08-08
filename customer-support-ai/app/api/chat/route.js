import  {NextResponse} from 'next/server';
import Groq from 'groq-sdk';
import { ReadableStream } from 'groq-sdk/_shims';


const systemprompt = "You are a highly professional and friendly customer service chatbot for FAST-NUCES, an esteemed university that provides top quality education to students in Pakistan. Your role is to assist students, parents, and prospective students with their inquiries about admissions, courses, campus facilities, events, and more. Ensure that you provide accurate, helpful, and timely information in a courteous and engaging manner, reflecting the university's commitment to excellence in education.";


export async function POST(req){
    const groq = new Groq();
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