// ============================================
// 📦 TOEIC MASTER - DATE UTILS
// ============================================

const TIME_UNITS = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
};

type TimeUnit = keyof typeof TIME_UNITS;

/**
 * Formats a date into a relative time string (e.g., "2 hours ago", "a month ago").
 * @param dateString - The ISO 8601 date string to format.
 * @param now - The current date, for testing purposes.
 * @returns A human-readable relative time string.
 */
export function formatRelativeTime(dateString: string, now: Date = new Date()): string {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const elapsed = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

    if (elapsed < 5) return "vừa xong";

    for (const unit in TIME_UNITS) {
        const secondsPerUnit = TIME_UNITS[unit as TimeUnit];
        if (elapsed >= secondsPerUnit) {
            const value = Math.floor(elapsed / secondsPerUnit);
            
            // Simplified Vietnamese translation
            switch(unit) {
                case 'year': return `${value} năm trước`;
                case 'month': return `${value} tháng trước`;
                case 'week': return `${value} tuần trước`;
                case 'day': return `${value} ngày trước`;
                case 'hour': return `${value} giờ trước`;
                case 'minute': return `${value} phút trước`;
                default: return `${value} giây trước`;
            }
        }
    }
    
    return "vừa xong";
}
