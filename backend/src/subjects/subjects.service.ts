import { UpdateSubjectDto } from './dto/update-subjects.dto';
import { CreateSubjectDto } from './dto/create-subjects.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createSubjectDto: CreateSubjectDto, userId: number) {
    if (createSubjectDto.parentId) {
      const parentSubject = await this.prisma.subject.findUnique({
        where: {
          id: createSubjectDto.parentId,
          userId: userId,
        },
      });

      if (!parentSubject) {
        throw new ForbiddenException(
          'Parent subject not found or access denied',
        );
      }
    }

    const newSubject = await this.prisma.subject.create({
      data: {
        ...createSubjectDto,
        userId,
        isArchived: false,
      },
    });

    const [subjectWithIncludes, subjectWithCounts] = await Promise.all([
      this.prisma.subject.findUnique({
        where: { id: newSubject.id },
        include: {
          children: true,
          parent: { select: { id: true, name: true } },
        },
      }),

      this.prisma.subject.findUnique({
        where: { id: newSubject.id },
        select: {
          _count: {
            select: {
              tasks: { where: { isCompleted: false } },
              notes: true,
              studySessions: true,
            },
          },
        },
      }),
    ]);

    if (!subjectWithCounts) {
      return {
        ...subjectWithIncludes,
      };
    }
    return {
      ...subjectWithIncludes,
      _count: subjectWithCounts._count,
    };
  }

  async findAll(userId: number, includeArchived = false) {
    const subjects = await this.prisma.subject.findMany({
      where: {
        userId,
        isArchived: includeArchived ? undefined : false,
      },
      include: {
        children: {
          where: {
            isArchived: false,
          },
        },
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            isCompleted: true,
          },
        },
        _count: {
          select: {
            notes: true,
            studySessions: true,
          },
        },
      },
      orderBy: { name: 'desc' },
    });

    return subjects.map((subject) => {
      const totalTasks = subject.tasks.length;
      const completedTasks = subject.tasks.filter((t) => t.isCompleted).length;
      const progress =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const nextTask = subject.tasks
        .filter(
          (t) =>
            !t.isCompleted && t.dueDate && new Date(t.dueDate) >= new Date(),
        )
        .sort(
          (a, b) => {
            if (!a.dueDate || !b.dueDate) return 0;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
        )[0];

      // Format date as "Dec 15"
      const nextExam = nextTask && nextTask.dueDate
        ? new Date(nextTask.dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : 'No upcoming tasks';

      return {
        ...subject,
        progress,
        nextExam,
      };
    });
  }

  async findOne(id: number, userId: number) {
    const subject = await this.prisma.subject.findFirst({
      where: { id, userId },
      include: {
        children: {
          where: { isArchived: false },
        },
        parent: { select: { id: true, name: true } },
        tasks: {
          where: { isCompleted: false },
          orderBy: { dueDate: 'asc' },
          take: 10,
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            tasks: true,
            notes: true,
            studySessions: true,
          },
        },
      },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }
    return subject;
  }

  async update(id: number, UpdateSubjectDto: UpdateSubjectDto, userId: number) {
    const subject = await this.prisma.subject.findUnique({
      where: { id, userId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return this.prisma.subject.update({
      where: { id },
      data: UpdateSubjectDto,
      include: {
        children: true,
        parent: { select: { id: true, name: true } },
      },
    });
  }

  async archive(id: number, userId: number) {
    const subject = await this.prisma.subject.findUnique({
      where: { id, userId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return this.prisma.subject.update({
      where: { id },
      data: { isArchived: true },
    });
  }

  async remove(id: number, userId: number, deleteAll: Boolean) {
    const subject = await this.prisma.subject.findFirst({
      where: { id, userId },
    });

    if (!subject) {
      throw new ForbiddenException('Subject not found or access denied');
    }

    if (deleteAll) {
      return this.prisma.subject.delete({
        where: { id },
      });
    }

    const childrenCount = await this.prisma.subject.count({
      where: { parentId: id },
    });

    if (childrenCount > 0) {
      throw new ForbiddenException(
        'Cannot delete subject with child subjects. Archive instead.',
      );
    }
    return this.prisma.subject.delete({
      where: { id },
    });
  }
}
