import React from "react";
import { connectSearchBox } from "react-instantsearch-dom";

export default connectSearchBox(
  ({ refine, currentRefinement, className, onFocus }) => (
    <form
      className={className}
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
    >
      <input
        autoFocus
        className="SearchInput"
        type="text"
        placeholder="Search"
        aria-label="Search"
        onChange={(e) => refine(e.target.value)}
        value={currentRefinement}
        onFocus={onFocus}
        style={{
          width: "90%",
          borderRadius: "4px",
          padding: "4px 2px 4px 2px",
        }}
      />
    </form>
  )
);
