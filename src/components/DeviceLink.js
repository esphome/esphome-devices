import React from "react";
import { Link } from "gatsby";

export function StandardTag({ standard }) {
  const allStandards = Array.from(
    standard
      ?.split(",")
      ?.map((s) => s.trim())
      ?.sort() ?? []
  );

  return (
    <>
      {allStandards.map((std) => (
        <Link key={std} to={`/standards/${std}`}>
          <span className="tag">{std}</span>
        </Link>
      ))}
    </>
  );
}

export function TypeTag({ type }) {
  return (
    <>
      {type ? (
        <Link to={`/type/${type}`}>
          <span className="tag">{type}</span>
        </Link>
      ) : (
        <span></span>
      )}
    </>
  );
}

export function DeviceLink({ slug, title, type, standard }) {
  return (
    <>
      <Link to={`/${slug}`}>{title}</Link>
      <TypeTag type={type} />
      <StandardTag standard={standard} />
    </>
  );
}
