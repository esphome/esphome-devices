import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

interface DeviceFrontmatter {
  title?: string;
  description?: string;
  board?: string;
  type?: string;
  manufacturer?: string;
  model?: string;
  standards?: string[];
  [key: string]: any; // Allow additional unknown fields
}

interface DeviceMetadata {
  [key: string]: DeviceFrontmatter;
}

// Function to safely parse frontmatter from markdown content
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

    for (const deviceDir of deviceDirs) {
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

      // Only add if we have some frontmatter data
      if (Object.keys(frontmatter).length > 0) {
        deviceMetadata[deviceDir] = frontmatter;
      } else {
        console.warn(`No frontmatter found in ${targetFile}`);
      }
    }

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
