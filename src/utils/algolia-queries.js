require("dotenv").config();

const indexName = process.env.GATSBY_ALGOLIA_INDEX;

const pageQuery = `{
  pages: allMdx(filter: {fields: {slug: {glob: "/devices/**/*"}}}) {
    edges {
      node {
        id
        frontmatter {
          title,
          date_published
        }
        fields {
          slug
        }
        excerpt(pruneLength: 5000)
      }
    }
  }
}`;

function pageToAlgoliaRecord({ node: { id, frontmatter, fields, ...rest } }) {
  return {
    objectID: id,
    ...frontmatter,
    ...fields,
    ...rest,
  };
}

const queries = [
  {
    query: pageQuery,
    transformer: ({ data }) => data.pages.edges.map(pageToAlgoliaRecord),
    indexName,
  },
];

module.exports = queries;
