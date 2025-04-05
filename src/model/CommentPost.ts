export interface CommentType {
    description: string;
    id: number;
    children?: CommentType[];
  }
  