import algoliasearch from "algoliasearch/lite";
import { createRef, default as React, useState } from "react";
import { InstantSearch } from "react-instantsearch-dom";
import SearchBox from "./search-box";
import SearchResult from "./search-result";
import useClickOutside from "./use-click-outside";

export default function SearchButton({ indices }) {
  const [showSearch, setShowSearch] = useState(false);

  return showSearch ? (
    <Search indices={indices} />
  ) : (
    <div
      style={{
        paddingLeft: "30px",
        width: "100%",
        textTransform: "uppercase",
        fontSize: "14px",
        fontWeight: "bold",
        marginTop: "20px",
        color: "#000000",
        letterSpacing: "0.142em",
      }}
      onClick={() => {
        setShowSearch(true);
      }}
    >
      <a>Search</a>
    </div>
  );
}

const searchClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID,
  process.env.GATSBY_ALGOLIA_SEARCH
);

function Search({ indices }) {
  const rootRef = createRef();
  const [hasFocus, setFocus] = useState(true);

  useClickOutside(rootRef, () => setFocus(false));

  return (
    <div ref={rootRef}>
      <InstantSearch
        searchClient={searchClient}
        indexName={indices[0].name}
      >
        <SearchBox onFocus={() => setFocus(true)} hasFocus={hasFocus} />
        <SearchResult show={hasFocus} indices={indices} />
      </InstantSearch>
    </div>
  );
}
