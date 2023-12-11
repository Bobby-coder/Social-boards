import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import {Notification} from "@/app/models/Notification";

export async function GET() {
  mongoose.connect(process.env.MONGO_URL);
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Unauthorized', {status: 401});
  }
  return Response.json(
    await Notification
      .find(
        {destinationUserEmail:session.user.email},
        null,
        {sort:{createdAt:-1}}
      )
      .populate('feedbackId')
  );
}

export async function PUT(request) {
  mongoose.connect(process.env.MONGO_URL);
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Unauthorized', {status: 401});
  }
  const {id} = await request.json();
  await Notification.findByIdAndUpdate(id, {read:true});
  return Response.json(true);
}