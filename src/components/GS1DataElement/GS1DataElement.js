import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import "./GS1DataElement.css";

class GS1DataElement extends React.Component {
  constructor() {
    super();
    this.state = {
      showCopyMessage: false,
    };
  }

  onCopy = (content) => {
    console.log('copying: "' + content + '"');
    if (this.props.onCopy != null) {
      this.props.onCopy(content);
    }

    // show copy message
    this.setState({ showCopyMessage: true });
    setTimeout(() => {
      this.setState({ showCopyMessage: false });
    }, 2000);
  };

  render() {
    if (this.props.content == null) {
      return null;
    }

    return (
      <CopyToClipboard
        text={this.props.copyContent ?? this.props.content}
        onCopy={this.onCopy}
        className="gs1-data-element"
      >
        <td align="center">
          <p>{this.props.content}</p>
          {this.state.showCopyMessage ? (
            <div className="copy-message show" id="copyMessage">
              Kopiert!
            </div>
          ) : null}
        </td>
      </CopyToClipboard>
    );
  }
}

export { GS1DataElement };
