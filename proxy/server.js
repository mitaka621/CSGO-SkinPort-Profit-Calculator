const express = require("express");
const fs = require('fs');
const app = express();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors");

app.use(cors());

app.get("/", async (req, res) => {
  res.json("working");
});

app.get("/SkinportItems", async (req, res) => {
  
  const start = Date.now();
 
  let d = new Date();
  let time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  console.log(`${time}-> SkinportItems request started...`);

  if(!fs.existsSync("skinPortData.json")||start-fs.statSync('skinPortData.json').mtime>300000){
  const response = await fetch(
    "https://api.skinport.com/v1/items?app_id=730&tradable=0&currency=USD"
  );
  if (response.status >= 400) {
    throw new Error(
      `${time}-> Can't access skinport. Status code: ${response.status}`
    );
  }
  const j=await response.json()
  res.json(j);
  fs.writeFile('skinPortData.json', JSON.stringify(j), err => {
    if (err) {
      console.error(err);
    }
  });
}
else{
  let rawdata = fs.readFileSync('skinPortData.json');
  res.json(await JSON.parse(rawdata));
}
  d = new Date();
  time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  console.log(
    `${time}-> SkinportItems request completed! - ${Date.now() - start}ms`
  );
});
let json = [];
let counter = 0;
let percentage = 0;

app.get("/SteamItems", async (req, res) => {
  percentage = 0;
  counter = 0;
  const start = Date.now();
  let d = new Date();
  let time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  console.log(`${time}-> SteamItems request started...`);
  if(!fs.existsSync("steamData.json")||start-fs.statSync('steamData.json').mtime>3600000){
  let s = 1;
  let e = 50;
  for (let i = 0; i < 9; i++) {
    await Promise.all(setPromeses(s, e));
    s += 50;
    i === 7 ? (e += 32) : (e += 50);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  res.json(json);
  fs.writeFile('steamData.json', JSON.stringify(json), err => {
    if (err) {
      console.error(err);
    }
  });
  }
  else{
    let rawdata = fs.readFileSync('steamData.json');
    res.json(await JSON.parse(rawdata));
  }
  d = new Date();
  time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  counter>1?console.log(`\n${time}-> SteamItems request completed! - ${Date.now() - start}ms`):
  console.log(
    `${time}-> SteamItems request completed! - ${Date.now() - start}ms`
  );
});

function setPromeses(startIndex, endIndex) {
  let promiseArr = [];
  for (let i = startIndex; i <= endIndex; i++) {
    const prom = fetch(
      "https://steamfolio.com/api/Popular/sort?type=2&ascending=false&watchlist=false&searchTerm=&filterType=0&page=" +i
    ).catch((e)=>console.log(e))
      .then((response) => response.json())
      .then((result) => {
        json.push(...result.data.items);
        console.log;
        counter++;
        statusBar(counter);
      })
      ;
    promiseArr.push(prom);
  }
  return promiseArr;
}

function statusBar(progress) {
  process.stdout.write("\r");
  progress = Math.floor(progress / 20);
  percentage += 0.23;
  process.stdout.write(
    "Downloading/Updating Steam Database: [" +
      "=".repeat(progress) +
      "-".repeat(Math.floor(22 - progress)) +
      "]" +
      " " +
      percentage.toFixed(2) +
      "%" +
      "\r"
  );
}
/*
app.get("/SteamItems", async (req, res) => {
  const item = req.query.item;
  const currency = req.query.currency;
  const url = "https://steamcommunity.com/market/listings/730/" + item;
  const response = await fetch(url);
  if (response.status >= 400) {
    throw new Error(`Can't accses ${url}; Status code: ${response.status}`);
  }
  const html = await response.text();
  if (html.includes("There are no listings for this item.")) {
    throw new Error(`Invalid item: ${item}`);
  }

  const startIndex = html.indexOf("Market_LoadOrderSpread") + 24;
  let currentChar = "";
  let endIndex = startIndex;
  while (currentChar != " ") {
    currentChar = html[endIndex];
    endIndex++;
  }
  const item_nameid = Number(html.substring(startIndex, endIndex));
  console.log(`Got item id for ${url}: ${item_nameid}`);
  const url2 = `https://steamcommunity.com/market/itemordershistogram?language=english&item_nameid=${item_nameid}&currency=${currency}`;
  const response2 = await fetch(url2);
  res.json(item_nameid);
});
*/
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
