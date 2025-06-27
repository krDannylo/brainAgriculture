import logger from './logger.utils';

describe('logger', () => {
  it('should have info, error, warn, debug methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('should log info message without throwing', () => {
    expect(() => logger.info('Test info message')).not.toThrow();
  });

  it('should log error message without throwing', () => {
    expect(() => logger.error('Test error message')).not.toThrow();
  });
}); 