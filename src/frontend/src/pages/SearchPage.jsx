import { searchMovieAPI } from "../api/content";
import { useContentContext } from "../context/content";
import List from "../components/List";

export default function SearchPage() {
  const { searchValue } = useContentContext();

  return (
    <div>
      <List param={searchValue} apiFunction={searchMovieAPI} />
    </div>
  );
}
