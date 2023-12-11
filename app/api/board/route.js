import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {canWeAccessThisBoard} from "@/app/libs/boardApiFunctions";
import {Board} from "@/app/models/Board";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";

async function getMyBoards() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return Response.json(
      await Board.find({adminEmail:session.user.email})
    );
  } else {
    return Response.json([]);
  }
}

export async function GET(request) {
  mongoose.connect(process.env.MONGO_URL);
  const url = new URL(request.url);
  if (url.searchParams.get('id')) {
    const board = await Board.findById(url.searchParams.get('id'));
    return Response.json(board);
  }
  if (url.searchParams.get('slug')) {
    const board = await Board.findOne({slug:url.searchParams.get('slug')});
    const session = await getServerSession(authOptions);
    if (!canWeAccessThisBoard(session?.user?.email, board)) {
      return new Response('Unauthorized', {status: 401});
    }
    return Response.json(board);
  } else {
    return await getMyBoards();
  }
}

export async function POST(request) {
  mongoose.connect(process.env.MONGO_URL);
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(false);
  }
  const jsonBody = await request.json();
  const {name, slug, description, visibility, allowedEmails, style} = jsonBody;
  const boardDoc = await Board.create({
    name,
    slug,
    description,
    visibility,
    style,
    adminEmail:session.user.email,
    allowedEmails,
  });
  return Response.json(boardDoc);
}

export async function PUT(request) {
  mongoose.connect(process.env.MONGO_URL);
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(false);
  }
  const jsonBody = await request.json();
  const {
    id, name, slug, description, visibility, allowedEmails, archived, style,
  } = jsonBody;
  const board = await Board.findById(id);
  if (session.user.email !== board.adminEmail) {
    return Response.json(false);
  }
  return Response.json(
    await Board.findByIdAndUpdate(id, {
      name, slug, description, visibility, allowedEmails, archived, style,
    })
  );
}