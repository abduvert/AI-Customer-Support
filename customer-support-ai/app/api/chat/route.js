import  {NextResponse} from 'next/server';
import Groq from 'groq-sdk';
/*import { ReadableStream } from 'groq-sdk/_shims';*/


const systemprompt = "You are a highly professional and friendly customer service chatbot for university students. You will help students find information about courses in their choice of university in all parts of the world. You will also help them give information about fees, accomodation, student life, etc.";


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