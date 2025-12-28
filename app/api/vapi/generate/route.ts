import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import {google} from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET(){
    return Response.json({success:true, data:'THANK YOU!'},{status:200});
}
// export async function POST(request:Request){
//     const {type,role,level,techstack,amount,userid} = await request.json();
//     try{
//         const { text: questions } = await generateText({
//             model: google('gemini-1.5-flash'),
            
//             prompt: `Prepare questions for a job interview...
//                 The job role is ${role}.
//                 The job experience level is ${level}.
//                 The tech stack used in the job is: ${techstack}.
//                 The focus between behavioural and technical questions should lean towards: ${type}.
//                 The amount of questions required is: ${amount}.
//                 Please return only the questions, without any additional text.
//                 The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
//                 Return the questions formatted like this:
//                 ["Question 1", "Question 2", "Question 3"]
                
//                 Thank you! <3
//             `,
//             });
//             const interview = {
//       role: role,
//       type: type,
//       level: level,
//       techstack: techstack.split(","),
//       questions: JSON.parse(questions),
//       userId: userid,
//       finalized: true,
//       coverImage: getRandomInterviewCover(),
//       createdAt: new Date().toISOString(),
//     };
//     await db.collection("interviews").add(interview);

//     return Response.json({ success: true }, { status: 200 });
//     }catch(error){
//         console.error("Error:", error);
//         return Response.json({ success: false, error: error }, { status: 500 });
//     }
// }



// import { db } from "@/firebase/admin";
// import { getRandomInterviewCover } from "@/lib/utils";
// import { google } from "@ai-sdk/google";
// import { generateText } from "ai";

// export async function POST(request: Request) {
//   const { type, role, level, techstack, amount, userid } = await request.json();

//   try {
//     // Call Gemini API with error handling for quota issues
//     let questionsText: string | null = null;

//     try {
//       const response = await generateText({
//         model: google("gemini-2.0-flash-001"),
//         prompt: `Prepare questions for a job interview...
// The job role is ${role}.
// The job experience level is ${level}.
// The tech stack used in the job is: ${techstack}.
// The focus between behavioural and technical questions should lean towards: ${type}.
// The amount of questions required is: ${amount}.
// Please return only the questions, without any additional text.
// The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
// Return the questions formatted like this:
// ["Question 1", "Question 2", "Question 3"]

// Thank you! <3`,
//       });

//       questionsText = response.text;
//     } catch (aiError: any) {
//       console.error("AI API Error:", aiError);

//       // If quota exceeded or API fails, fallback with placeholder questions
//       questionsText = JSON.stringify(
//         Array.from({ length: amount }, (_, i) => `Question ${i + 1}`)
//       );
//     }

//     // Parse questions safely
//     const questions = (() => {
//       try {
//         return JSON.parse(questionsText!);
//       } catch {
//         return Array.from({ length: amount }, (_, i) => `Question ${i + 1}`);
//       }
//     })();

//     // Build the interview object
//     const interview = {
//       role,
//       type,
//       level,
//       techstack: techstack.split(","),
//       questions,
//       userId: userid,
//       finalized: true,
//       coverImage: getRandomInterviewCover(),
//       createdAt: new Date().toISOString(),
//     };

//     // Save to Firestore
//     await db.collection("interviews").add(interview);

//     return Response.json({ success: true, interview }, { status: 200 });
//   } catch (error) {
//     console.error("Server Error:", error);
//     return Response.json({ success: false, error: error }, { status: 500 });
//   }
// }




export async function POST(request: Request) {
    const { type, role, level, techstack, amount, userid } = await request.json();
    
    try {
        
        const { text: questions } = await generateText({
            model: google('gemini-2.5-flash'), 
            
            prompt: `Prepare questions for a job interview...
                The job role is ${role}.
                The job experience level is ${level}.
                The tech stack used in the job is: ${techstack}.
                The focus between behavioural and technical questions should lean towards: ${type}.
                The amount of questions required is: ${amount}.
                Please return only the questions, without any additional text.
                The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
                Return the questions formatted like this:
                ["Question 1", "Question 2", "Question 3"]
                
                Thank you! <3
            `,
        });

        // Parse the questions string into an array
        let questionsArray;
        try {
            questionsArray = JSON.parse(questions);
        } catch (parseError) {
            // If JSON parsing fails, try to extract array from text
            console.log("Raw response:", questions);
            
            // Try to extract array from the text response
            const arrayMatch = questions.match(/\[.*\]/s);
            if (arrayMatch) {
                try {
                    questionsArray = JSON.parse(arrayMatch[0]);
                } catch {
                    // If still fails, split by new lines
                    questionsArray = questions
                        .split('\n')
                        .filter(q => q.trim().length > 0 && !q.includes('```'))
                        .map(q => q.replace(/^[\d.\-•*]+/, '').trim());
                }
            } else {
                // Fallback: split by new lines
                questionsArray = questions
                    .split('\n')
                    .filter(q => q.trim().length > 0)
                    .map(q => q.replace(/^[\d.\-•*]+/, '').trim());
            }
        }

        const interview = {
            role: role,
            type: type,
            level: level,
            techstack: techstack.split(",").map((t:string) => t.trim()), // Added trim for cleaner array
            questions: questionsArray,
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };

        await db.collection("interviews").add(interview);

        return Response.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return Response.json({ 
            success: false, 
            error:  "Internal server error" 
        }, { status: 500 });
    }
}