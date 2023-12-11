import BoardBody from "@/app/components/BoardBody";
import BoardHeader from "@/app/components/BoardHeader";
import {FeedbacksFetchContext} from "@/app/hooks/FeedbacksFetchContext";
import {useBoardSlug} from "@/app/hooks/UseBoardInfo";
import {
  feedbackOpenNeeded,
  fetchFeedback,
  fetchSpecificFeedbacks,
  notifyIfBottomOfThePage,
  postLoginActions
} from "@/app/libs/boardFunctions";
import {debounce} from "lodash";
import {usePathname} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import FeedbackItemPopup from "@/app/components/FeedbackItemPopup";
import axios from "axios";
import {useSession} from "next-auth/react";

export default function Board() {
  const [showFeedbackPopupItem, setShowFeedbackPopupItem] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbacksFetchCount, setFeedbacksFetchCount] = useState(0);
  const fetchingFeedbacksRef = useRef(false);
  const [fetchingFeedbacks, setFetchingFeedbacks] = useState(false);
  const waitingRef = useRef(false);
  const [waiting, setWaiting] = useState(true);
  const [votesLoading, setVotesLoading] = useState(false);
  const [sortOrFilter, setSortOrFilter] = useState('votes');
  const sortOrFilterRef = useRef('votes');
  const loadedRows = useRef(0);
  const everythingLoadedRef = useRef(false);
  const [votes, setVotes] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState('');
  const searchPhraseRef = useRef('');
  const pathname = usePathname();
  const slug = useBoardSlug();
  const debouncedFetchFeedbacksRef = useRef(
    debounce(fetchFeedbacks, 300)
  );
  const {data:session} = useSession();

  useEffect(() => {
    fetchFeedbacks();
    const handleScroll = () => notifyIfBottomOfThePage(() => fetchFeedbacks(true));
    window.addEventListener('scroll', handleScroll);
    return () => {window.removeEventListener('scroll', handleScroll);}
  }, []);

  useEffect(() => {
    fetchVotes();
  }, [feedbacks]);

  useEffect(() => {
    if (feedbacksFetchCount === 0) {
      return;
    }
    loadedRows.current=0;
    sortOrFilterRef.current = sortOrFilter;
    searchPhraseRef.current = searchPhrase;
    everythingLoadedRef.current = false;
    if (feedbacks?.length > 0) {
      setFeedbacks([]);
    }
    setWaiting(true);
    waitingRef.current = true;
    debouncedFetchFeedbacksRef.current();
  }, [sortOrFilter, searchPhrase]);

  useEffect(() => {
    if (feedbacksFetchCount === 0) {
      return;
    }
    const url = showFeedbackPopupItem
      ? `/board/${slug}/feedback/${showFeedbackPopupItem._id}`
      : '/board/'+slug;
    window.history.pushState({}, '', url);
  }, [showFeedbackPopupItem]);

  useEffect(() => {
    const idToOpen = feedbackOpenNeeded(feedbacksFetchCount, pathname);
    if (idToOpen) {
      fetchFeedback(idToOpen).then(setShowFeedbackPopupItem)
    }
  }, [feedbacksFetchCount]);

  useEffect(() => {
    if (!session?.user?.email) {
      return;
    }
    postLoginActions(fetchVotes, fetchFeedbacks, openFeedbackPopupItem);
  }, [session]);

  async function fetchFeedbacks(append=false) {
    if (fetchingFeedbacksRef.current || everythingLoadedRef.current) {
      return;
    }
    fetchingFeedbacksRef.current = true;
    setFetchingFeedbacks(true);
    fetchSpecificFeedbacks({
      boardName: slug,
      sortOrFilter: sortOrFilterRef.current,
      loadedRows: loadedRows.current,
      search: searchPhraseRef.current,
    }).then(feedbacks => {
      setFeedbacksFetchCount(prevCount => prevCount + 1);
      setFeedbacks(
        currentFeedbacks => append
          ? [...currentFeedbacks, ...feedbacks]
          : feedbacks
      );
      if (feedbacks?.length > 0) {
        loadedRows.current += feedbacks.length;
      }
      if (feedbacks?.length === 0) {
        everythingLoadedRef.current = true;
      }
      fetchingFeedbacksRef.current = false;
      setFetchingFeedbacks(false);
      waitingRef.current = false;
      setWaiting(false);
    });
  }
  async function fetchVotes() {
    setVotesLoading(true);
    const ids = feedbacks.map(f => f._id)
    const res = await axios.get('/api/vote?feedbackIds='+ids.join(','));
    setVotes(res.data);
    setVotesLoading(false);
  }
  function openFeedbackPopupItem(feedback) {
    setShowFeedbackPopupItem(feedback);
  }
  async function handleFeedbackUpdate(newData) {
    setShowFeedbackPopupItem(prevData => {
      return {...prevData, ...newData};
    });
    loadedRows.current = 0;
    await fetchFeedbacks();
  }

  async function reFetchFeedbacks() {
    loadedRows.current=0;
    sortOrFilterRef.current = sortOrFilter;
    searchPhraseRef.current = searchPhrase;
    everythingLoadedRef.current = false;
    await fetchFeedbacks();
  }

  return (
    <main className="bg-white md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-4 md:mb-8 overflow-hidden">
      <FeedbacksFetchContext.Provider value={{sortOrFilter,
        setSortOrFilter,
        searchPhrase,
        setSearchPhrase,}}>
        <BoardHeader onNewFeedback={reFetchFeedbacks} />
      </FeedbacksFetchContext.Provider>
      <div className="px-8">
        <BoardBody onVotesChange={fetchVotes} fetchingFeedbacks={fetchingFeedbacks} votesLoading={votesLoading} votes={votes} feedbacks={feedbacks} waiting={waiting} onFeedbackClick={openFeedbackPopupItem} />
      </div>

      {showFeedbackPopupItem && (
        <FeedbackItemPopup
          {...showFeedbackPopupItem}
          votes={votes.filter(v => v.feedbackId.toString() === showFeedbackPopupItem._id)}
          onVotesChange={fetchVotes}
          onUpdate={handleFeedbackUpdate}
          setShow={setShowFeedbackPopupItem} />
      )}
    </main>
  );
}