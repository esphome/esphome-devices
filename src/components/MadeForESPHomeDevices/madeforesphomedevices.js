import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import { DeviceLink } from "../DeviceLink";

const MadeForESPHomeDevices = () => {
  const data = useStaticQuery(graphql`
    {
      allMdx(
        sort: { fields: frontmatter___title }
        filter: { frontmatter: { made_for_esphome: { eq: true } } }
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              type
              standard
              board
              made_for_esphome
            }
            slug
          }
        }
      }
    }
  `);
  const mapped = data?.allMdx?.edges?.map(({ node }) => {
    return {
      id: node.id,
      slug: node.slug,
      title: node?.frontmatter?.title,
      type: node?.frontmatter?.type,
      board: node?.frontmatter?.board?.toLowerCase(),
      standard: node?.frontmatter?.standard?.toLowerCase(),
    };
  });

  return (
    <div>
      <ul>
        {mapped.map((device) => (
          <li key={device.id}>
            <DeviceLink {...device} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MadeForESPHomeDevices;
