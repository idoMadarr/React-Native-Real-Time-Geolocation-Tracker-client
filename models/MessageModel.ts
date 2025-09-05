export interface MessageType {
  title: string | null;
  content: string | null;
  buttonTitle: string | null;
  onPress?: () => void;
  closeBottomSheet?: () => void;
}

export class MessageBuilder {
  title: string | null;
  content: string | null;
  buttonTitle: string | null;
  onPress?: () => void;

  constructor(onPress?: () => void) {
    this.title = null;
    this.content = null;
    this.buttonTitle = null;
    this.onPress = onPress;
  }

  setMessage(title: string) {
    this.title = title;
    return this;
  }

  setContent(content: string) {
    this.content = content;
    return this;
  }

  setButtonTitle(buttonTitle: string) {
    this.buttonTitle = buttonTitle;
    return this;
  }

  build() {
    return new MessageModel(this);
  }
}

class MessageModel {
  title: string | null;
  content: string | null;
  buttonTitle: string | null;
  onPress?: () => void;

  constructor(builder: MessageType) {
    this.title = builder.title;
    this.content = builder.content;
    this.buttonTitle = builder.buttonTitle;
    this.onPress = builder.onPress;
  }
}
