import AttachFilesButton from "@/app/components/AttachFilesButton";
import Attachment from "@/app/components/Attachment";
import Popup from "@/app/components/Popup";
import Button from "@/app/components/Button";
import {useBoardSlug} from "@/app/hooks/UseBoardInfo";
import {signIn, useSession} from "next-auth/react";
import {useState} from "react";
import axios from "axios";

export default function FeedbackFormPopup({setShow, onCreate}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploads, setUploads] = useState([]);
  const {data: session} = useSession();
  const boardName = useBoardSlug();
  async function handleCreatePostButtonClick(ev) {
    ev.preventDefault();
    if (session) {
      axios.post('/api/feedback', {title, description, uploads, boardName})
        .then(() => {
          setShow(false);
          onCreate();
        });
    } else {
      localStorage.setItem('post_after_login', JSON.stringify({
        title, description, uploads, boardName
      }));
      await signIn('google');
    }
  }
  function handleRemoveFileButtonClick(ev, link) {
    ev.preventDefault();
    setUploads(currentUploads => {
      return currentUploads.filter(val => val !== link);
    });
  }
  function addNewUploads(newLinks) {
    setUploads(prevLinks => [...prevLinks, ...newLinks]);
  }
  return (
    <Popup setShow={setShow} title={'Make a suggest ion'}>
      <form className="p-8">
        <label className="block mt-4 mb-1 text-slate-700">Title</label>
        <input
          className="w-full border p-2 rounded-md"
          type="text"
          placeholder="A short, descriptive title"
          value={title}
          onChange={ev => setTitle(ev.target.value)}
          />
        <label className="block mt-4 mb-1 text-slate-700">Details</label>
        <textarea
          className="w-full border p-2 rounded-md h-24"
          placeholder="Please include any details"
          onChange={ev => setDescription(ev.target.value)}
          value={description}
        />
        {uploads?.length > 0 && (
          <div>
            <label className="block mt-2 mb-1 text-slate-700">Files</label>
            <div className="flex gap-3">
              {uploads.map(link => (
                <Attachment
                  key={'form'+link}
                  link={link}
                  showRemoveButton={true}
                  handleRemoveFileButtonClick={(ev, link) => handleRemoveFileButtonClick(ev, link)} />
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2 mt-2 justify-end">
          <AttachFilesButton onNewFiles={addNewUploads} />
          <Button primary={1} onClick={handleCreatePostButtonClick}>
            {session ? 'Create post' : 'Login and post'}
          </Button>
        </div>
      </form>
    </Popup>
  );
}