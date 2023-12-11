import AttachFilesButton from "@/app/components/AttachFilesButton";
import Attachment from "@/app/components/Attachment";
import Button from "@/app/components/Button";
import axios from "axios";
import {signIn, useSession} from "next-auth/react";
import {useState} from "react";

export default function CommentForm({feedbackId,onPost}) {
  const [commentText, setCommentText] = useState('');
  const [uploads, setUploads] = useState([]);
  const {data: session} = useSession();
  function addUploads(newLinks) {
    setUploads(prevLinks => [...prevLinks, ...newLinks]);
  }
  function removeUpload(ev,linkToRemove) {
    ev.preventDefault();
    ev.stopPropagation();
    setUploads(prevLinks => prevLinks.filter(link => link !== linkToRemove));
  }
  async function handleCommentButtonClick(ev) {
    ev.preventDefault();
    const commentData = {
      text: commentText,
      uploads,
      feedbackId,
    };
    if (session) {
      await axios.post('/api/comment', commentData);
      setCommentText('');
      setUploads([]);
      onPost();
    } else {
      localStorage.setItem('comment_after_login', JSON.stringify(commentData));
      await signIn('google');
    }
  }
  return (
    <form>
        <textarea
          className="border rounded-md w-full p-2" placeholder="Let us know what you think..."
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />
      {uploads?.length > 0 && (
        <div className="">
          <div className="text-sm text-gray-600 mb-2 mt-3">Files:</div>
          <div className="flex gap-3">
            {uploads.map(link => (
              <div key={'comment-form-'+link}>
                <Attachment
                 link={link}
                 showRemoveButton={true}
                 handleRemoveFileButtonClick={(ev,link) => removeUpload(ev,link)} />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2 mt-2">
        <AttachFilesButton onNewFiles={addUploads} />
        <Button
          onClick={handleCommentButtonClick}
          primary={1}
          disabled={commentText === ''}>
          {session ? 'Comment' : 'Login and comment'}
        </Button>
      </div>
    </form>
  );
}