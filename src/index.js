import { createRoot } from "react-dom/client";
import React from "react";
import gs1 from "gs1-barcode-parser-mod2";
import { GS1DataElement } from "./components/GS1DataElement/GS1DataElement";
import "./index.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      barcode: "]C1010503238450574617230301103609085",
      inProgressBarcode: ""
    };
  }

  onInput = (e) => {
    this.setState({ barcode: e.target.value });
  };

  keydownHandler = (e) => {
    //e.preventDefault();
    // check if it was normal keyboard input (> 10 ms)
    const now = Date.now();
    if (
      this.state.lastCharReceived != null &&
      now - this.state.lastCharReceived > 50
    ) {
      console.log("was user input --> resetting!");
      this.setState({ inProgressBarcode: "", lastCharReceived: now });
    }
    this.setState({ lastCharReceived: now });

    // last char is a tab (9)
    console.log("CharCode: " + e.which);
    console.log("inProgressBarcode: " + this.state.inProgressBarcode);
    if (e.which === 9) {
      console.log("detected tab");
      this.setState({
        inProgressBarcode: "",
        barcode: this.state.inProgressBarcode
      });
      return;
    }

    const newChar = String.fromCharCode(e.which);
    console.log("Char: " + newChar);

    this.setState({
      inProgressBarcode: this.state.inProgressBarcode + newChar
    });
    // remove ctrl codes
    if (this.state.inProgressBarcode === "\x11\x12\x39\x10") {
      this.setState({
        inProgressBarcode: "]"
      });
    }
  };

  copyToClipboard = (content) => {
    console.log("copying: " + content);
    navigator.clipboard.writeText(content);
  };

  componentDidMount() {
    window.addEventListener("keydown", this.keydownHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.keydownHandler);
  }

  render() {
    let items, gtin, expiry, expiryStr, lot;
    try {
      items = gs1.parseBarcode(this.state.barcode).parsedCodeItems;
      console.log("barcode ais: " + items.map((i) => i.ai));
      gtin = items.find((i) => i.ai === "01").data;
      expiry = items.find((i) => i.ai === "17").data;
      expiryStr =
        ("0" + expiry.getDate()).slice(-2) +
        "." +
        ("0" + (expiry.getMonth() + 1)).slice(-2) +
        "." +
        expiry.getFullYear();
      lot = items.find((i) => i.ai === "10").data;
    } catch (e) {
      console.log("parseBarcode error for " + this.state.barcode + ": " + e);
    }

    return (
      <div>
        <h1>Barcode</h1>
        <h2>{this.state.barcode}</h2>
        <table className="dataTable" align="center">
          <thead>
            <tr>
              {lot != null ? <th>Lot/Charge</th> : null}
              {expiry != null ? <th>Ablaufdatum</th> : null}
              {gtin != null ? <th>GTIN</th> : null}
            </tr>
          </thead>
          <tbody>
            <tr>
              <GS1DataElement name="Lot/Charge" content={lot} />
              <GS1DataElement name="Ablaufdatum" content={expiryStr} />
              <GS1DataElement name="GTIN" content={gtin} />
            </tr>
          </tbody>
        </table>
        {lot != null ? (
          <div>
            <h2>Zertifikate:</h2>
            <ul>
              <li>
                <a
                  href={
                    "https://www.thermofisher.com/search/results?query=" +
                    lot +
                    "&persona=DocSupport&refinementAction=true&filter=document.result_type_s%3ACertificates"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Thermo Fisher
                </a>
              </li>
              <li>
                <a
                  href={
                    "https://resourcecenter.biomerieux.com/search/" +
                    lot +
                    "?searchMode=lotNumber"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Biomerieux
                </a>
              </li>
            </ul>
          </div>
        ) : null}
        <footer>Made by Zivi for Zivi :)</footer>
      </div>
    );
  }
}

const root = createRoot(document.getElementById("container"));
root.render(<App />);
