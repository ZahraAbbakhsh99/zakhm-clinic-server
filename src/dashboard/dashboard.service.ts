import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import moment from 'moment-jalaali';
import { NurseApplication } from '../nurse-application/entities/nurse-application.entity';
import { Article, ArticleStatus } from '../article/entities/article.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { Comment } from '../comment/entities/comment.entity';
import { JalaliDateUtil } from '../common/utils/jalali'; 

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(NurseApplication)
    private nurseAppRepo: Repository<NurseApplication>,
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
  ) {}

  async getNewNurseApplicationsCount(): Promise<number> {
    const now = new Date();
    const today = new Date();
    const jYear = moment(today).jYear();
    const jMonth = moment(today).jMonth();
    const firstDayOfMonthStr = `${jYear}/${jMonth + 1}/1`;
    const startOfMonth = JalaliDateUtil.convertJalaliToGregorian(firstDayOfMonthStr);
    if (!startOfMonth) return 0;
    return this.nurseAppRepo.count({
      where: {
        createdAt: Between(startOfMonth, now),
      },
    });
  }

  async getArticlesStats(): Promise<{ published: number; total: number }> {
    const total = await this.articleRepo.count();
    const published = await this.articleRepo.count({ where: { status: ArticleStatus.PUBLISHED } });
    return { published, total };
  }

  async getWeeklyAppointments(): Promise<{ dayName: string; count: number }[]> {
    const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
    const now = new Date();

    const gregorianDay = now.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    let persianWeekIndex: number;
    if (gregorianDay === 6) persianWeekIndex = 0; // Saturday -> 0 (شنبه)
    else persianWeekIndex = gregorianDay + 1; // Sunday->1, Monday->2, ..., Friday->6

    const startOfWeekDate = moment(now).subtract(persianWeekIndex, 'days').startOf('day').toDate();
    const endOfWeekDate = moment(startOfWeekDate).add(6, 'days').endOf('day').toDate();

    const appointments = await this.appointmentRepo
      .createQueryBuilder('a')
      .select('DATE(a.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('a.createdAt BETWEEN :start AND :end', { start: startOfWeekDate, end: endOfWeekDate })
      .groupBy('DATE(a.createdAt)')
      .getRawMany();

    const countMap = new Map<string, number>();
    for (const row of appointments) {
      const dateStr = moment(row.date).format('YYYY-MM-DD');
      countMap.set(dateStr, parseInt(row.count));
    }

    const result: { dayName: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = moment(startOfWeekDate).add(i, 'days');
      const dateKey = dayDate.format('YYYY-MM-DD');
      const count = countMap.get(dateKey) || 0;
      result.push({
        dayName: weekDays[i],
        count,
      });
    }
    return result;
  }

  async getLatestComments(limit: number = 3): Promise<any[]> {
    const comments = await this.commentRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return comments.map(comment => ({
      name: comment.name,
      comment: comment.comment,
      status: comment.isApproved ? 'approved' : 'pending',
      createdAt: comment.createdAt,
    }));
  }
}