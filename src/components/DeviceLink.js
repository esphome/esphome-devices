import React from "react";
import { Link } from "gatsby";
import styled from '@emotion/styled';

export const NormalSpan = styled.span`
  font-weight: normal;
`;
export const NormalA = styled.a`
  font-weight: normal;
`;
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
          <a href="https://esphome.io/guides/made_for_esphome.html" target="_blank" rel="noreferrer"><img src="/made-for-esphome-black-on-white.svg" width="120px" alt="Made for ESPHome Logo" /></a>
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
      <NormalSpan>{levels[difficulty]}, {difficulty}/5</NormalSpan>
  );
}

export function ProjectUrl({ project_url }) {
  return (
      <NormalA href={project_url} >{project_url}</NormalA>
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
