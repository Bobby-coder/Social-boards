import {Subscription} from "@/app/models/Subscription";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  let data;
  let eventType;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (webhookSecret) {
    let event;
    let signature = req.headers.get("stripe-signature");
    try {
      event = stripe.webhooks.constructEvent(
        await req.text(),
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return new Response(null, {status:400});
    }
    data = event.data;
    eventType = event.type;
  } else {
    data = req.body.data;
    eventType = req.body.type;
  }


  if (eventType === 'checkout.session.completed') {
    const {userEmail} = data.object.metadata;
    const {customer} = data.object;
    const sub = await Subscription.findOne({userEmail});
    if (sub) {
      sub.customer = customer;
      await sub.save();
    } else {
      await Subscription.create({customer: customer, userEmail})
    }
  }
  if (eventType === 'customer.subscription.updated') {
    const {customer} = data.object;
    const sub = await Subscription.findOne({customer});
    sub.stripeSubscriptionData = data;
    await sub.save();
  }

  console.log({eventType});
  return new Response(null, {status:200});
}