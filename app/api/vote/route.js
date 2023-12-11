import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {canWeAccessThisBoard} from "@/app/libs/boardApiFunctions";
import {Board} from "@/app/models/Board";
import {Feedback} from "@/app/models/Feedback";
import {Vote} from "@/app/models/Vote";
import {Notification} from "@/app/models/Notification";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";

export async function GET(request) {
  const url = new URL(request.url);
  if (url.searchParams.get('feedbackIds')) {
    const feedbackIds = url.searchParams.get('feedbackIds').split(',');
    const votesDocs = await Vote.find({feedbackId: feedbackIds});
    return Response.json(votesDocs);
  }
  return Response.json([]);
}

async function recountVotes(feedbackId) {
  const count = await Vote.countDocuments({feedbackId});
  await Feedback.updateOne({_id:feedbackId}, {
    votesCountCached: count,
  });
}

export async function POST(request) {
  mongoose.connect(process.env.MONGO_URL);
  const jsonBody = await request.json();
  const {feedbackId} = jsonBody;
  const session = await getServerSession(authOptions);
  const {email:userEmail} = session.user;

  const feedback = await Feedback.findById(feedbackId);
  const board = await Board.findOne({slug:feedback.boardName});
  if (board.archived) {
    return new Response('Unauthorized', {status:401});
  }
  if (!canWeAccessThisBoard(userEmail, board)) {
    return new Response('Unauthorized', {status:401});
  }

  // find existing vote
  const existingVote = await Vote.findOne({feedbackId, userEmail});
  if (existingVote) {
    await Vote.findByIdAndDelete(existingVote._id);
    await recountVotes(feedbackId);
    return Response.json(existingVote);
  } else {
    const voteDoc = await Vote.create({feedbackId, userEmail});
    await recountVotes(feedbackId);
    await Notification.create({
      type:'vote',
      sourceUserName: session?.user?.name,
      destinationUserEmail: feedback.userEmail,
      feedbackId: feedback._id,
    });
    return Response.json(voteDoc);
  }
}