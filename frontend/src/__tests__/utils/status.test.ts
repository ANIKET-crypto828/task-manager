import { getStatusColor, getStatusLabel } from '../../utils/status';
import { Status } from '../../types';

describe('Status Utilities', () => {
  describe('getStatusColor', () => {
    it('should return correct color for each status', () => {
      expect(getStatusColor(Status.TODO)).toContain('gray');
      expect(getStatusColor(Status.IN_PROGRESS)).toContain('yellow');
      expect(getStatusColor(Status.REVIEW)).toContain('purple');
      expect(getStatusColor(Status.COMPLETED)).toContain('green');
    });
  });

  describe('getStatusLabel', () => {
    it('should return human-readable labels', () => {
      expect(getStatusLabel(Status.TODO)).toBe('To Do');
      expect(getStatusLabel(Status.IN_PROGRESS)).toBe('In Progress');
      expect(getStatusLabel(Status.REVIEW)).toBe('Review');
      expect(getStatusLabel(Status.COMPLETED)).toBe('Completed');
    });
  });
});
