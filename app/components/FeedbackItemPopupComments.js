import AttachFilesButton from "@/app/components/AttachFilesButton";
import Attachment from "@/app/components/Attachment";
import Button from "@/app/components/Button";
import CommentForm from "@/app/components/CommentForm";
import {BoardInfoContext} from "@/app/hooks/UseBoardInfo";
import axios from "axios";
import {useSession} from "next-auth/react";
import {useContext, useEffect, useState} from "react";
import Avatar from "@/app/components/Avatar";
import TimeAgo from "timeago-react";

export default function FeedbackItemPopupComments({feedbackId}) {
  const [comments, setComments] = useState([]);
  const {data:session} = useSession();
  const [editingComment, setEditingComment] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentUploads, setNewCommentUploads] = useState([]);
  const {archived} = useContext(BoardInfoContext);
  useEffect(() => {
    fetchComments();
  }, []);
  function fetchComments() {
    axios.get('/api/comment?feedbackId='+feedbackId).then(res => {
      setComments(res.data);
    });
  }
  function handleEditButtonClick(comment) {
    setEditingComment(comment);
    setNewCommentText(comment.text);
    setNewCommentUploads(comment.uploads);
  }
  function handleCancelButtonClick() {
    setNewCommentText('');
    setNewCommentUploads([]);
    setEditingComment(null);
  }
  function handleRemoveFileButtonClick(ev, linkToRemove) {
    ev.preventDefault();
    setNewCommentUploads(prev => prev.filter(l => l!==linkToRemove));
  }
  function handleNewLinks(newLinks) {
    setNewCommentUploads(currentLinks => [...currentLinks, ...newLinks]);
  }
  async function handleSaveChangesButtonClick() {
    const newData = {text: newCommentText, uploads: newCommentUploads};
    await axios.put('/api/comment', {id:editingComment._id, ...newData});
    setComments(existingComments => {
      return existingComments.map(comment => {
        if (comment._id === editingComment._id) {
          return {...comment, ...newData};
        } else {
          return comment;
        }
      });
    });
    setEditingComment(null);
  }

  const showCommentForm = !editingComment && !archived;

  return (
    <div className="p-8">
      {comments?.length > 0 && comments.map(comment => {
        const editingThis = editingComment?._id === comment._id;
        const isAuthor = !!comment.user.email && comment.user.email === session?.user?.email;
        return (
          <div className="mb-8" key={comment._id}>
            <div className="flex gap-4">
              <Avatar url={comment.user.image} />
              <div>
                {editingThis && (
                  <textarea
                    value={newCommentText}
                    onChange={ev => setNewCommentText(ev.target.value)}
                    className="border p-2 block w-full"/>
                )}
                {!editingThis && (
                  <p className="text-gray-600">{comment.text}</p>
                )}
                <div className="text-gray-400 mt-2 text-sm">
                  {comment.user.name}
                  &nbsp;&middot;&nbsp;
                  <TimeAgo
                    datetime={comment.createdAt}
                    locale='en_US'
                  />
                  {!editingThis && isAuthor && !archived && (
                    <>
                      &nbsp;&middot;&nbsp;
                      <span
                        onClick={() => handleEditButtonClick(comment)}
                        className="cursor-pointer hover:underline">
                        Edit
                      </span>
                    </>
                  )}
                  {editingThis && (
                    <>
                      &nbsp;&middot;&nbsp;
                      <span
                        onClick={handleCancelButtonClick}
                        className="cursor-pointer hover:underline">
                        Cancel
                      </span>
                      &nbsp;&middot;&nbsp;
                      <span
                        onClick={handleSaveChangesButtonClick}
                        className="cursor-pointer hover:underline">
                        Save changes
                      </span>
                    </>
                  )}
                </div>
                {(editingThis ? newCommentUploads : comment.uploads)?.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {(editingThis ? newCommentUploads : comment.uploads).map(link => (
                      <Attachment
                        key={'edit'+comment._id+link}
                        handleRemoveFileButtonClick={handleRemoveFileButtonClick}
                        showRemoveButton={editingComment?._id === comment._id}
                        link={link} />
                    ))}
                  </div>
                )}
                {editingThis && (
                  <div className="mt-2">
                    <AttachFilesButton onNewFiles={handleNewLinks} />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {comments?.length === 0 && !showCommentForm && (
        <div className="text-center text-black text-opacity-50 py-4">No comments on this post</div>
      )}
      {showCommentForm && (
        <CommentForm feedbackId={feedbackId} onPost={fetchComments} />
      )}
    </div>
  );
}