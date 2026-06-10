import moment from 'moment-jalaali';

export class JalaliDateUtil {
private static persianMonths: string[] = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  static toJalali(
    date: Date | string,
    format: 'jYYYY/jMM/jDD' | 'jYYYY-jMM-jDD' | 'jDD jMMMM jYYYY' | 'jDD MMM jYYYY' | 'full' = 'jYYYY/jMM/jDD'
  ): string {
    const m = moment(typeof date === 'string' ? new Date(date) : date);
    if (!m.isValid()) return 'تاریخ نامعتبر';

    switch (format) {
      case 'jYYYY/jMM/jDD':
        return m.format('jYYYY/jMM/jDD');
      case 'jYYYY-jMM-jDD':
        return m.format('jYYYY-jMM-jDD');
      case 'jDD jMMMM jYYYY': {
        const day = m.jDate();
        const month = JalaliDateUtil.persianMonths[m.jMonth()]; // 0-11
        const year = m.jYear();
        return `${day} ${month} ${year}`;
      }
      case 'jDD MMM jYYYY': {
        const day = m.jDate();
        const month = JalaliDateUtil.persianMonths[m.jMonth()]; // یا اگر مخفف می‌خواهید همین آرایه مناسب است
        const year = m.jYear();
        return `${day} ${month} ${year}`; // می‌توانید مخفف کنید اگر لازم است
      }
      case 'full':
        return `${m.format('jYYYY/jMM/jDD')} ${m.format('HH:mm')}`;
      default:
        return m.format('jYYYY/jMM/jDD');
    }
  }

  static toJalaliDateTime(date: Date | string): string {
    const m = moment(typeof date === 'string' ? new Date(date) : date);
    return m.format('jYYYY/jMM/jDD HH:mm');
  }

  static toTime(date: Date | string): string {
    const m = moment(typeof date === 'string' ? new Date(date) : date);
    return m.format('HH:mm');
  }

  static getTodayGregorian(): Date {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }

  static getStartOfMonthGregorian(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  }

  static getEndOfMonthGregorian(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  static getStartOfDayGregorian(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  static getEndOfDayGregorian(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }
}