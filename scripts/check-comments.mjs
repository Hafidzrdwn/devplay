import fs from 'node:fs';
import path from 'node:path';

function isAllowedComment(lineText) {
  return (
    lineText.includes('@ts-expect-error') ||
    lineText.includes('@vite-ignore') ||
    lineText.includes('/// <reference')
  );
}

function collectFiles(directoryPath, validExtensions) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }
  const directoryEntries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const collectedFilePaths = [];
  for (const entry of directoryEntries) {
    const fullEntryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      collectedFilePaths.push(...collectFiles(fullEntryPath, validExtensions));
    } else if (entry.isFile()) {
      const fileExtension = path.extname(entry.name);
      if (validExtensions.includes(fileExtension)) {
        collectedFilePaths.push(fullEntryPath);
      }
    }
  }
  return collectedFilePaths;
}

function scanFileForComments(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const fileLines = fileContent.split(/\r?\n/);
  const relativeFilePath = path.relative(process.cwd(), filePath).split(path.sep).join('/');
  const violations = [];
  const stateStack = [];
  let currentLineNumber = 1;
  let characterIndex = 0;

  while (characterIndex < fileContent.length) {
    const currentCharacter = fileContent[characterIndex];
    const nextCharacter = fileContent[characterIndex + 1];
    const currentState = stateStack.length > 0 ? stateStack[stateStack.length - 1] : null;

    if (currentState === 'SINGLE_QUOTE') {
      if (currentCharacter === '\\') {
        if (nextCharacter === '\n') {
          currentLineNumber += 1;
        }
        characterIndex += 2;
        continue;
      }
      if (currentCharacter === '\'') {
        stateStack.pop();
        characterIndex += 1;
        continue;
      }
      if (currentCharacter === '\n') {
        currentLineNumber += 1;
      }
      characterIndex += 1;
      continue;
    }

    if (currentState === 'DOUBLE_QUOTE') {
      if (currentCharacter === '\\') {
        if (nextCharacter === '\n') {
          currentLineNumber += 1;
        }
        characterIndex += 2;
        continue;
      }
      if (currentCharacter === '"') {
        stateStack.pop();
        characterIndex += 1;
        continue;
      }
      if (currentCharacter === '\n') {
        currentLineNumber += 1;
      }
      characterIndex += 1;
      continue;
    }

    if (currentState && currentState.type === 'TEMPLATE') {
      if (currentCharacter === '\\') {
        if (nextCharacter === '\n') {
          currentLineNumber += 1;
        }
        characterIndex += 2;
        continue;
      }
      if (currentCharacter === '`') {
        stateStack.pop();
        characterIndex += 1;
        continue;
      }
      if (currentCharacter === '$' && nextCharacter === '{') {
        stateStack.push({ type: 'INTERPOLATION', braceDepth: 1 });
        characterIndex += 2;
        continue;
      }
      if (currentCharacter === '\n') {
        currentLineNumber += 1;
      }
      characterIndex += 1;
      continue;
    }

    if (currentCharacter === '\'') {
      stateStack.push('SINGLE_QUOTE');
      characterIndex += 1;
      continue;
    }

    if (currentCharacter === '"') {
      stateStack.push('DOUBLE_QUOTE');
      characterIndex += 1;
      continue;
    }

    if (currentCharacter === '`') {
      stateStack.push({ type: 'TEMPLATE' });
      characterIndex += 1;
      continue;
    }

    if (currentState && currentState.type === 'INTERPOLATION') {
      if (currentCharacter === '{') {
        currentState.braceDepth += 1;
        characterIndex += 1;
        continue;
      }
      if (currentCharacter === '}') {
        currentState.braceDepth -= 1;
        if (currentState.braceDepth === 0) {
          stateStack.pop();
        }
        characterIndex += 1;
        continue;
      }
    }

    if (currentCharacter === '/' && nextCharacter === '/') {
      const isHttpUrl =
        (characterIndex >= 5 && fileContent.slice(characterIndex - 5, characterIndex) === 'http:') ||
        (characterIndex >= 6 && fileContent.slice(characterIndex - 6, characterIndex) === 'https:');
      if (isHttpUrl) {
        characterIndex += 2;
        continue;
      }
      const lineText = fileLines[currentLineNumber - 1] ?? '';
      if (!isAllowedComment(lineText)) {
        const violationKey = `${relativeFilePath}:${currentLineNumber}`;
        if (!violations.includes(violationKey)) {
          violations.push(violationKey);
        }
      }
      while (characterIndex < fileContent.length && fileContent[characterIndex] !== '\n') {
        characterIndex += 1;
      }
      if (characterIndex < fileContent.length && fileContent[characterIndex] === '\n') {
        currentLineNumber += 1;
        characterIndex += 1;
      }
      continue;
    }

    if (currentCharacter === '/' && nextCharacter === '*') {
      const lineText = fileLines[currentLineNumber - 1] ?? '';
      if (!isAllowedComment(lineText)) {
        const violationKey = `${relativeFilePath}:${currentLineNumber}`;
        if (!violations.includes(violationKey)) {
          violations.push(violationKey);
        }
      }
      characterIndex += 2;
      while (
        characterIndex < fileContent.length &&
        !(fileContent[characterIndex] === '*' && fileContent[characterIndex + 1] === '/')
      ) {
        if (fileContent[characterIndex] === '\n') {
          currentLineNumber += 1;
        }
        characterIndex += 1;
      }
      if (characterIndex < fileContent.length) {
        characterIndex += 2;
      }
      continue;
    }

    if (currentCharacter === '<' && fileContent.slice(characterIndex, characterIndex + 4) === '<!--') {
      const lineText = fileLines[currentLineNumber - 1] ?? '';
      if (!isAllowedComment(lineText)) {
        const violationKey = `${relativeFilePath}:${currentLineNumber}`;
        if (!violations.includes(violationKey)) {
          violations.push(violationKey);
        }
      }
      characterIndex += 4;
      while (
        characterIndex < fileContent.length &&
        !(
          fileContent[characterIndex] === '-' &&
          fileContent[characterIndex + 1] === '-' &&
          fileContent[characterIndex + 2] === '>'
        )
      ) {
        if (fileContent[characterIndex] === '\n') {
          currentLineNumber += 1;
        }
        characterIndex += 1;
      }
      if (characterIndex < fileContent.length) {
        characterIndex += 3;
      }
      continue;
    }

    if (currentCharacter === '\n') {
      currentLineNumber += 1;
    }
    characterIndex += 1;
  }

  return violations;
}

function runCommentCheck() {
  const sourceFiles = collectFiles(path.resolve('src'), ['.ts', '.tsx', '.astro']);
  const scriptFiles = collectFiles(path.resolve('scripts'), ['.ts', '.mjs']);
  const allTargetFiles = [...sourceFiles, ...scriptFiles];
  const allViolations = [];

  for (const filePath of allTargetFiles) {
    const fileViolations = scanFileForComments(filePath);
    allViolations.push(...fileViolations);
  }

  if (allViolations.length > 0) {
    for (const violation of allViolations) {
      console.error(violation);
    }
    console.error(`Ditemukan ${allViolations.length} pelanggaran komentar.`);
    process.exit(1);
  } else {
    console.log('Tidak ditemukan pelanggaran komentar.');
    process.exit(0);
  }
}

runCommentCheck();
