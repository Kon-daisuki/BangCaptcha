import { TracePoint } from './types';
import { v4 as uuidv4 } from 'uuid';
import { ALL_CHARACTERS } from './character/index';

export const challengeStore = new Map<string, number[]>();
export const imageTokenStore = new Map<string, string>();

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function createChallenge() {
  const challengeId = uuidv4();

  // 验证模式
  const mode = Math.random() > 0.5 ? 'BAND' : 'CHARACTER';

  let targetName = '';
  let correctImages: string[] = [];
  let distractorImages: string[] = [];

  if (mode === 'CHARACTER') {
    const targetChar = ALL_CHARACTERS[Math.floor(Math.random() * ALL_CHARACTERS.length)];
    targetName = targetChar.name;

    const maxCorrect = Math.min(targetChar.images.length, 5);
    const minCorrect = Math.min(3, maxCorrect);
    const correctCount = Math.floor(Math.random() * (maxCorrect - minCorrect + 1)) + minCorrect;

    correctImages = shuffleArray(targetChar.images).slice(0, correctCount);

    const otherChars = ALL_CHARACTERS.filter(c => c.id !== targetChar.id);
    const otherImagesPool = otherChars.flatMap(c => c.images);
    const distractorCount = 9 - correctCount;
    distractorImages = shuffleArray(otherImagesPool).slice(0, distractorCount);

  } else {
    const allBands = Array.from(new Set(ALL_CHARACTERS.map(c => c.band)));
    const targetBand = allBands[Math.floor(Math.random() * allBands.length)];
    targetName = `${targetBand} 的角色`;

    const bandChars = ALL_CHARACTERS.filter(c => c.band === targetBand);
    const bandImagesPool = bandChars.flatMap(c => c.images);

    const maxCorrect = Math.min(bandImagesPool.length, 6);
    const minCorrect = Math.min(3, maxCorrect);
    const correctCount = Math.floor(Math.random() * (maxCorrect - minCorrect + 1)) + minCorrect;

    correctImages = shuffleArray(bandImagesPool).slice(0, correctCount);

    const otherChars = ALL_CHARACTERS.filter(c => c.band !== targetBand);
    const otherImagesPool = otherChars.flatMap(c => c.images);
    const distractorCount = 9 - correctCount;
    distractorImages = shuffleArray(otherImagesPool).slice(0, distractorCount);
  }

  const combinedItems = [
    ...correctImages.map(url => ({ url, isCorrect: true })),
    ...distractorImages.map(url => ({ url, isCorrect: false }))
  ];

  const shuffledItems = shuffleArray(combinedItems);

  const finalImageTokens = shuffledItems.map(item => {
    const token = uuidv4();
    imageTokenStore.set(token, item.url);
    setTimeout(() => imageTokenStore.delete(token), 60 * 1000);
    return `/api/img/${token}`;
  });

  const correctIndexes = shuffledItems
    .map((item, index) => item.isCorrect ? index : -1)
    .filter(index => index !== -1);

  challengeStore.set(challengeId, correctIndexes);
  setTimeout(() => challengeStore.delete(challengeId), 60 * 1000);

  return {
    id: challengeId,
    targetName: targetName,
    images: finalImageTokens
  };
}

export function verifyChallenge(
  id: string,
  selectedIndexes: number[],
  traceData?: TracePoint[],
  startTime?: number
): { isValid: boolean; reason?: string; duration?: number } {

  const correctIndexes = challengeStore.get(id);

  if (!correctIndexes) {
    return { isValid: false, reason: 'Challenge expired' };
  }

  const now = Date.now();
  let duration = 0;

  if (startTime) {
    duration = now - startTime;
    if (duration < 500) {
      challengeStore.delete(id);
      return { isValid: false, reason: 'Too fast', duration };
    }
    if (duration > 60 * 1000) {
      challengeStore.delete(id);
      return { isValid: false, reason: 'Timeout', duration };
    }
  }

  if (selectedIndexes.length !== correctIndexes.length) {
    return { isValid: false, reason: 'Incorrect count', duration };
  }

  const sortedSelected = [...selectedIndexes].sort((a, b) => a - b);
  const sortedCorrect = [...correctIndexes].sort((a, b) => a - b);

  for (let i = 0; i < sortedSelected.length; i++) {
    if (sortedSelected[i] !== sortedCorrect[i]) {
      return { isValid: false, reason: 'Incorrect selection', duration };
    }
  }

  challengeStore.delete(id);
  return { isValid: true, duration };
}
