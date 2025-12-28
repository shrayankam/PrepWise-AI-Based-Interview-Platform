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

    let questionsText: string;

    // ================= GEMINI CALL =================
    try {
      const response = await generateText({
        model: google("gemini-2.0-flash-001"),
        prompt: `
You are a JSON API.

Generate ${amount} detailed interview questions.

Role: ${role}
Experience Level: ${level}
Tech Stack: ${techstack}
Focus Type: ${type}

STRICT RULES:
- Return ONLY valid JSON
- Output MUST be a JSON array of strings
- NO markdown
- NO explanation
- NO backticks
- NO special characters like / * -
- Each question should be detailed and professional

Example format:
[
  "Explain how Next.js handles server-side rendering and why it is useful.",
  "How would you optimize performance in a large React application?"
]
`,
      });

      questionsText = response.text;
    } catch (aiError) {
      console.error("Gemini API failed:", aiError);

      // fallback
      questionsText = JSON.stringify(
        Array.from({ length: amount }, (_, i) => `Question ${i + 1}`)
      );
    }

    // ================= CLEAN RESPONSE =================
    const cleanedText = questionsText
      .trim()
      .replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    // ================= SAFE PARSE =================
    let questions: string[];

    try {
      questions = JSON.parse(cleanedText);

      // validation
      if (!Array.isArray(questions)) throw new Error("Not array");
      if (questions.some(q => typeof q !== "string"))
        throw new Error("Invalid question type");

    } catch (err) {
      console.error("JSON parse failed:", cleanedText);

      questions = Array.from(
        { length: amount },
        (_, i) => `Question ${i + 1}`
      );
    }

    // ================= BUILD INTERVIEW =================
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

    // ================= SAVE TO FIRESTORE =================
    await db.collection("interviews").add(interview);

    return Response.json(
      { success: true, interview },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server Error:", error);

    return Response.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
