import {model, models, Schema} from "mongoose";

const subscriptionSchema = new Schema({
  userEmail: {type: String, required: true},
  customer: {type: String, required: true},
  stripeSubscriptionData: {type: Object},
}, {timestamps:true});

export const Subscription = models?.Subscription || model('Subscription', subscriptionSchema);