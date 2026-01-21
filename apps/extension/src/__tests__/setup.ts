import { beforeEach, vi } from 'vitest';
import { testHelpers } from './mocks/browser';

// Clear mocks and storage before each test
// Note: We don't clear listeners here because modules register them once on import
beforeEach(() => {
  vi.clearAllMocks();
  testHelpers.clearStorage();
});
