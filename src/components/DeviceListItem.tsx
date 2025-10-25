import React from 'react';
import Link from '@docusaurus/Link';

import {splitValues, slugify} from '../utils/deviceUtils';

interface DeviceListItemProps {
  id: string;
  title: string;
  path: string;
  type?: string;
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
  const boardValues = splitValues(board);
  const standardValues = splitValues(standard);

  return (
    <li className="deviceListItem">
      <div className="deviceListContent">
        <Link to={path} className="deviceListTitle">
          {title}
        </Link>
        <div className="deviceListTags">
          {type && (
            <Link to={`/type/${slugify(type)}`} className="deviceTag">
              {type}
            </Link>
          )}
          {boardValues.map(boardValue => (
            <Link
              key={`board-${id}-${boardValue}`}
              to={`/board/${slugify(boardValue)}`}
              className="deviceTag"
            >
              {boardValue}
            </Link>
          ))}
          {standardValues.map(standardValue => (
            <Link
              key={`standard-${id}-${standardValue}`}
              to={`/standards/${slugify(standardValue)}`}
              className="deviceTag"
            >
              {standardValue}
            </Link>
          ))}
        </div>
      </div>
    </li>
  );
});

DeviceListItem.displayName = 'DeviceListItem';

export default DeviceListItem;

