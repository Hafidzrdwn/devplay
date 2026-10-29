import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';
import { concepts } from '../src/data/concepts';
import type { ConceptMeta, CrewId } from '../src/types/content';

interface ValidationResult {
  conceptId: number;
  slug: string;
  idStatus: 'PASS' | 'FAIL' | 'PENDING';
  enStatus: 'PASS' | 'FAIL' | 'PENDING';
  idErrors: string[];
  enErrors: string[];
}

const VALID_CREW_IDS: ReadonlySet<string> = new Set<CrewId>([
  'dev',
  'pixel',
  'mutex',
  'query',
  'cache',
  'ping',
  'bug',
  'sec',
  'ops',
  'intern',
]);

const TARGET_CONCEPTS: ConceptMeta[] = concepts.filter((concept) => concept.id <= 50);
const TARGET_TOTAL = TARGET_CONCEPTS.length;

const isStrictMode = process.argv.includes('--strict');

function collectMdxFiles(directoryPath: string): string[] {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }
  const collectedPaths: string[] = [];
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      collectedPaths.push(...collectMdxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      collectedPaths.push(fullPath);
    }
  }
  return collectedPaths;
}

function findOrphanFiles(docsRootPath: string, validConcepts: ConceptMeta[]): string[] {
  const orphanPaths: string[] = [];
  const validMap = new Set<string>();

  for (const concept of validConcepts) {
    validMap.add(`id/${concept.category}/${concept.slug}.mdx`);
    validMap.add(`en/${concept.category}/${concept.slug}.mdx`);
  }

  const allFiles = collectMdxFiles(docsRootPath);
  for (const filePath of allFiles) {
    const relative = path.relative(docsRootPath, filePath).split(path.sep).join('/');
    if (!validMap.has(relative)) {
      orphanPaths.push(relative);
    }
  }

  return orphanPaths;
}

