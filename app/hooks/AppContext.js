'use client';
import {createContext, useContext, useEffect, useState} from "react";

export const AppContext = createContext({});

export function AppContextProvider({children}) {
  const [narrowHeader, setNarrowHeader] = useState(false);
  const [style, setStyle] = useState('oceanic');
  return (
    <AppContext.Provider value={{
      narrowHeader,setNarrowHeader,
      style,setStyle,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useNarrowHeader() {
  const {setNarrowHeader} = useContext(AppContext);
  useEffect(() => {
    setNarrowHeader(true);
  }, []);
}

export function useWideHeader() {
  const {setNarrowHeader} = useContext(AppContext);
  useEffect(() => {
    setNarrowHeader(false);
  }, []);
}

export function loginAndRedirect(router, signIn) {
  const isBoardPage = window.location.href.includes('/board/');
  if (isBoardPage) {
    signIn('google');
  } else {
    router.push('/account');
  }
}
export function logoutAndRedirect(router, signOut) {
  const isAccountPage = window.location.href.includes('/account');
  if (isAccountPage) {
    router.push('/?logout');
  } else {
    signOut();
  }
}

