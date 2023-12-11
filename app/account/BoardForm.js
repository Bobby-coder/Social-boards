import BoardHeader from "@/app/components/BoardHeader";
import BoardHeaderGradient from "@/app/components/BoardHeaderGradient";
import Button from "@/app/components/Button";
import Edit from "@/app/components/icons/Edit";
import Tick from "@/app/components/icons/Tick";
import Popup from "@/app/components/Popup";
import {BoardInfoContext} from "@/app/hooks/UseBoardInfo";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function BoardForm({
  _id,
  name:defaultName,
  slug:defaultSlug,
  description:defaultDescription,
  visibility:defaultVisibility='public',
  allowedEmails:defaultAllowedEmails=[],
  archived:defaultArchived=false,
  style:defaultStyle='hyper',
  buttonText='',
  onSubmit,
}) {
  const [showGradientsPopup, setShowGradientsPopup] = useState(false);
  const [name,setName] = useState(defaultName || '');
  const [slug,setSlug] = useState(defaultSlug || '');
  const [description,setDescription] = useState(defaultDescription || '');
  const [visibility,setVisibility] = useState(defaultVisibility || 'public');
  const [archived,setArchived] = useState(defaultArchived || false);
  const [style, setStyle] = useState(defaultStyle || 'hyper');
  const [allowedEmails,setAllowedEmails] = useState(
    defaultAllowedEmails?.join("\n") || ''
  );
  const router = useRouter();
  function getBoardData() {
    return {
      name,
      slug,
      description,
      visibility,
      style,
      allowedEmails:allowedEmails.split("\n"),
    };
  }
  async function handleFormSubmit(ev) {
    ev.preventDefault();
    onSubmit(getBoardData());
  }
  function handleArchiveButtonClick(ev) {
    ev.preventDefault();
    axios.put('/api/board', {
      id:_id,
      archived:!archived,
      ...getBoardData(),
    }).then(() => {
      setArchived(prev => !prev);
    });
  }
  function handleChangeGradientButtonClick(ev) {
    ev.preventDefault();
    setShowGradientsPopup(true);
  }
  return (
    <form className="max-w-md mx-auto"
          onSubmit={handleFormSubmit}>
      {archived && (
        <div className="border border-orange-400 bg-orange-200 rounded-md p-4 my-4">
          This board is archived
        </div>
      )}
      <label>
        <div>Board name:</div>
        <input type="text"
               placeholder="Board name"
               value={name}
               onChange={ev => setName(ev.target.value)}
               className="block w-full mb-4 p-2 rounded-md"/>
      </label>
      <div className="flex items-center mb-4">
        <label className="w-full">
          <div>URL slug:</div>
          <div className="bg-white rounded-md flex">
            <span
              className="py-2 pl-2">
              feedbackboard.com/board/
            </span>
            <input type="text"
                   value={slug}
                   onChange={ev => setSlug(ev.target.value)}
                   placeholder="board-name"
                   className="py-2 bg-transparent flex grow" />
          </div>
        </label>
      </div>
      <label>
        <div>Description:</div>
        <input type="text"
               placeholder="Board description"
               value={description}
               onChange={ev => setDescription(ev.target.value)}
               className="block w-full mb-4 p-2 rounded-md"/>
      </label>
      <div>Visibility:</div>
      <label className="block">
        <input type="radio" name="visibility" value="public"
               checked={visibility === 'public'}
               onChange={() => setVisibility('public')} />
        Public
      </label>
      <label className="block">
        <input type="radio" name="visibility" value="invite-only"
               checked={visibility === 'invite-only'}
               onChange={() => setVisibility('invite-only')} />
        Invite-only
      </label>
      {visibility === 'invite-only' && (
        <div className="my-4">
          <label>
            <div>Who should be able to access the board?</div>
            <div className="text-sm text-gray-600">
              List all email addresses seperated by new line
            </div>
            <textarea
              className="block w-full bg-white rounded-md h-24 p-2 mt-2"
              value={allowedEmails}
              onChange={ev => setAllowedEmails(ev.target.value)}
              placeholder={"user1@example.com\nuser2@example.com\nuser3@example.com"}
            />
          </label>
        </div>
      )}

      <div className="my-4">
        <div className="grow p-2 bg-gray-200 rounded-md">
          <div className="flex gap-2 mb-2 items-center">
            <div className="uppercase text-sm text-gray-600">
              style preview:
            </div>
            <div className="grow flex justify-end">
              <BoardInfoContext.Provider value={{style}}>
                <Button primary
                        className="text-sm"
                        onClick={handleChangeGradientButtonClick}>
                  <Edit className="w-4 h-4" />Change header gradient
                </Button>
              </BoardInfoContext.Provider>
            </div>
          </div>
          <div className="rounded-t-lg overflow-hidden w-full">
            <BoardHeaderGradient style={style} name={name} description={description} />
          </div>
        </div>
      </div>

      <Button primary
              disabled={name === '' || slug === ''}
              className="w-full bg-primary px-6 py-2 justify-center my-4">
        {buttonText}
      </Button>
      {!!_id && (
        <Button
          onClick={handleArchiveButtonClick}
          className="w-full justify-center py-2 my-4 border border-gray-400">
          {archived ? 'Unarchive' : 'Archive'} this board
        </Button>
      )}
      {showGradientsPopup && (
        <Popup
          setShow={setShowGradientsPopup}
          title={'Choose your gradient styling'}>
          <div className="p-4 grid grid-cols-2 gap-4">
            {['hyper', 'oceanic', 'cotton-candy', 'gotham', 'sunset', 'mojave'].map(styleOptionName => (
              <label onClick={() => {
                setStyle(styleOptionName);
                setShowGradientsPopup(false);
              }} key={style} className="flex gap-1 cursor-pointer relative">
                <input className="hidden" type="radio" name="gradient" value={style} />
                <BoardHeaderGradient
                  style={styleOptionName}
                  name={name} description={description} />
                {style === styleOptionName && (
                  <div className="absolute bg-white bg-opacity-60 inset-0 flex">
                    <div className="flex items-center justify-center w-full">
                      <div className="border border-8 border-green-600 text-green-600 rounded-full">
                        <Tick className="w-24 h-24" />
                      </div>
                    </div>
                  </div>
                )}
              </label>
            ))}
          </div>
        </Popup>
      )}
    </form>
  );
}