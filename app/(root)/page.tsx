import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { dummyInterviews } from '@/constants/index'
import { getCurrentUser, getInterviewByUserId, getLatestInterviews } from '@/lib/actions/auth.action'
import { Link } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const page = async() => {
  const user= await getCurrentUser();
  const[userInterviews,latestInterviews]=await Promise.all([
    await getInterviewByUserId(user?.id!),
    await getLatestInterviews({userId:user?.id!})
  ])


  const hasPastInterviews=userInterviews?.length >0;
  const hasUpcomingInterviews=latestInterviews?.length >0;

  return (
    <>
    <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <a href="/interview">Start an interview</a>
          </Button>


        </div>
         <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section> 

       <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>

        {/* <div className="interviews-section">
          {dummyInterviews.map((interview)=>(
            <InterviewCard{...interview} key={interview.id}/>
          ))}
        </div>  */}
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Interviews</h2>

        {/* <div className="interviews-section">
        <div className="interviews-section">
          {dummyInterviews.map((interview)=>(
            <InterviewCard{...interview} key={interview.id}/>
          ))}
        </div> 
        <p>You haven't taken any interviews yet!</p>
        </div> */}
        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no new interviews available</p>
          )}
        </div>
      </section>  
    </>
  )
}

export default page
