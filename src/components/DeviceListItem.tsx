import React from 'react';
import Link from '@docusaurus/Link';

import {splitValues} from '../utils/deviceUtils';
import {
  VALID_TYPE_SLUGS,
  VALID_BOARD_SLUGS,
  VALID_STANDARD_SLUGS,
  getSlugIfValid,
} from '../utils/validSlugs';

const renderTag = (
  id: string,
  value: string,
  basePath: 'type' | 'board' | 'standards',
  validSlugs: ReadonlySet<string>,
) => {
  const slug = getSlugIfValid(value, validSlugs);
  const key = `${basePath}-${id}-${value}`;

  if (slug) {
    return (
      <Link
        key={key}
        to={`/${basePath}/${slug}`}
        className="deviceTag"
      >
        {value}
      </Link>
    );
  }

  return (
    <span key={key} className="deviceTag">
      {value}
    </span>
  );
};

interface DeviceListItemProps {
  id: string;
  title: string;
  path: string;
  type?: string | string[];
  board?: string | string[];
  standard?: string | string[];
}

const DeviceListItem: React.FC<DeviceListItemProps> = React.memo(({
  id,
  title,
  path,
  type,
  board,
  standard,
}) => {
  const typeValues = splitValues(type);
  const boardValues = splitValues(board);
  const standardValues = splitValues(standard);

  return (
    <li className="deviceListItem">
      <div className="deviceListContent">
        <Link to={path} className="deviceListTitle">
          {title}
        </Link>
        <div className="deviceListTags">
          {typeValues.map(typeValue =>
            renderTag(id, typeValue, 'type', VALID_TYPE_SLUGS)
          )}
          {boardValues.map(boardValue =>
            renderTag(id, boardValue, 'board', VALID_BOARD_SLUGS)
          )}
          {standardValues.map(standardValue =>
            renderTag(id, standardValue, 'standards', VALID_STANDARD_SLUGS)
          )}
        </div>
      </div>
    </li>
  );
});

DeviceListItem.displayName = 'DeviceListItem';

export default DeviceListItem;

