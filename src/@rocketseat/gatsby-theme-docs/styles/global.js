import React from "react";
import { useTheme, Global, css } from "@emotion/react";

export default function GlobalStyle() {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        *,
        *::after,
        *::before {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Instrument+Sans:ital,wdth@75..100,wght@0,400..700;1,400..700&display=swap');

        body {
          font-size: 16px;
          font-family: "Instrument Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          background-color: ${theme.colors.background};
          text-rendering: optimizelegibility;
          -webkit-font-smoothing: antialiased;
          overflow-y: scroll;
          line-height: 1.6;
          letter-spacing: 0.0075em;
        }

        h1 {
          font-size: 3rem;
          color: ${theme.colors.title};
          font-family: "Figtree", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          font-weight: 800;
          margin-top: -4px;
          margin-bottom: 24px;
          line-height: 1.25;
        }

        h2 {
          font-size: 24px;
          font-weight: 700;
        }

        h3 {
          font-size: 18px;
          font-weight: 700;
        }

        h4 {
          font-size: 16px;
          font-weight: 700;
        }

        h2,
        h3,
        h4,
        h5,
        h6 {
          color: ${theme.colors.title};

          margin: 24px 0 16px 0;
          font-family: "Figtree", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          font-weight: 600;
        }

        p {
          color: ${theme.colors.text};
          font-size: 16px;
          line-height: 28px;
          margin-bottom: 16px;
          font-weight: 400;
        }

        strong {
          font-weight: 600;
        }

        code.inline-code {
          display: inline-block;
          vertical-align: middle;
          line-height: 1;
          padding: 0.2em;
          background-color: #44475a;
          color: rgba(248, 248, 242);
          font-size: 14px;
          border-radius: 3px;
          font-feature-settings: "clig" 0, "calt" 0;
          font-variant: no-common-ligatures no-discretionary-ligatures
            no-historical-ligatures no-contextual;
        }

        h1 code.inline-code,
        h2 code.inline-code {
          font-size: calc(100% - 5px);
          padding: 4px;
        }

        a {
          color: ${theme.colors.text};
          font-weight: 600;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }

        blockquote {
          margin-bottom: 16px;
          width: 100%;

          p {
            padding: 1rem;
            border-radius: 5px;
            background: ${theme.colors.components.blockquote.background};
            color: ${theme.colors.components.blockquote.text};
            margin: 0;

            a {
              color: ${theme.colors.components.blockquote.text};
            }
          }
        }

        hr {
          border: 0;
          height: 0;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        table {
          border-collapse: separate;
          border-spacing: 0 4px;
          margin-top: -4px;
          margin-bottom: 16px;
          width: 100%;

          th,
          td {
            margin: 0;
            color: ${theme.colors.text};
            background-color: ${theme.colors.shape};
            border: solid 1px ${theme.colors.shape};
            border-style: solid none;
            padding: 12px;

            :first-of-type {
              border-left-style: solid;
              border-top-left-radius: 5px;
              border-bottom-left-radius: 5px;
            }

            :last-child {
              border-right-style: solid;
              border-bottom-right-radius: 5px;
              border-top-right-radius: 5px;
            }
          }

          tr {
            th {
              color: ${theme.colors.title};
              text-align: left;
              font-weight: bold;
            }
          }
        }

        iframe {
          margin-bottom: 16px;
        }

        img {
          max-width: 100%;
        }

        ul,
        ol {
          color: ${theme.colors.text};
          padding-left: 15px;
          margin-bottom: 16px;

          li {
            line-height: 28px;
          }
        }

        li ul,
        li ol {
          margin-bottom: 0;
        }

        .gatsby-highlight {
          font-family: Hack, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
          font-variant: no-common-ligatures no-discretionary-ligatures
            no-historical-ligatures no-contextual;

          position: relative;
          z-index: 0;
          margin: 0 0 16px 0;
          overflow: auto;

          .token {
            font-style: normal !important;
          }
        }

        pre[class*="language-"] code {
          font-family: inherit;
        }

        pre[class*="language-"]::before {
          background: #d9d7e0;
          border-radius: 0 0 4px 4px;
          color: #232129;
          font-size: 12px;
          font-family: inherit;
          letter-spacing: 0.075em;
          line-height: 1;
          padding: 0.25rem 0.5rem;
          position: absolute;
          left: 1rem;
          text-align: right;
          text-transform: uppercase;
          top: 0;
        }

        pre[class~="language-js"]::before,
        pre[class~="language-javascript"]::before {
          content: "js";
          background: #f7df1e;
        }

        pre[class~="language-jsx"]::before {
          content: "jsx";
          background: #61dafb;
        }

        pre[class~="language-typescript"]::before,
        pre[class~="language-ts"]::before {
          content: "ts";
          background: #294e80;
          color: #fff;
        }

        pre[class~="language-tsx"]::before {
          content: "tsx";
          background: #294e80;
          color: #fff;
        }

        pre[class~="language-graphql"]::before {
          content: "GraphQL";
          background: #e10098;
          color: #fff;
        }

        pre[class~="language-html"]::before {
          content: "html";
          background: #005a9c;
          color: #fff;
        }

        pre[class~="language-css"]::before {
          content: "css";
          background: #ff9800;
          color: #fff;
        }

        pre[class~="language-mdx"]::before {
          content: "mdx";
          background: #f9ac00;
          color: #fff;
        }

        pre[class~="language-shell"]::before {
          content: "shell";
        }

        pre[class~="language-sh"]::before {
          content: "sh";
        }

        pre[class~="language-bash"]::before {
          content: "bash";
        }

        pre[class~="language-yaml"]::before,
        pre[class~="language-yml"]::before {
          content: "yaml";
          background: #a8d8ff;
        }

        pre[class~="language-markdown"]::before {
          content: "md";
        }

        pre[class~="language-json"]::before,
        pre[class~="language-json5"]::before {
          content: "json";
          background: linen;
        }

        pre[class~="language-diff"]::before {
          content: "diff";
          background: #e6ffed;
        }

        pre[class~="language-text"]::before {
          content: "text";
          background: #fff;
        }

        pre[class~="language-flow"]::before {
          content: "flow";
          background: #e8bd36;
        }

        .tag {
          padding: 0px 4px;
          border: 1px dotted ${theme.colors.primary};
          border-radius: 5px;
          color: ${theme.colors.primary};
          font-size: 14px;
          margin: 2px 4px;
          font-weight: 500;
          display: inline-block;
          word-wrap: break-word;
          white-space: normal;
        }
      `}
    />
  );
}
