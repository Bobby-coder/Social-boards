import BoardHeaderGradient from "@/app/components/BoardHeaderGradient";
import Button from "@/app/components/Button";
import FeedbackFormPopup from "@/app/components/FeedbackFormPopup";
import Search from "@/app/components/icons/Search";
import {FeedbacksFetchContext} from "@/app/hooks/FeedbacksFetchContext";
import {BoardInfoContext, useBoardSlug} from "@/app/hooks/UseBoardInfo";
import {useContext, useState} from "react";

export default function BoardHeader({onNewFeedback}) {
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const {
    sortOrFilter, setSortOrFilter, searchPhrase, setSearchPhrase
  } = useContext(FeedbacksFetchContext);
  const slug = useBoardSlug();
  const {
    name:boardName,
    description,
    archived,
    style,
  } = useContext(BoardInfoContext);
  function openFeedbackPopupForm() {
    setShowFeedbackPopupForm(true);
  }
  return (
    <>
      {showFeedbackPopupForm && (
        <FeedbackFormPopup
          onCreate={onNewFeedback}
          setShow={setShowFeedbackPopupForm} />
      )}
      <BoardHeaderGradient
        name={boardName}
        description={description}
        style={style}
      />
      <div className="bg-gray-100 px-8 py-4 flex items-center border-b">
        <div className="grow flex items-center gap-4 text-gray-400">
          <select
            value={sortOrFilter}
            onChange={ev => {setSortOrFilter(ev.target.value);}}
            className="bg-transparent py-2">
            <option value="votes">Most voted</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In progress</option>
            <option value="complete">Complete</option>
            <option value="archived">Archived</option>
          </select>
          <div className="relative">
            <Search className="w-4 h-4 absolute top-3 left-2 pointer-events-none" />
            <input type="text"
                   placeholder="Search"
                   value={searchPhrase}
                   onChange={ev => setSearchPhrase(ev.target.value)}
                   className="bg-transparent p-2 pl-7"/>
          </div>
        </div>
        <div>
          {!archived && (
            <Button primary={1} onClick={openFeedbackPopupForm}>
              Make a suggestion
            </Button>
          )}
        </div>
      </div>
    </>
  );
}