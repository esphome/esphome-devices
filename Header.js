import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { GiHamburgerMenu } from "react-icons/gi";
import { useStaticQuery, graphql } from "gatsby";

const Container = styled.header`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  height: 40px;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    border: none;
    padding: 0;
    font-size: 18px;

    @media (max-width: 359px) {
      font-size: 14px;
    }
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    margin-right: 16px;

    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  @media (min-width: 780px) {
    display: none;
  }
`;

export default function Header({ handleMenuOpen }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            siteTitle
          }
        }
      }
    `
  );

  const { siteTitle } = site.siteMetadata;

  return (
    <Container>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-0QG5MYES89"
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-0QG5MYES89');`,
        }}
      ></script>
      <button aria-label="Open sidebar" type="button" onClick={handleMenuOpen}>
        <GiHamburgerMenu size={23} aria-hidden="true" />
      </button>
      <h2>{siteTitle}</h2>
    </Container>
  );
}

Header.propTypes = {
  handleMenuOpen: PropTypes.func.isRequired,
};
