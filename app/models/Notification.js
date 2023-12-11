import mongoose, {model, models, Schema} from "mongoose";
import {Feedback} from './Feedback';

const notificationSchema = new Schema({
  destinationUserEmail: {type: String, required: true},
  sourceUserName: {type: String, required: true},
  type: {type: String, required: true, enum: ['vote', 'comment']},
  feedbackId: {type: mongoose.Types.ObjectId, required: true, ref: 'Feedback'},
  read: {type: Boolean, default: false},
}, {timestamps:true});

export const Notification = models?.Notification || model('Notification', notificationSchema);