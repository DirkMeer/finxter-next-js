export interface ChatMessage {
  text: string;
  sender: string;
  timeSent: Date;
  isAnswer?: boolean;
  imgUrl?: string;
}