function validateMdxFile(
  filePath: string,
  expectedLang: 'id' | 'en',
  concept: ConceptMeta
): { exists: boolean; errors: string[] } {
  if (!fs.existsSync(filePath)) {
    return { exists: false, errors: [] };
  }

  const errors: string[] = [];
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const parsed = matter(rawContent);
  const data = parsed.data;

  if (data.conceptId !== concept.id) {
    errors.push(`conceptId '${String(data.conceptId)}' tidak cocok dengan registry (${concept.id})`);
  }

  if (data.category !== concept.category) {
    errors.push(`category '${String(data.category)}' tidak cocok dengan registry (${concept.category})`);
  }

  if (data.difficulty !== concept.difficulty) {
    errors.push(`difficulty '${String(data.difficulty)}' tidak cocok dengan registry (${concept.difficulty})`);
  }

  if (data.visualization !== concept.visualization) {
    errors.push(`visualization '${String(data.visualization)}' tidak cocok dengan registry (${concept.visualization})`);
  }

  if (typeof data.tldr !== 'string' || data.tldr.trim().length === 0) {
    errors.push('tldr wajib diisi');
  } else if (data.tldr.length > 180) {
    errors.push(`tldr melebihi 180 karakter (${data.tldr.length})`);
  }

  if (!Array.isArray(data.keywords)) {
    errors.push('keywords harus berupa array string');
  } else if (data.keywords.length < 4 || data.keywords.length > 8) {
    errors.push(`keywords harus berjumlah 4-8 item (ditemukan ${data.keywords.length})`);
  }

  if (data.speaker !== undefined && !VALID_CREW_IDS.has(String(data.speaker))) {
    errors.push(`speaker '${String(data.speaker)}' bukan CrewId yang valid`);
  }

  const bodyContent = parsed.content;

  if (!bodyContent.includes('<AnalogyBox')) {
    errors.push('komponen AnalogyBox tidak ditemukan');
  }

  if (!bodyContent.includes('<Callout')) {
    errors.push('komponen Callout tidak ditemukan');
  }

  if (!bodyContent.includes('<CodeCompare')) {
    errors.push('komponen CodeCompare tidak ditemukan');
  }

  if (!bodyContent.includes('<QuickCheck')) {
    errors.push('komponen QuickCheck tidak ditemukan');
  }

  const simImportRegex = /import\s+([A-Z][\w\d]*)\s+from\s+['"][^'"]*components\/simulations\/[^'"]+['"]/g;
  const importedSimNames: string[] = [];
  let simMatch: RegExpExecArray | null = simImportRegex.exec(rawContent);

  while (simMatch !== null) {
    const matchedName = simMatch[1];
    if (matchedName) {
      importedSimNames.push(matchedName);
    }
    simMatch = simImportRegex.exec(rawContent);
  }

  if (importedSimNames.length === 0) {
    errors.push('komponen simulasi dari components/simulations tidak di-import');
  } else {
    let clientVisibleSimCount = 0;
    for (const simName of importedSimNames) {
      const simUsageRegex = new RegExp(`<${simName}\\b[^>]*\\bclient:visible`, 'g');
      const matches = bodyContent.match(simUsageRegex);
      if (matches) {
        clientVisibleSimCount += matches.length;
      }
    }
    if (clientVisibleSimCount !== 1) {
      errors.push(`harus ada tepat 1 komponen simulasi dengan client:visible (ditemukan ${clientVisibleSimCount})`);
    }
  }

  const h2Matches = bodyContent.match(/^##\s+.+$/gm);
  const h2Count = h2Matches ? h2Matches.length : 0;
  if (h2Count < 5) {
    errors.push(`minimal 5 heading h2 diperlukan (ditemukan ${h2Count})`);
  }

  const langPropRegex = /\blang=(?:["']([^"']+)["']|\{["']([^"']+)["']\})/g;
  let langMatch: RegExpExecArray | null = langPropRegex.exec(bodyContent);

  while (langMatch !== null) {
    const foundLang = langMatch[1] ?? langMatch[2];
    if (foundLang !== expectedLang) {
      errors.push(`prop lang='${foundLang}' tidak cocok dengan folder bahasa '${expectedLang}'`);
    }
    langMatch = langPropRegex.exec(bodyContent);
  }

  return { exists: true, errors };
}

function runValidation(): void {
  const docsRootPath = path.resolve(process.cwd(), 'src/content/docs');
  const orphanFiles = findOrphanFiles(docsRootPath, TARGET_CONCEPTS);
  const results: ValidationResult[] = [];

  let completedConceptsCount = 0;
  let totalFailuresCount = 0;

  for (const concept of TARGET_CONCEPTS) {
    const idPath = path.join(docsRootPath, 'id', concept.category, `${concept.slug}.mdx`);
    const enPath = path.join(docsRootPath, 'en', concept.category, `${concept.slug}.mdx`);

    const idCheck = validateMdxFile(idPath, 'id', concept);
    const enCheck = validateMdxFile(enPath, 'en', concept);

    let idStatus: 'PASS' | 'FAIL' | 'PENDING' = 'PENDING';
    let enStatus: 'PASS' | 'FAIL' | 'PENDING' = 'PENDING';

    if (idCheck.exists) {
      idStatus = idCheck.errors.length === 0 ? 'PASS' : 'FAIL';
    } else if (isStrictMode) {
      idStatus = 'FAIL';
      idCheck.errors.push('file id tidak ditemukan (diwajibkan pada mode --strict)');
    }

    if (enCheck.exists) {
      enStatus = enCheck.errors.length === 0 ? 'PASS' : 'FAIL';
    } else if (isStrictMode) {
      enStatus = 'FAIL';
      enCheck.errors.push('file en tidak ditemukan (diwajibkan pada mode --strict)');
    }

    if (idStatus === 'PASS' && enStatus === 'PASS') {
      completedConceptsCount += 1;
    }

    if (idStatus === 'FAIL' || enStatus === 'FAIL') {
      totalFailuresCount += 1;
    }

    results.push({
      conceptId: concept.id,
      slug: concept.slug,
      idStatus,
      enStatus,
      idErrors: idCheck.errors,
      enErrors: enCheck.errors,
    });
  }

  const idColWidth = 4;
  const slugColWidth = 36;
  const statusColWidth = 10;

  const headerLine = [
    'ID'.padEnd(idColWidth),
    'SLUG'.padEnd(slugColWidth),
    'ID DOCS'.padEnd(statusColWidth),
    'EN DOCS'.padEnd(statusColWidth),
  ].join(' | ');

  const separator = '-'.repeat(headerLine.length);

  console.log(`\n=== HASIL VALIDASI KONTEN DEPLAY (${isStrictMode ? 'STRICT' : 'DEFAULT'}) ===\n`);
  console.log(headerLine);
  console.log(separator);

  for (const res of results) {
    if (!isStrictMode && res.idStatus === 'PENDING' && res.enStatus === 'PENDING') {
      continue;
    }

    const row = [
      String(res.conceptId).padStart(2).padEnd(idColWidth),
      res.slug.padEnd(slugColWidth),
      res.idStatus.padEnd(statusColWidth),
      res.enStatus.padEnd(statusColWidth),
    ].join(' | ');

    console.log(row);
  }

  console.log(separator);

  const errorReports: Array<{ file: string; message: string }> = [];

  for (const res of results) {
    const concept = TARGET_CONCEPTS.find((c) => c.id === res.conceptId);
    if (!concept) continue;

    for (const err of res.idErrors) {
      errorReports.push({
        file: `src/content/docs/id/${concept.category}/${concept.slug}.mdx`,
        message: err,
      });
    }

    for (const err of res.enErrors) {
      errorReports.push({
        file: `src/content/docs/en/${concept.category}/${concept.slug}.mdx`,
        message: err,
      });
    }
  }

  for (const orphan of orphanFiles) {
    errorReports.push({
      file: `src/content/docs/${orphan}`,
      message: 'File MDX yatim (tidak terdaftar di registry 50 konsep)',
    });
  }

  if (errorReports.length > 0) {
    console.log(`\nDAFTAR PELANGGARAN (${errorReports.length}):`);
    for (const report of errorReports) {
      console.log(`  - [${report.file}] ${report.message}`);
    }
  }

  console.log(`\nRINGKASAN: ${completedConceptsCount}/${TARGET_TOTAL} selesai\n`);

  if (orphanFiles.length > 0 || totalFailuresCount > 0) {
    process.exit(1);
  }

  if (isStrictMode && completedConceptsCount < TARGET_TOTAL) {
    process.exit(1);
  }

  process.exit(0);
}

runValidation();
