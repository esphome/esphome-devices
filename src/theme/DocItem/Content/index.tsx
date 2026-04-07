import React, {type ReactNode} from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import FrontmatterDisplay from '@site/src/components/FrontmatterDisplay';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): ReactNode {
  // Extract frontmatter from the MDX content
  const frontmatter = (props as any)?.children?.type?.frontMatter || {};

  return (
    <>
      <FrontmatterDisplay frontmatter={frontmatter} />
      <Content {...props} />
    </>
  );
}
