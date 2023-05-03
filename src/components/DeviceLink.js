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

export function BoardTag({ board }) {
  return (
    <>
      {board ? (
        <Link to={`/board/${board}`}>
          <span className="tag">{board}</span>
        </Link>
      ) : (
        <span></span>
      )}
    </>
  );
}

export function MadeforesphomeLogo({ made_for_esphome }) {
  return (
    <>
      {made_for_esphome === "visible" ? (
        // <Link to={`/type/${made_for_esphome}`}>
          <img src="/made-for-esphome-black-on-white.svg" width="120px" alt="Made for ESPHome Logo" />
        // </Link>
      ) : (
        <span></span>
      )}
    </>
  );
}

export function DifficultyLookup({ difficulty }) {
  const levels = {
    1: "Comes with ESPhome",
    2: "Plug-n-flash",
    3: "Disassembly required",
    4: "Soldering required",
    5: "Chip needs replacement",
  }
  return (
    <>
      <span>{levels[difficulty]}</span>
    </>
  );
}

export function DeviceLink({ slug, title, type, standard, board }) {
  return (
    <>
      <Link to={`/${slug}`}>{title}</Link>
      <TypeTag type={type} />
      <StandardTag standard={standard} />
      <BoardTag board={board} />
    </>
  );
}
