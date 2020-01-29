import { Item } from './item';

export interface List {    
  id?: string;
  items? : Array<Item>;  
  title: string;
}
