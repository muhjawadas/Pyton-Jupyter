const fs = require("fs");
const fetch = require("node-fetch");
const sources = require("./Untitled spreadsheet.json");
const results = [];

let loop = 0;

function timeout() {
  setTimeout(function () {
    console.log("--loop", loop);

    if (loop + 1 === sources.length) {
      clearTimeout(timeout());
      fs.writeFileSync("results.json", JSON.stringify(results, false, 2));
    } else {
      fetch(`https://api.exchangeratesapi.io/${sources[loop].Date}?base=USD`)
        .then((res) => res.json())
        .then(({ rates }) => {
          let IDRPrice = 0;

          if (rates.IDR) {
            IDRPrice = rates.IDR * sources[loop].USDPrice;
          }

          console.log("--debug", {
            Date: sources[loop].Date,
            USDPrice: sources[loop].USDPrice,
            IDRPrice,
          });
          results.push({
            Date: sources[loop].Date,
            USDPrice: sources[loop].USDPrice,
            IDRPrice,
          });
          loop++;
          timeout();
        });
    }
  }, 500);
}

timeout();
