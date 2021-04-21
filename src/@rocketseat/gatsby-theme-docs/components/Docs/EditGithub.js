/* @jsx jsx */
import { useTheme, jsx, css } from '@emotion/react';
import PropTypes from 'prop-types';
import { MdEdit } from 'react-icons/md';

export default function EditGithub({ repositoryEditUrl, repositoryProvider }) {
  const theme = useTheme();

  if (repositoryEditUrl) {
    return (
      <a
        href={repositoryEditUrl}
        target="_blank"
        rel="noopener noreferrer"
        css={css`
          display: flex;
          align-items: center;
          text-decoration: none;
          margin-top: 48px;
          color: ${theme.colors.text};
          opacity: 0.8;
          font-size: 14px;
          font-weight: normal;
        `}
      >
        <MdEdit style={{ marginRight: '5px' }} />
        Edit this page on {repositoryProvider}
      </a>
    );
  }
  return null;
}

EditGithub.propTypes = {
  repositoryEditUrl: PropTypes.string,
  repositoryProvider: PropTypes.string,
};

EditGithub.defaultProps = {
  repositoryEditUrl: null,
  repositoryProvider: null,
};
