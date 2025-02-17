export interface Issue {
  id: number;
  title: string;
  state: 'open' | 'closed';
  assignee: { login: string } | null;
  comments: number;
  created_at: string;
  user: { login: string };
}

export type IssueStatus = 'ToDo' | 'In Progress' | 'Done';

export interface KanbanColumnProps {
  column: IssueStatus;
  issues: Issue[];
  moveIssue: (
    draggedId: number,
    fromIndex: number,
    toIndex: number,
    fromColumn: IssueStatus,
    toColumn: IssueStatus
  ) => void;
}

export interface IssueCardProps {
  issue: Issue;
  index: number;
  column: IssueStatus;
  moveIssue: (
    draggedId: number,
    fromIndex: number,
    toIndex: number,
    fromColumn: IssueStatus,
    toColumn: IssueStatus
  ) => void;
}

export const ItemType = {
  ISSUE: 'issue',
};
