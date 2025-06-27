import { BR_STATE_CODES } from './br-states.utils';

describe('BR_STATE_CODES', () => {
  it('should contain 27 state codes', () => {
    expect(BR_STATE_CODES).toHaveLength(27);
  });

  it('should contain all unique codes', () => {
    const unique = new Set(BR_STATE_CODES);
    expect(unique.size).toBe(BR_STATE_CODES.length);
  });

  it('should contain SP, RJ, MG, RS, BA, etc.', () => {
    expect(BR_STATE_CODES).toEqual(
      expect.arrayContaining(['SP', 'RJ', 'MG', 'RS', 'BA', 'SC', 'PR', 'GO', 'DF'])
    );
  });
}); 