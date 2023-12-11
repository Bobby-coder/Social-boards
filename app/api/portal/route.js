import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {Subscription} from "@/app/models/Subscription";
import {getServerSession} from "next-auth";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST() {
  const returnUrl = process.env.NEXTAUTH_URL + '/subscription';
  const userSession = await getServerSession(authOptions);
  if (!userSession) {
    return new Response('Unauthenticated', {status: 401});
  }
  const sub = await Subscription.findOne({userEmail:userSession.user.email});
  const customerId = sub.customer;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return Response.json(portalSession.url);
}