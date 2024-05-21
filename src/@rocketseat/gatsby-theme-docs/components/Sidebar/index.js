import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql, Link } from "gatsby";
import { useSidebar } from "@rocketseat/gatsby-theme-docs-core";
import Search from "../../../../components/search";
import {
  Container,
  LogoContainer,
  List,
  Heading,
  Item,
  SubItem,
} from "./styles";
import { isExternalUrl } from "../../util/url";
import ExternalLink from "./ExternalLink";
import InternalLink from "./InternalLink";
import Logo from "../Logo";

function ListWithSubItems({ children, text }) {
  return (
    <>
      <Heading>{text}</Heading>
      <SubItem>{children}</SubItem>
    </>
  );
}

export default function Sidebar({ isMenuOpen }) {
  const {
    site: {
      siteMetadata: { basePath },
    },
  } = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          basePath
        }
      }
    }
  `);

  const data = useSidebar();

  function renderLink(link, label) {
    return isExternalUrl(link) ? (
      <ExternalLink link={link} label={label} />
    ) : (
      <InternalLink link={link} label={label} />
    );
  }

  const searchIndices = [
    { name: process.env.GATSBY_ALGOLIA_INDEX, title: `Pages` },
  ];

  return (
    <Container isMenuOpen={isMenuOpen}>
      <LogoContainer>
        <Link to={basePath} aria-label="Go to home page">
          <Logo aria-hidden="true" />
        </Link>
      </LogoContainer>
      <div></div>
      <nav>
        <Search indices={searchIndices} />
        <List>
          {data.map(({ node: { label, link, items, id } }) => {
            if (Array.isArray(items)) {
              const subitems = items.map((item) => (
                <Item key={item.link}>{renderLink(item.link, item.label)}</Item>
              ));

              return (
                <ListWithSubItems key={id} text={label}>
                  {subitems}
                </ListWithSubItems>
              );
            }

            return <Heading key={id}>{renderLink(link, label)}</Heading>;
          })}
        </List>
      </nav>
    </Container>
  );
}

ListWithSubItems.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.node,
  ]).isRequired,
  text: PropTypes.string.isRequired,
};

Sidebar.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
};
