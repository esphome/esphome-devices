import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";

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
            slug
            frontmatter {
              date_published
              title
              type
              slug
            }
          }
        }
        totalCount
      }
    }
  `);

  const mapped = data?.allMdx?.edges?.map(({ node }) => {
    return {
      slug: node.slug,
      title: node?.frontmatter?.title,
      type: node?.frontmatter?.type,
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
          <li key={device.slug}>
            <Link to={`/${device.slug}`}>{device.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default FilterDevices;
