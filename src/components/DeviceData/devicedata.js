import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { TypeTag, StandardTag } from "../DeviceLink";
const DeviceData = ({ deviceId }) => {
  const data = useStaticQuery(graphql`
    {
      allMdx(sort: { fields: id }, filter: { id: {} }) {
        edges {
          node {
            id
            frontmatter {
              title
              type
              standard
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
    return {
      id: node.id,
      slug: node.slug,
      title: node?.frontmatter?.title,
      type: node?.frontmatter?.type,
      standard: node?.frontmatter?.standard?.toLowerCase(),
    };
  });

  const { type, standard } = mapped.length === 1 ? mapped[0] : {};

  if (type || standard) {
    return (
      <h4>
        <div>
          Device Type: <TypeTag type={type} />
        </div>
        <div>
          Electrical Standard: <StandardTag standard={standard} />
        </div>
      </h4>
    );
  }
  return null;
};

export default DeviceData;
