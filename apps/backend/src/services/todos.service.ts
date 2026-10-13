import { prisma } from '../lib/prisma.js';
import { getTodayFormatted } from '../utils/dateHelper.js';
import type { TodoItem as PrismaTodoItem } from '@prisma/client';

export interface FormattedTodo {
  id: string;
  title: string;
  type: 'habit' | 'one_off';
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface TodoResponseState {
  items: FormattedTodo[];
  lastActiveDate: string;
}

function formatTodo(todo: PrismaTodoItem): FormattedTodo {
  return {
    id: todo.id,
    title: todo.title,
    type: (todo.type === 'habit' ? 'habit' : 'one_off') as 'habit' | 'one_off',
    completed: todo.completed,
    createdAt: todo.createdAt.toISOString(),
    completedAt: todo.completedAt ? todo.completedAt.toISOString() : undefined,
  };
}

export class TodosService {
  /**
   * Lấy danh sách Todo của user và tự động kích hoạt Backend Daily Reset Engine nếu sang ngày mới
   */
  static async getTodos(userId: string, clientDate?: string): Promise<TodoResponseState> {
    const today = getTodayFormatted(clientDate);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastActiveDate: true },
    });

    const lastActive = user?.lastActiveDate;

    // Kích hoạt Reset ngày mới khi lastActiveDate khác ngày hôm nay
    if (lastActive && lastActive !== today) {
      await prisma.$transaction(async (tx) => {
        // 1. Dọn dẹp các task phát sinh (one_off) đã hoàn thành
        await tx.todoItem.deleteMany({
          where: {
            userId,
            type: 'one_off',
            completed: true,
          },
        });

        // 2. Bỏ tích (uncheck) toàn bộ thói quen hàng ngày (habits)
        await tx.todoItem.updateMany({
          where: {
            userId,
            type: 'habit',
          },
          data: {
            completed: false,
            completedAt: null,
          },
        });

        // 3. Cập nhật ngày kích hoạt gần nhất thành ngày hôm nay
        await tx.user.update({
          where: { id: userId },
          data: { lastActiveDate: today },
        });
      });
    } else if (!lastActive) {
      // Khởi tạo ngày kích hoạt đầu tiên cho user
      await prisma.user.update({
        where: { id: userId },
        data: { lastActiveDate: today },
      });
    }

    const items = await prisma.todoItem.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'asc' }],
    });

    return {
      items: items.map(formatTodo),
      lastActiveDate: today,
    };
  }

  /**
   * Thêm mới một task hoặc habit
   */
  static async createTodo(
    userId: string,
    data: { title: string; type?: 'habit' | 'one_off' }
  ): Promise<FormattedTodo> {
    const title = data.title?.trim();
    const type = data.type === 'habit' ? 'habit' : 'one_off';

    if (!title) {
      throw new Error('Tiêu đề công việc không được để trống.');
    }

    const newTodo = await prisma.todoItem.create({
      data: {
        userId,
        title,
        type,
        completed: false,
      },
    });

    return formatTodo(newTodo);
  }

  /**
   * Cập nhật trạng thái hoàn thành hoặc sửa tiêu đề công việc
   */
  static async updateTodo(
    userId: string,
    todoId: string,
    data: { title?: string; completed?: boolean }
  ): Promise<FormattedTodo> {
    const todo = await prisma.todoItem.findFirst({
      where: { id: todoId, userId },
    });

    if (!todo) {
      throw new Error('Công việc không tồn tại hoặc bạn không có quyền cập nhật.');
    }

    const updatePayload: {
      title?: string;
      completed?: boolean;
      completedAt?: Date | null;
    } = {};

    if (data.title !== undefined) {
      const trimmedTitle = data.title.trim();
      if (!trimmedTitle) {
        throw new Error('Tiêu đề công việc không được để trống.');
      }
      updatePayload.title = trimmedTitle;
    }

    if (data.completed !== undefined) {
      updatePayload.completed = data.completed;
      updatePayload.completedAt = data.completed ? new Date() : null;
    }

    const updated = await prisma.todoItem.update({
      where: { id: todoId },
      data: updatePayload,
    });

    return formatTodo(updated);
  }

  /**
   * Xóa một công việc theo ID
   */
  static async deleteTodo(userId: string, todoId: string): Promise<void> {
    const todo = await prisma.todoItem.findFirst({
      where: { id: todoId, userId },
    });

    if (!todo) {
      throw new Error('Công việc không tồn tại hoặc bạn không có quyền xóa.');
    }

    await prisma.todoItem.delete({
      where: { id: todoId },
    });
  }
}
