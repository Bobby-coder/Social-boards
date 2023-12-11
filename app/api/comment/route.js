import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {Board} from "@/app/models/Board";
import {Comment} from "@/app/models/Comment";
import {Feedback} from "@/app/models/Feedback";
import {Notification} from "@/app/models/Notification";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);
  const jsonBody = await req.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(false);
  }
  const feedback = await Feedback.findById(jsonBody.feedbackId);
  const board = await Board.findOne({slug:feedback.boardName});
  if (board.archived) {
    return new Response('Unauthorized', {status: 401});
  }

  const commentDoc = await Comment.create({
    text: jsonBody.text,
    uploads: jsonBody.uploads,
    userEmail: session.user.email,
    feedbackId: jsonBody.feedbackId,
  });
  await Notification.create({
    type:'comment',
    sourceUserName: session?.user?.name,
    destinationUserEmail: feedback.userEmail,
    feedbackId: feedback._id,
  });
  return Response.json(commentDoc);
}

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);
  const jsonBody = await req.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(false);
  }
  const {id, text, uploads} = jsonBody;
  const comment = await Comment.findById(id);
  const feedback = await Feedback.findById(comment.feedbackId);
  const board = await Board.findOne({slug:feedback.boardName});
  if (board.archived) {
    return new Response('Unauthorized', {status: 401});
  }
  const updatedCommentDoc = await Comment.findOneAndUpdate(
    {userEmail: session.user.email, _id: id},
    {text, uploads},
  );
  return Response.json(updatedCommentDoc);
}

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);
  const url = new URL(req.url);
  if (url.searchParams.get('feedbackId')) {
    const result = await Comment
      .find({feedbackId:url.searchParams.get('feedbackId')})
      .populate('user');
    return Response.json(result);
  }
  return Response.json(false);
}