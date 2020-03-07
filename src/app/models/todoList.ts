
export interface TodoList {    
  id?: string;
  title: string;
  userId: string;
  members?: Member;
}

export interface Member { [userId: string]: CoreMember }

export interface CoreMember {
  email: string;
  canEdit: boolean
}
