import AttachFilesButton from "@/app/components/AttachFilesButton";
import Attachment from "@/app/components/Attachment";
import Edit from "@/app/components/icons/Edit";
import Tick from "@/app/components/icons/Tick";
import Trash from "@/app/components/icons/Trash";
import Popup from "@/app/components/Popup";
import Button from "@/app/components/Button";
import FeedbackItemPopupComments from "@/app/components/FeedbackItemPopupComments";
import {BoardInfoContext, isBoardAdmin, useBoardSlug} from "@/app/hooks/UseBoardInfo";
import axios from "axios";
import {useSession} from "next-auth/react";
import {useContext, useEffect, useState} from "react";
import {MoonLoader} from "react-spinners";

export default function FeedbackItemPopup({_id, title, description, status, setShow, votes, onVotesChange, uploads, user, onUpdate}) {
  const [isVotesLoading, setIsVotesLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newUploads, setNewUploads] = useState(uploads);
  const [newStatus, setNewStatus] = useState(status || 'new');
  const [isAdmin, setIsAdmin] = useState(undefined);
  const {data:session} = useSession();
  const boardSlug = useBoardSlug();
  const {archived} = useContext(BoardInfoContext);

  useEffect(() => {
    if (boardSlug) {
      isBoardAdmin(boardSlug).then(resultIsAdmin => {
        setIsAdmin(resultIsAdmin);
      });
    }
  }, [boardSlug]);
  useEffect(() => {
    if (newStatus === status) {
      return;
    }
    const data = {id:_id,title,description,status:newStatus,uploads};
    axios.put('/api/feedback', data).then(() => {
      onUpdate({status:newStatus});
    });
  }, [newStatus]);
  function handleVoteButtonClick() {
    setIsVotesLoading(true);
    axios.post('/api/vote', {feedbackId: _id}).then(async () => {
      await onVotesChange();
      setIsVotesLoading(false);
    });
  }
  function handleEditButtonClick() {
    setIsEditMode(true);
  }
  function handleRemoveFileButtonClick(ev, linkToRemove) {
    ev.preventDefault();
    setNewUploads(
      prevNewUploads => prevNewUploads.filter(l => l !== linkToRemove)
    );
  }
  function handleCancelButtonClick() {
    setIsEditMode(false);
    setNewTitle(title);
    setNewDescription(description);
    setNewUploads(uploads);
  }
  function handleNewUploads(newLinks) {
    setNewUploads(prevUploads => [...prevUploads, ...newLinks]);
  }
  function handleSaveButtonClick() {
    axios.put('/api/feedback', {
      id:_id,
      title: newTitle,
      description: newDescription,
      uploads: newUploads,
    }).then(() => {
      setIsEditMode(false);
      onUpdate({
        title: newTitle,
        description: newDescription,
        uploads: newUploads,
      });
    });
  }
  const iVoted = votes.find(v => v.userEmail === session?.user?.email);
  return (
    <Popup title={''} setShow={setShow}>
      <div className="p-8 pb-2">
        {isEditMode && (
          <input
            className="block w-full mb-2 p-2 border rounded-md"
            value={newTitle}
            onChange={ev => setNewTitle(ev.target.value)}
          />
        )}
        {!isEditMode && (
          <h2 className="text-lg font-bold mb-2">{title}</h2>
        )}
        {isEditMode && (
          <textarea
            className="block w-full mb-2 p-2 border rounded-md"
            value={newDescription}
            onChange={ev => setNewDescription(ev.target.value)}
          />
        )}
        {!isEditMode && (
          <p
            className="text-gray-600"
            dangerouslySetInnerHTML={{__html:(description || '').replace(/\n/gi, "<br />")}}
          />
        )}
        {uploads?.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-gray-600">Attachments:</span>
            <div className="flex gap-2">
              {(isEditMode ? newUploads : uploads).map(link => (
                <Attachment
                  key={_id+link}
                  link={link}
                  handleRemoveFileButtonClick={handleRemoveFileButtonClick}
                  showRemoveButton={isEditMode} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 justify-end px-8 py-2 border-b">
        {isEditMode && (
          <>
            <AttachFilesButton onNewFiles={handleNewUploads} />
            <Button onClick={handleCancelButtonClick}>
              <Trash className="w-4 h-4" />Cancel
            </Button>
            <Button primary={1} onClick={handleSaveButtonClick}>
              Save changes
            </Button>
          </>
        )}
        {!isEditMode && !archived && user?.email && session?.user?.email === user?.email && (
          <Button onClick={handleEditButtonClick}>
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        )}
        {!isEditMode && isAdmin && (
          <select value={newStatus}
                  onChange={ev=>setNewStatus(ev.target.value)}
                  className="bg-gray-200 rounded-md">
            <option value="new">new</option>
            <option value="planned">planned</option>
            <option value="in_progress">in progress</option>
            <option value="complete">complete</option>
            <option value="archived">archived</option>
          </select>
        )}
        {!isEditMode && !archived && (
          <Button primary={1} onClick={handleVoteButtonClick}>
            {isVotesLoading && (
              <MoonLoader size={18} />
            )}
            {!isVotesLoading && (
              <>
                {iVoted && (
                  <>
                    <Tick className="w-4 h-4" />
                    Upvoted {votes?.length || '0'}
                  </>
                )}
                {!iVoted && (
                  <>
                    <span className="triangle-vote-up"></span>
                    Upvote {votes?.length || '0'}
                  </>
                )}
              </>
            )}
          </Button>
        )}
      </div>
      <div>
        <FeedbackItemPopupComments feedbackId={_id} />
      </div>
    </Popup>
  );
}