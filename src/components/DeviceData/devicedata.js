import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { TypeTag, StandardTag, MadeforesphomeLogo, DifficultyLookup, BoardTag, ProjectUrl} from "../DeviceLink";
const DeviceData = ({ deviceId }) => {
  const data = useStaticQuery(graphql`
    {
      allMdx(sort: { fields: frontmatter___title }) {
        edges {
          node {
            id
            frontmatter {
              title
              type
              standard
              board
              project_url
              made_for_esphome
              difficulty
            }
            slug
          }
        }
      }
    }
  `);
  const filtered = data?.allMdx?.edges?.filter((e) => {
    return e.node.id === deviceId;
  });
  const mapped = filtered?.map(({ node }) => {
    let show_logo = "hidden"
    if (node?.frontmatter?.made_for_esphome) {show_logo = "visible"}

    return {
      id: node.id,
      slug: node.slug,
      title: node?.frontmatter?.title,
      type: node?.frontmatter?.type,
      standard: node?.frontmatter?.standard?.toLowerCase(),
      board: node?.frontmatter?.board?.toLowerCase(),
      project_url: node?.frontmatter?.project_url?.toLowerCase(),
      made_for_esphome_logo: show_logo,
      difficulty: node?.frontmatter?.difficulty,
    };
  });

  const { type, standard, board, project_url, made_for_esphome_logo, difficulty } = mapped.length === 1 ? mapped[0] : {};

  if (type || standard) {
    return (
      <h4>
        <div>
          <MadeforesphomeLogo made_for_esphome={made_for_esphome_logo} />
        </div>
        <br />
        <div>
          Device Type: <TypeTag type={type} />
        </div>
        <div>
          Electrical Standard: <StandardTag standard={standard} />
        </div>
        {board ? (<div>
          Board: <BoardTag board={board} />
        </div>) : (null)}
        {difficulty ? (<div>
          Difficulty: <DifficultyLookup difficulty={difficulty} />
        </div>) : (null)}
        {project_url ? (<div>
          Project URL: <ProjectUrl project_url={project_url} />
        </div>) : (null)}
      </h4>
    );
  }
  return null;
};

export default DeviceData;
