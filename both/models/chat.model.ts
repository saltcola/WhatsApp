import {Message} from "./message.model";
 
export interface Chat {
  _id?: string;
  title?: string;
  memberIds?: string[];
  picture?: string;
  lastMessage?: Message;
}