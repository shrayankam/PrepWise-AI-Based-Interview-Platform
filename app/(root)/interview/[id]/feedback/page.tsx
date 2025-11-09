import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
//     <section className="section-feedback">
//       <div className="flex flex-row justify-center">
//         <h1 className="text-4xl font-semibold">
//           Feedback on the Interview -{" "}
//           <span className="capitalize">{interview.role}</span> Interview
//         </h1>
//       </div>

//       <div className="flex flex-row justify-center ">
//         <div className="flex flex-row gap-5">
//           {/* Overall Impression */}
//           <div className="flex flex-row gap-2 items-center">
//             <Image src="/star.svg" width={22} height={22} alt="star" />
//             <p>
//               Overall Impression:{" "}
//               <span className="text-primary-200 font-bold">
//                 {feedback?.totalScore}
//               </span>
//               /100
//             </p>
//           </div>

//           {/* Date */}
//           <div className="flex flex-row gap-2">
//             <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
//             <p>
//               {feedback?.createdAt
//                 ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
//                 : "N/A"}
//             </p>
//           </div>
//         </div>
//       </div>

//       <hr />

//       <p>{feedback?.finalAssessment}</p>

//       {/* Interview Breakdown */}
//       <div className="flex flex-col gap-4">
//         <h2>Breakdown of the Interview:</h2>
//         {feedback?.categoryScores &&
//   Object.entries(feedback.categoryScores).map(([key, value]) => (
//     <div key={key}>
//       <p className="font-bold">
//         {key.replace(/([A-Z])/g, " $1")}: {value.score}/100
//       </p>
//       <p className="text-gray-600">{value.comment}</p>
//     </div>
//   ))}

//       </div>

//       <div className="flex flex-col gap-3">
//         <h3>Strengths</h3>
//         <ul>
//   {Array.isArray(feedback?.strengths) && feedback.strengths.length > 0 ? (
//     feedback.strengths.map((strength, index) => (
//       <li key={index}>{strength}</li>
//     ))
//   ) : (
//     <li>No strengths available.</li>
//   )}
// </ul>

//       </div>

//       <div className="flex flex-col gap-3">
//         <h3>Areas for Improvement</h3>
//         <ul>
//           {feedback?.areasForImprovement?.map((area, index) => (
//             <li key={index}>{area}</li>
//           ))}
//         </ul>
//       </div>

//       <div className="buttons">
//         <Button className="btn-secondary flex-1">
//           <Link href="/" className="flex w-full justify-center">
//             <p className="text-sm font-semibold text-primary-200 text-center">
//               Back to dashboard
//             </p>
//           </Link>
//         </Button>

//         <Button className="btn-primary flex-1">
//           <Link
//             href={`/interview/${id}`}
//             className="flex w-full justify-center"
//           >
//             <p className="text-sm font-semibold text-black text-center">
//               Retake Interview
//             </p>
//           </Link>
//         </Button>
//       </div>
//     </section>
//   );
// };
<section className="section-feedback">
  <div className="flex flex-row justify-center">
    <h1 className="text-4xl font-semibold">
      Feedback on the Interview -{" "}
      <span className="capitalize">{interview.role}</span> Interview
    </h1>
  </div>

  <div className="flex flex-row justify-center">
    <div className="flex flex-row gap-5">
      {/* Overall Impression */}
      <div className="flex flex-row gap-2 items-center">
        <Image src="/star.svg" width={22} height={22} alt="star" />
        <p>
          Overall Impression:{" "}
          <span className="text-primary-200 font-bold">
            {feedback?.totalScore}
          </span>
          /100
        </p>
      </div>

      {/* Date */}
      <div className="flex flex-row gap-2">
        <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
        <p>
          {feedback?.createdAt
            ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
            : "N/A"}
        </p>
      </div>
    </div>
  </div>

  <hr className="my-4" />

  {/* Final Assessment */}
  <p className="text-lg text-gray-800 mb-4">
    {feedback?.finalAssessment || "No final assessment available."}
  </p>

  {/* Interview Breakdown */}
  <div className="flex flex-col gap-4">
    <h2 className="text-xl font-semibold">Breakdown of the Interview:</h2>

    {feedback?.categoryScores ? (
      Object.entries(feedback.categoryScores).map(
        ([key, value]: [string, any]) => (
          <div key={key}>
            <p className="font-bold">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
              : {value.score}/100
            </p>
            <p className="text-gray-600">{value.comment}</p>
          </div>
        )
      )
    ) : (
      <p>No category scores available.</p>
    )}
  </div>

  {/* Strengths */}
  <div className="flex flex-col gap-3 mt-6">
    <h3 className="text-lg font-semibold">Strengths</h3>
    <ul className="list-disc ml-6">
      {typeof feedback?.strengths === "string" ? (
        feedback.strengths
          .split("\n")
          .filter(Boolean)
          .map((strength: string, index: number) => (
            <li key={index}>{strength.trim()}</li>
          ))
      ) : Array.isArray(feedback?.strengths) &&
        feedback.strengths.length > 0 ? (
        feedback.strengths.map((strength: string, index: number) => (
          <li key={index}>{strength}</li>
        ))
      ) : (
        <li>No strengths available.</li>
      )}
    </ul>
  </div>

  {/* Areas for Improvement */}
  <div className="flex flex-col gap-3 mt-6">
    <h3 className="text-lg font-semibold">Areas for Improvement</h3>
    <ul className="list-disc ml-6">
      {typeof feedback?.areasForImprovement === "string" ? (
        feedback.areasForImprovement
          .split("\n")
          .filter(Boolean)
          .map((area: string, index: number) => (
            <li key={index}>{area.trim()}</li>
          ))
      ) : Array.isArray(feedback?.areasForImprovement) &&
        feedback.areasForImprovement.length > 0 ? (
        feedback.areasForImprovement.map((area: string, index: number) => (
          <li key={index}>{area}</li>
        ))
      ) : (
        <li>No areas for improvement available.</li>
      )}
    </ul>
  </div>

  {/* Buttons */}
  <div className="buttons flex flex-row gap-4 mt-8">
    <Button className="btn-secondary flex-1">
      <Link href="/" className="flex w-full justify-center">
        <p className="text-sm font-semibold text-primary-200 text-center">
          Back to Dashboard
        </p>
      </Link>
    </Button>

    <Button className="btn-primary flex-1">
      <Link href={`/interview/${id}`} className="flex w-full justify-center">
        <p className="text-sm font-semibold text-black text-center">
          Retake Interview
        </p>
      </Link>
    </Button>
  </div>
</section>
  )};

export default Feedback;
