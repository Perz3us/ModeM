import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto, UpdateNoteDto } from './dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createNoteDto: CreateNoteDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { title, ...rest } = createNoteDto;
    return this.prisma.note.create({
      data: {
        ...rest,
        userId,
      },
      include: {
        subject: true,
      },
    });
  }

  async findAll(userId: number, search?: string) {
    return this.prisma.note.findMany({
      where: {
        userId,
        OR: search
          ? [
              // { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      include: {
        subject: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId },
      include: {
        subject: true,
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async update(id: number, userId: number, updateNoteDto: UpdateNoteDto) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return this.prisma.note.update({
      where: { id },
      data: updateNoteDto,
      include: {
        subject: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return this.prisma.note.delete({
      where: { id },
    });
  }
}
