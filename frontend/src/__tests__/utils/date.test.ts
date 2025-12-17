import { formatDate, formatDateTime, isOverdue, getDateInputValue } from '../../utils/date';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = '2024-03-15T10:30:00Z';
      const result = formatDate(date);
      expect(result).toBe('Mar 15, 2024');
    });

    it('should handle Date objects', () => {
      const date = new Date('2024-03-15');
      const result = formatDate(date);
      expect(result).toContain('Mar');
      expect(result).toContain('2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime with time', () => {
      const date = '2024-03-15T14:30:00Z';
      const result = formatDateTime(date);
      expect(result).toContain('Mar 15, 2024');
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('isOverdue', () => {
    it('should return true for past dates', () => {
      const pastDate = '2020-01-01T00:00:00Z';
      expect(isOverdue(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = '2099-12-31T23:59:59Z';
      expect(isOverdue(futureDate)).toBe(false);
    });

    it('should handle today correctly', () => {
      const today = new Date().toISOString();
      const result = isOverdue(today);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getDateInputValue', () => {
    it('should format for datetime-local input', () => {
      const date = '2024-03-15T14:30:00Z';
      const result = getDateInputValue(date);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });
  });
});
