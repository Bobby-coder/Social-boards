export function canWeAccessThisBoard(userEmail, boardDoc) {
  if (boardDoc.visibility === 'public') {
    return true;
  }
  return boardDoc.allowedEmails.includes(userEmail);
}