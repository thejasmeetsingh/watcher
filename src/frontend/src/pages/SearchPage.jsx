import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { searchMovieAPI } from "../api/content";
import { useContentContext } from "../context/content";
import List from "../components/List";

export default function SearchPage() {
  let [searchParams, setSearchParams] = useSearchParams();
  const { searchValue, setSearchValue, setIsSearchOpen } = useContentContext();

  useEffect(() => {
    const searchParamVal = searchParams.get("q");
    if (searchParamVal && !searchValue) {
      setSearchValue(searchParamVal);
      setIsSearchOpen(true);
    }
  }, []);

  return (
    <div>
      <List param={searchValue} apiFunction={searchMovieAPI} />
    </div>
  );
}
