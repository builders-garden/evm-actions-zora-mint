interface ActionInputFields {
  name: string;
  placeholder?: string; // Optional placeholder text for the input field
  required?: boolean; // Optional, defaults to false if not provided
}

enum ActionLinkType {
  TX = "tx",
  SIGNATURE = "signature",
  LINK = "link",
  ONE_CLICK_LOGIN = "one-click-login",
}

interface ActionLink {
  targetUrl: string; // URL that will be opened when the action is clicked
  postUrl?: string; // POST URL that will be called after the action has been executed
  loginUrl?: string; // GET URL that will be opened when the action is clicked with appropriate query parameters
  label: string; // Label for the action
  type: ActionLinkType; // Type of action
  inputFields?: ActionInputFields[]; // Action parameters
}

interface EVMAction {
  title: string; // Title of the EVM Action
  description: string; // Description of the EVM Action
  image: string; // EVM Action image URL
  links: ActionLink[]; // List of actions (buttons) that will be displayed to the user
  label: string; // EVM Action button label
}
