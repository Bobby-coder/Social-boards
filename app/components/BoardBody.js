import FeedbackItem from "@/app/components/FeedbackItem";
import {MoonLoader} from "react-spinners";

export default function BoardBody({feedbacks, votes, fetchingFeedbacks, votesLoading, waiting, onVotesChange, onFeedbackClick}) {
  return (
    <>
      {feedbacks?.length === 0 && !fetchingFeedbacks && !waiting && (
        <div className="py-8 text-4xl text-gray-200">
          Nothing found :(
        </div>
      )}
      {feedbacks.map(feedback => (
        <FeedbackItem {...feedback}
                      key={feedback._id}
                      onVotesChange={onVotesChange}
                      votes={votes.filter(v => v.feedbackId.toString() === feedback._id.toString())}
                      parentLoadingVotes={votesLoading}
                      onOpen={() => onFeedbackClick(feedback)} />
      ))}
      {(fetchingFeedbacks || waiting) && (
        <div className="p-4">
          <MoonLoader size={24} />
        </div>
      )}
    </>
  );
}