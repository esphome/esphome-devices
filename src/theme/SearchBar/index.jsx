import React from "react";

import ErrorBoundary from "@docusaurus/ErrorBoundary";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from "@docusaurus/useGlobalData";

import Canary from "@getcanary/docusaurus-theme-search-pagefind/dist/theme/SearchBar/Canary.jsx";

async function preloadPagefind(path) {
  if (typeof window === "undefined" || !path || window.pagefind) {
    return;
  }

  const nativeImport = new Function("modulePath", "return import(modulePath);");
  window.pagefind = await nativeImport(path);
}

export default function SearchBar() {
  const { siteConfig } = useDocusaurusContext();
  const [path, setPath] = React.useState("");
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setPath(`${siteConfig.baseUrl}pagefind/pagefind.js`);
  }, [siteConfig]);

  React.useEffect(() => {
    let cancelled = false;

    async function initialize() {
      if (!path) {
        return;
      }

      try {
        await preloadPagefind(path);
      } catch (error) {
        console.info("Failed to preload pagefind", error);
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [path]);

  const { options } = usePluginData("docusaurus-theme-search-pagefind");
  const { styles, ...rest } = options;

  React.useEffect(() => {
    if (styles) {
      Object.entries(styles).forEach(([key, value]) => {
        document.body.style.setProperty(key, value);
      });
    }
  }, [styles]);

  if (!path || !ready) {
    return null;
  }

  return (
    <ErrorBoundary
      fallback={({ error, tryAgain }) => (
        <div>
          <p>Canary crashed because: "{error.message}".</p>
          <p>
            Most likely, your production build will be fine. <pre>(docusaurus build && docusaurus serve)</pre>
          </p>
          <p>Here's what you can do:</p>
          <ul>
            <li>
              Try to <button onClick={tryAgain}>reload</button> the page.
            </li>
            <li>
              Run production build at least once: <pre>docusaurus build</pre>
            </li>
            <li>
              If the problem persists, please <a href="https://github.com/fastrepl/canary/issues/new">open an issue.</a>
            </li>
          </ul>
        </div>
      )}
    >
      <Canary options={{ ...rest, path }} />
    </ErrorBoundary>
  );
}
