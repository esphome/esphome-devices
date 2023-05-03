import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { DeviceLink } from "../DeviceLink";

const FilterDevices = ({ filterDeviceType, filterStandard, filterBoard }) => {
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

    if (filterBoard) {
      return e?.node?.frontmatter?.board
      ?.toLowerCase()
      ?.includes(filterBoard.toLowerCase());
    }

    return e?.node?.frontmatter?.standard
      ?.toLowerCase()
      ?.includes(filterStandard.toLowerCase());
  });

  const mapped = filtered?.map(({ node }) => {
    return {
      id: node.id,
      slug: node.slug,
      title: node?.frontmatter?.title,
      type: filterDeviceType ? null : node?.frontmatter?.type,
      board: filterBoard ? null : node?.frontmatter?.board?.toLowerCase(),
      standard: filterStandard
        ? null
        : node?.frontmatter?.standard?.toLowerCase(),
    };
  });
  return (
    <ul>
      {mapped.map((device) => (
        <li key={device.id}>
          <DeviceLink {...device} />
        </li>
      ))}
    </ul>
  );
};

export default FilterDevices;
