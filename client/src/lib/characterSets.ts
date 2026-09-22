export const CHARACTER_SETS = {
  classic: '@%#*+=-:. ',
  dense: '@#S%?*+;:,',
  minimal: '#*:. ',
  blocks: '█▓▒░ ',
  dots: '●•·  ',
  binary: '█ ',
} as const;

export type CharacterSetKey = keyof typeof CHARACTER_SETS | 'custom';

export const CHARACTER_SET_LABELS: Record<CharacterSetKey, string> = {
  classic: 'Classic',
  dense: 'Dense',
  minimal: 'Minimal',
  blocks: 'Blocks',
  dots: 'Dots',
  binary: 'Binary',
  custom: 'Custom',
};

export function resolveCharacterSet(key: CharacterSetKey, custom: string) {
  if (key === 'custom') {
    return Array.from(custom || CHARACTER_SETS.classic).join('') || CHARACTER_SETS.classic;
  }
  return CHARACTER_SETS[key];
}
