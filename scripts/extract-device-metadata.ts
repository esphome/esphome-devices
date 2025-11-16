import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { VALID_TYPES, VALID_BOARDS, VALID_STANDARDS } from '../src/utils/validFrontmatter';

interface DeviceFrontmatter {
  title?: string;
  description?: string;
  board?: string;
  type?: string;
  manufacturer?: string;
  model?: string;
  standards?: string[];
  'last-published'?: string;
  difficulty?: string | number;
  [key: string]: any; // Allow additional unknown fields
}

interface DeviceMetadata {
  [key: string]: DeviceFrontmatter;
}

function parseFrontmatter(content: string): DeviceFrontmatter {
  try {
    const { data } = matter(content);
    return data as DeviceFrontmatter;
  } catch (error) {
    console.warn(`Error parsing frontmatter: ${(error as Error).message}`);
    return {};
  }
}

// Function to safely read a file
function safeReadFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`Error reading file ${filePath}: ${(error as Error).message}`);
    return null;
  }
}

// Function to safely create directory
function ensureDirectoryExists(dirPath: string): void {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Error creating directory ${dirPath}: ${(error as Error).message}`);
    throw error;
  }
}

// Main function to extract metadata from all device files
function extractDeviceMetadata(): void {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const devicesDir = path.join(__dirname, '..', 'src', 'docs', 'devices');
  const outputFile = path.join(__dirname, '..', 'src', 'data', 'device-metadata.json');
  
  const HELP_MESSAGE_FOLDER_NAME = 'See https://devices.esphome.io/devices/adding-devices#create-device-folder-and-markdown-file for help.';
  const HELP_MESSAGE_FRONTMATTER = 'See https://devices.esphome.io/devices/adding-devices#yaml-front-matter for help.';

  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  ensureDirectoryExists(outputDir);

  const deviceMetadata: DeviceMetadata = {};

  try {
    // Check if devices directory exists
    if (!fs.existsSync(devicesDir)) {
      console.warn(`Devices directory not found: ${devicesDir}`);
      return;
    }

    // Read all subdirectories in devices folder
    const deviceDirs = fs.readdirSync(devicesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`Found ${deviceDirs.length} device directories`);

    let validationPassed = true;
    for (const deviceDir of deviceDirs) {
      // Validate device folder name
      if (!/^[a-zA-Z0-9_.+\-]+$/.test(deviceDir)) {
        console.error(`Invalid device folder name: ${deviceDir}. Only a-z, A-Z, 0-9, _, ., -, + are allowed.`);
        console.error(HELP_MESSAGE_FOLDER_NAME);
        process.exit(1);
      }

      const deviceDirPath = path.join(devicesDir, deviceDir);
      let targetFile: string | null = null;

      // First, try to find index.md
      const indexFile = path.join(deviceDirPath, 'index.md');
      if (fs.existsSync(indexFile)) {
        targetFile = indexFile;
      } else {
        // index.md doesn't exist, look for other .md files
        try {
          const files = fs.readdirSync(deviceDirPath, { withFileTypes: true });
          const mdFiles = files
            .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
            .map(dirent => dirent.name);

          if (mdFiles.length === 1) {
            // Exactly one .md file found, use it
            targetFile = path.join(deviceDirPath, mdFiles[0]);
            console.log(`Using ${mdFiles[0]} for device ${deviceDir} (index.md not found)`);
          } else if (mdFiles.length === 0) {
            console.warn(`No markdown files found for device ${deviceDir}: ${deviceDirPath}`);
            continue;
          } else {
            console.warn(`Multiple markdown files found for device ${deviceDir} (${mdFiles.length} files: ${mdFiles.join(', ')}), skipping`);
            continue;
          }
        } catch (error) {
          console.warn(`Error reading directory ${deviceDirPath} for device ${deviceDir}: ${(error as Error).message}`);
          continue;
        }
      }

      if (!targetFile) {
        continue;
      }

      const content = safeReadFile(targetFile);
      if (!content) {
        continue;
      }

      const frontmatter = parseFrontmatter(content);

      // Validate frontmatter
      if (frontmatter['last-published']) {
        const lastPublished = new Date(frontmatter['last-published']);
        if (isNaN(lastPublished.getTime())) {
          console.error(`Invalid last-published date format in ${targetFile}: ${frontmatter['last-published']}`);
          console.error(HELP_MESSAGE_FRONTMATTER);
          process.exit(1);
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (lastPublished > today) {
          console.error(`last-published date in ${targetFile} is in the future: ${frontmatter['last-published']}`);
          console.error(HELP_MESSAGE_FRONTMATTER);
          process.exit(1);
        }
      }

      if (frontmatter.type) {
        const type = frontmatter.type.toLowerCase();
        if (!VALID_TYPES.has(type)) {
          console.error(`Invalid type in ${targetFile}: ${frontmatter.type}. Must be one of: ${Array.from(VALID_TYPES).join(', ')}`);
          console.error(HELP_MESSAGE_FRONTMATTER);
          process.exit(1);
        }
      }

      if (frontmatter.board) {
        const boards = frontmatter.board.split(',').map(b => b.trim().toLowerCase());
        for (const board of boards) {
          if (!VALID_BOARDS.has(board)) {
            console.error(`Invalid board in ${targetFile}: ${frontmatter.board}. Must be one of: ${Array.from(VALID_BOARDS).join(', ')}`);
            console.error(HELP_MESSAGE_FRONTMATTER);
            process.exit(1);
          }
        }
      }

      if (frontmatter.standards) {
        const standards = Array.isArray(frontmatter.standards)
          ? frontmatter.standards
          : frontmatter.standards.split(',').map(s => s.trim().toLowerCase());
        for (const standard of standards) {
          if (!VALID_STANDARDS.has(standard)) {
            console.error(`Invalid standard in ${targetFile}: ${standard}. Must be one of: ${Array.from(VALID_STANDARDS).join(', ')}`);
            console.error(HELP_MESSAGE_FRONTMATTER);
            process.exit(1);
          }
        }
      }

      if (frontmatter.difficulty !== undefined) {
        const difficulty = frontmatter.difficulty;
        const numDifficulty = typeof difficulty === 'string' ? parseInt(difficulty, 10) : difficulty;
        if (isNaN(numDifficulty) || numDifficulty < 1 || numDifficulty > 5) {
          console.error(`Invalid difficulty in ${targetFile}: ${difficulty}. Must be 1-5.`);
          console.error(HELP_MESSAGE_FRONTMATTER);
          process.exit(1);
        }
      }

      // Only add if we have some frontmatter data
      if (Object.keys(frontmatter).length > 0) {
        deviceMetadata[deviceDir] = frontmatter;
      } else {
        console.warn(`No frontmatter found in ${targetFile}`);
      }
    }

    console.log(`Validated ${deviceDirs.length} devices successfully.`);

    // Write metadata to JSON file
    try {
      fs.writeFileSync(outputFile, JSON.stringify(deviceMetadata, null, 2));
      console.log(`Extracted metadata for ${Object.keys(deviceMetadata).length} devices`);
      console.log(`Metadata saved to ${outputFile}`);
    } catch (error) {
      console.error(`Error writing metadata file: ${(error as Error).message}`);
      throw error;
    }

  } catch (error) {
    console.error(`Error extracting device metadata: ${(error as Error).message}`);
    throw error;
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  extractDeviceMetadata();
}

export { extractDeviceMetadata, DeviceFrontmatter, DeviceMetadata };
