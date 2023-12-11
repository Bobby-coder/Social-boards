import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {canWeAccessThisBoard} from "@/app/libs/boardApiFunctions";
import {Board} from "@/app/models/Board";
import mongoose from "mongoose";
import {Feedback} from "@/app/models/Feedback";
import {Comment} from '@/app/models/Comment';
import {getServerSession} from "next-auth";

export async function POST(request) {
  const jsonBody = await request.json();
  const {title, description, uploads, boardName} = jsonBody;
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const session = await getServerSession(authOptions);
  const userEmail = session.user.email;
  const boardDoc = await Board.findOne({slug:boardName});
  if (!canWeAccessThisBoard(userEmail, boardDoc)) {
    return new Response('Unauthorized', {status:401});
  }
  const feedbackDoc = await Feedback.create({
    title, description, uploads, userEmail, boardName,
  });
  return Response.json(feedbackDoc);
}

export async function PUT(request) {
  const jsonBody = await request.json();
  const {title, description, uploads, id, status} = jsonBody;
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(false);
  }

  const feedbackDoc = await Feedback.findById(id);
  const boardName = feedbackDoc.boardName;
  const isAdmin = await Board.exists({
    name:boardName,
    adminEmail:session.user.email,
  });
  const filter = {_id:id};
  const updateData = {title, description, uploads};
  if (isAdmin) {
    updateData.status = status;
  } else {
    filter.userEmail = session.user.email;
  }
  const newFeedbackDoc = await Feedback.updateOne(
    filter,
    updateData,
  );
  return Response.json(newFeedbackDoc);
}

export async function GET(req) {
  const url = new URL(req.url);
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  if (url.searchParams.get('id')) {
    return Response.json(
      await Feedback.findById(url.searchParams.get('id'))
    );
  } else {
    const sortOrFilter = url.searchParams.get('sortOrFilter');
    const loadedRows = url.searchParams.get('loadedRows');
    const searchPhrase = url.searchParams.get('search');
    const boardName = url.searchParams.get('boardName');
    const session = await getServerSession(authOptions);
    const board = await Board.findOne({slug:boardName});
    if (!canWeAccessThisBoard(session?.user?.email, board)) {
      return new Response('Unauthorized', {status:401});
    }
    let sortDef = {};
    const filter = {boardName};
    if (sortOrFilter === 'latest') {
      sortDef = {createdAt: -1};
    }
    if (sortOrFilter === 'oldest') {
      sortDef = {createdAt: 1};
    }
    if (sortOrFilter === 'votes') {
      sortDef = {votesCountCached: -1, createdAt: -1};
    }
    if (['planned', 'in_progress', 'complete', 'archived'].includes(sortOrFilter)) {
      filter.status = sortOrFilter;
    } else {
      filter.status = {$in:['new', null]};
    }
    if (searchPhrase) {
      const comments = await Comment.find({
        text:{$regex:'.*'+searchPhrase+'.*'}
      },'feedbackId',{limit:20});
      filter['$or'] = [
        {title:{$regex:'.*'+searchPhrase+'.*'}},
        {description:{$regex:'.*'+searchPhrase+'.*'}},
        {_id:comments.map(c => c.feedbackId)},
      ];
    }

    return Response.json(
      await Feedback.find(filter, null, {
        sort:sortDef,
        skip:loadedRows,
        limit: 10,
      }).populate('user')
    );
  }
}