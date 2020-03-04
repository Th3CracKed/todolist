export interface TodoList {    
  id?: string;
  title: string;
  userId: string;
  autorizedUsers?: AutorizedUser[];
}

export interface AutorizedUser {
  id?: string;
  email: string;
  canEdit: boolean;
}
