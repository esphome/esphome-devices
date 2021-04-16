import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";

const FilterDevices = ({ filterDeviceType, filterStandard }) => {
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
            }
            slug
          }
        }
      }
    }
  `);
  const filtered = data?.allMdx?.edges?.filter((e) => {
    if (filterDeviceType) {
      return (
        e.node.frontmatter.type?.toLowerCase() ===
        filterDeviceType?.toLowerCase()
      );
    }

    return e?.node?.frontmatter?.standard
      ?.toLowerCase()
      ?.includes(filterStandard.toLowerCase());
  });

  const mapped = filtered?.map(({ node }) => {
    return {
      slug: node.slug,
      title: node?.frontmatter?.title,
      type: node?.frontmatter?.type,
      standard: node?.frontmatter?.standard,
    };
  });
  return (
    <ul>
      {mapped.map((device) => (
        <li key={device.slug}>
          <Link to={`/${device.slug}`}>{device.title}</Link>
        </li>
      ))}
    </ul>
  );
};

export default FilterDevices;
