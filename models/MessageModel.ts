export class MessageModel {
  title: string;
  content: string;
  buttonTitle: string;
  onPress: () => void;

  constructor(
    title: string,
    content: string,
    buttonTitle: string,
    onPress: () => void,
  ) {
    this.title = title;
    this.content = content;
    this.buttonTitle = buttonTitle;
    this.onPress = onPress;
  }
}

export interface MessageType {
  title: string;
  content: string;
  buttonTitle: string;
  onPress: () => void;
}
