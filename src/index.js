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
      inProgressBarcode: "",
      isInvalidBarcode: false,
    };
    this.barcodeInputRef = React.createRef("barcodeInput");
  }

  onBarcodeInput = (e) => {
    this.setState({ inProgressBarcode: e.target.value });
  };

  keydownHandler = (e) => {
    // auto focus barcode field on input
    this.barcodeInputRef.current.focus();

    // set new barcode and clear field on tab
    if (e.which === 9) {
      console.log("detected tab");
      this.setState({
        inProgressBarcode: "",
        barcode: this.state.inProgressBarcode,
        isInvalidBarcode: false,
      });
      e.preventDefault();
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
    let items,
      gtin,
      expiry,
      expiryStr,
      lot,
      isInvalidBarcode = false;
    if (this.state.barcode != null) {
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
        isInvalidBarcode = true;
      }
    }

    return (
      <div>
        <h1>Barcode</h1>
        {!isInvalidBarcode ? (
          <h2 id="valid-barcode">{this.state.barcode}</h2>
        ) : (
          <h2 id="invalid-barcode">Ungültiger Barcode!!!</h2>
        )}
        <input
          id="barcodeInput"
          autoFocus
          onChange={this.onBarcodeInput}
          ref={this.barcodeInputRef}
          value={this.state.inProgressBarcode}
        />
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
