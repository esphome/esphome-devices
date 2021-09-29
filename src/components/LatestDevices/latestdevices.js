import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { DeviceLink } from "../DeviceLink";

const FilterDevices = () => {
  const data = useStaticQuery(graphql`
    {
      allMdx(
        sort: { fields: frontmatter___date_published, order: DESC }
        limit: 10
        filter: { frontmatter: { date_published: { gte: "2000-01-01" } } }
      ) {
        edges {
          node {
            id
            slug
            frontmatter {
              date_published
              title
              type
              standard
            }
          }
        }
        totalCount
      }
    }
  `);

  const mapped = data?.allMdx?.edges?.map(({ node }) => {
    return {
      id: node.id,
      slug: node.slug,
      ...node?.frontmatter,
    };
  });
  return (
    <>
      <p>
        There are currently <strong>{data?.allMdx?.totalCount} devices</strong>{" "}
        documented in the repository.
      </p>

      <h2>Recently Added Devices</h2>
      <ul>
        {mapped.map((device) => (
          <li key={device.id}>
            <DeviceLink {...device} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default FilterDevices;
