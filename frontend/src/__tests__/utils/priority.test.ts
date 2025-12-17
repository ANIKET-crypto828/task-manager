import { getPriorityColor, getPriorityBadge } from '../../utils/priority';
import { Priority } from '../../types';

describe('Priority Utilities', () => {
  describe('getPriorityColor', () => {
    it('should return correct color for LOW priority', () => {
      const result = getPriorityColor(Priority.LOW);
      expect(result).toContain('gray');
    });

    it('should return correct color for URGENT priority', () => {
      const result = getPriorityColor(Priority.URGENT);
      expect(result).toContain('red');
    });

    it('should return different colors for different priorities', () => {
      const low = getPriorityColor(Priority.LOW);
      const high = getPriorityColor(Priority.HIGH);
      expect(low).not.toBe(high);
    });
  });

  describe('getPriorityBadge', () => {
    it('should return badge styles for all priorities', () => {
      Object.values(Priority).forEach(priority => {
        const result = getPriorityBadge(priority);
        expect(result).toContain('bg-');
        expect(result).toContain('text-');
      });
    });
  });
});
