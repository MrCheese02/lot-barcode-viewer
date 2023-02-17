import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import "./GS1DataElement.css";

class GS1DataElement extends React.Component {
  onCopy = (content) => {
    console.log('copying: "' + content + '"');
    if (this.props.onCopy != null) {
      this.props.onCopy(content);
    }
  };

  render() {
    if (this.props.content == null) {
      return null;
    }

    return (
      <CopyToClipboard
        text={
          this.props.copyContent ?? this.props.content
        }
        onCopy={this.onCopy}
        className="gs1-data-element"
      >
        <td align="center">{this.props.content}</td>
      </CopyToClipboard>
    );
  }
}

export { GS1DataElement };
