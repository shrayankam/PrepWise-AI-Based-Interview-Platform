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
//             model: google('gemini-2.0-flash-001'),
            
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


// import { generateText } from "ai";
// import { google } from "@ai-sdk/google";
// import { db } from "@/lib/firebase"; // apna firestore config
// import { getRandomInterviewCover } from "@/lib/utils";


export async function POST(request: Request) {
  try {
    const { type, role, level, techstack, amount, userid } =
      await request.json();

    // ✅ ensure amount is number
    const questionCount = Number(amount);

    const response = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `
IMPORTANT:
Return ONLY valid JSON.
Do NOT add explanations.
Do NOT add markdown.
Do NOT add any text before or after JSON.

Generate ${questionCount} detailed interview questions.

Role: ${role}
Experience Level: ${level}
Tech Stack: ${techstack}
Focus Type: ${type}

Output format EXACTLY like this:
[
  "Question 1 text",
  "Question 2 text"
]
`,
    });

    const rawText = response.text.trim();

    // 🔥 Extract JSON safely (even if Gemini adds text)
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      console.error("Gemini RAW:", rawText);
      throw new Error("Invalid AI response");
    }

    const questions: string[] = JSON.parse(jsonMatch[0]);

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((t: string) => t.trim()),
      questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true, interview }, { status: 200 });
  } catch (error) {
    console.error("SERVER ERROR:", error);

    return Response.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
