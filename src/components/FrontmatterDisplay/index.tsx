import React from "react";
import Link from "@docusaurus/Link";

import { splitValues } from "../../utils/deviceUtils";
import {
  VALID_TYPES,
  VALID_BOARDS,
  VALID_STANDARDS,
} from "../../utils/validFrontmatter";
import { getSlugIfValid } from "../../utils/validSlugs";

import styles from "./styles.module.css";

interface FrontmatterDisplayProps {
  frontmatter: Record<string, any>;
}

// Function to render difficulty level
function renderDifficulty(difficulty: string) {
  const level = parseInt(difficulty);
  const labels = {
    1: "Comes with ESPhome",
    2: "Plug-n-flash",
    3: "Disassembly required",
    4: "Soldering required",
    5: "Chip needs replacement",
  };

  const label = labels[level as keyof typeof labels] || `Level ${level}`;

  return (
    <span>
      {label} ({level}/5)
    </span>
  );
}

function FrontmatterDisplay({ frontmatter }: FrontmatterDisplayProps) {
  // Check if device is made for ESPHome
  const frontmatterIsMadeForESPHome = frontmatter["made-for-esphome"];
  const isMadeForESPHome =
    frontmatterIsMadeForESPHome === true
      ? true
      : typeof frontmatterIsMadeForESPHome === "string"
      ? frontmatterIsMadeForESPHome.toLowerCase() === "true"
      : false;

  // Define which frontmatter fields to display and how
  const displayFields = [
    {
      key: "type",
      label: "Device Type",
      linkable: true,
      linkType: "type",
      isDifficulty: false,
      isUrl: false,
    },
    {
      key: "standard",
      label: "Electrical Standard",
      linkable: true,
      linkType: "standards",
      isDifficulty: false,
      isUrl: false,
    },
    {
      key: "board",
      label: "Board",
      linkable: true,
      linkType: "board",
      isDifficulty: false,
      isUrl: false,
    },
    {
      key: "difficulty",
      label: "Difficulty",
      linkable: false,
      isDifficulty: true,
      isUrl: false,
    },
    {
      key: "project-url",
      label: "Project URL",
      linkable: false,
      isDifficulty: false,
      isUrl: true,
    },
  ];

  const fieldsToDisplay = displayFields.filter(
    (field) => frontmatter[field.key]
  );

  if (fieldsToDisplay.length === 0 && !isMadeForESPHome) {
    return null;
  }

  return (
    <div>
      {isMadeForESPHome && (
        <div className={styles.madeForESPHomeLogo}>
          <a
            href="https://esphome.io/guides/made_for_esphome/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.logoLink}
          >
            <img
              src="/img/made-for-esphome-black-on-white.svg"
              alt="Made for ESPHome"
              className={styles.logoImage}
            />
          </a>
        </div>
      )}
      {fieldsToDisplay.length > 0 && (
        <div className={styles.frontmatterDisplay}>
          {fieldsToDisplay.map((field) => (
            <div key={field.key} className={styles.frontmatterItem}>
              <span className={styles.frontmatterLabel}>{field.label}:</span>
              <span className={styles.frontmatterValue}>
                {field.isDifficulty ? (
                  renderDifficulty(frontmatter[field.key])
                ) : field.isUrl ? (
                  <a
                    href={frontmatter[field.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {frontmatter[field.key]}
                  </a>
                ) : field.linkable ? (
                  field.key === "standard" || field.key === "board" ? (
                    (() => {
                      const values = splitValues(frontmatter[field.key]);

                      if (values.length === 0) {
                        const slug = getSlugIfValid(
                          frontmatter[field.key],
                          field.key === "standard"
                            ? VALID_STANDARDS
                            : VALID_BOARDS
                        );

                        return slug ? (
                          <Link to={`/${field.linkType}/${slug}`}>
                            {frontmatter[field.key]}
                          </Link>
                        ) : (
                          <span>{frontmatter[field.key]}</span>
                        );
                      }

                      return (
                        <span className={styles.frontmatterTagList}>
                          {values.map((value, index) => (
                            (() => {
                              const slug = getSlugIfValid(
                                value,
                                field.key === "standard"
                                  ? VALID_STANDARDS
                                  : VALID_BOARDS
                              );

                              return slug ? (
                                <Link
                                  key={`${field.key}-${value}-${index}`}
                                  to={`/${field.linkType}/${slug}`}
                                  className={styles.frontmatterTag}
                                >
                                  {value}
                                </Link>
                              ) : (
                                <span
                                  key={`${field.key}-${value}-${index}`}
                                  className={styles.frontmatterTag}
                                >
                                  {value}
                                </span>
                              );
                            })()
                          ))}
                        </span>
                      );
                    })()
                  ) : field.key === "type" ? (
                    <span className={styles.frontmatterTagList}>
                      {(() => {
                        const slug = getSlugIfValid(
                          frontmatter[field.key],
                          VALID_TYPES
                        );

                        return slug ? (
                          <Link
                            to={`/${field.linkType}/${slug}`}
                            className={styles.frontmatterTag}
                          >
                            {frontmatter[field.key]}
                          </Link>
                        ) : (
                          <span className={styles.frontmatterTag}>
                            {frontmatter[field.key]}
                          </span>
                        );
                      })()}
                    </span>
                  ) : (
                    <Link to={`/${field.linkType}/${frontmatter[field.key]}`}>
                      {frontmatter[field.key]}
                    </Link>
                  )
                ) : (
                  <span>{frontmatter[field.key]}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FrontmatterDisplay;
