export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  assignedTo?: string;
  createdAt?: Date;
}