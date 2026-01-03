
export enum Priority {
  LOW = 'Düşük',
  MEDIUM = 'Orta',
  HIGH = 'Yüksek'
}

export interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
  priority: Priority;
  dueDate: string;
  createdAt: number;
}

export type SortCriteria = 'date' | 'priority' | 'status' | 'text';
