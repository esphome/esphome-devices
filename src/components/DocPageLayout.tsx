import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import DocSidebar from '@theme/DocSidebar';
import Link from '@docusaurus/Link';
import sidebars from '../../sidebars';
import layoutStyles from './DocPageLayout/styles.module.css';
import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';

interface DocPageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  children?: React.ReactNode;
  sidebarId?: string;
  path?: string;
}

export default function DocPageLayout({
  title,
  description,
  breadcrumbs = [],
  children,
  sidebarId = 'tutorialSidebar',
  path = '/',
}: DocPageLayoutProps) {
  // Get sidebar data from the imported sidebars configuration
  const rawSidebar = sidebars[sidebarId] || [];
  const sidebar = Array.isArray(rawSidebar) ? (rawSidebar as PropSidebarItem[]) : [];

  return (
    <Layout title={title} description={description}>
      <div className={clsx('theme-doc-page', layoutStyles.docPage)}>
        {sidebar.length > 0 && (
          <aside className={clsx('theme-doc-sidebar-container', layoutStyles.docSidebarContainer)}>
            <DocSidebar sidebar={sidebar} path={path} onCollapse={() => {}} isHidden={false} />
          </aside>
        )}
        <main className={clsx('theme-doc-main', layoutStyles.docMainContainer)}>
          <div className={clsx('container', 'padding-top--md', 'padding-bottom--lg', layoutStyles.docContentWrapper)}>
            <div className="row">
              <div className={clsx('col', 'col--12', layoutStyles.docItemCol)}>
                <article className="theme-doc-markdown markdown">
                  {breadcrumbs.length > 0 && (
                    <nav className={clsx('theme-doc-breadcrumbs', layoutStyles.breadcrumbsContainer)}>
                      <ul className="breadcrumbs">
                        <li className="breadcrumbs__item">
                          <a aria-label="Home page" className="breadcrumbs__link" href="/">
                            <svg viewBox="0 0 24 24" className={layoutStyles.breadcrumbHomeIcon}>
                              <path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" fill="currentColor"></path>
                            </svg>
                          </a>
                        </li>
                        {breadcrumbs.map((crumb, index) => (
                          <li
                            key={index}
                            itemScope
                            itemProp="itemListElement"
                            itemType="https://schema.org/ListItem"
                            className={clsx(
                              'breadcrumbs__item',
                              index === breadcrumbs.length - 1 && 'breadcrumbs__item--active'
                            )}
                          >
                            {crumb.href ? (
                              <Link className="breadcrumbs__link" to={crumb.href} itemProp="name">
                                {crumb.label}
                              </Link>
                            ) : (
                              <span className="breadcrumbs__link" itemProp="name">
                                {crumb.label}
                              </span>
                            )}
                            <meta itemProp="position" content={(index + 2).toString()} />
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                  <div className="markdown">
                    {children}
                  </div>
                </article>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
