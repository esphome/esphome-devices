import { Link } from "gatsby";
import { default as React } from "react";
import {
  connectStateResults,
  Highlight,
  Hits,
  Index,
  PoweredBy,
} from "react-instantsearch-dom";

const HitCount = connectStateResults(({ searchResults }) => {
  const hitCount = searchResults && searchResults.nbHits;

  return hitCount > 0 ? (
    <div className="HitCount">
      {hitCount} result{hitCount !== 1 ? `s` : ``}
    </div>
  ) : null;
});

const PageHit = ({ hit }) => (
  <div>
    <Link to={hit.slug}>
      <h4>
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </h4>
    </Link>
  </div>
);

const HitsInIndex = ({ index }) => (
  <Index indexName={index.name}>
    <HitCount />
    <Hits className="Hits" hitComponent={PageHit} />
  </Index>
);

const SearchResult = ({ indices, className, show }) => (
  <div
    className={className}
    style={{
      display: show === true ? "block" : "none",
      maxHeight: "80vh",
      overflowX: "hidden",
      overflowY: "scroll",
      position: "absolute",
      zIndex: "2",
      left: "5px",
      // top: "100%",
      marginTop: "0.5em",
      marginLeft: "1em",
      // width: "80vw",
      // maxWidth: "30em",
      boxShadow: "0 0 5px 0",
      padding: "1em",
      borderRadius: "2px",
      backgroundColor: "white",
      width: "90%",
    }}
  >
    {indices.map((index) => (
      <HitsInIndex index={index} key={index.name} />
    ))}
    <PoweredBy />
  </div>
);

export default SearchResult;
