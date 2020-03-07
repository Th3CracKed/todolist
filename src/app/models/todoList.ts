import * as firebase from 'firebase/app';

export interface TodoList {    
  id?: string;
  title: string;
  userId: string;
  members?: Member | DeleteMember;
}

export interface Member { [userId: string]: CoreMember }
export interface DeleteMember { [userId: string]: firebase.firestore.FieldValue; }

export interface CoreMember {
  email: string;
  canEdit: boolean
}
