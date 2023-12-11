import {model, models, Schema} from "mongoose";
import './User';

const feedbackSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String},
  status: {type: String, default: 'new'},
  uploads: {type: [String]},
  userEmail: {type: String, required: true},
  votesCountCached: {type: Number, default: 0},
  boardName: {type: String, required: true},
}, {
  timestamps: true,
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
});

feedbackSchema.virtual('user', {
  ref: 'User',
  localField: 'userEmail',
  foreignField: 'email',
  justOne: true,
});

export const Feedback = models?.Feedback || model('Feedback', feedbackSchema);