function toggle() {
  let extra = document.querySelector("#extra");
  extra.style.display === "none" ? showMore() : showLess();

  function showMore() {
    extra.style.display = "block";
    document.querySelector(".head").innerHTML =
      '<p><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>Hide description of the tool<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg></p>';
  }
  function showLess() {
    extra.style.display = "none";
    document.querySelector(".head").innerHTML =
      '<p><svg xmlns="http://www.w3.org/2000/svg"height="1em"viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>Show description of the tool<svg xmlns="http://www.w3.org/2000/svg"height="1em"viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg></p>';
  }
}

async function search() {
  document.querySelector(".container>tbody").innerHTML = "";
  document.querySelector("table").style.display = "none";
  setBlur();
  document.querySelector(".lodaingText").style.display = "block";

  document.querySelector(".lodaingText .messege").textContent =
    "Loading Steam items. This may take a while...";
  const steamObj = await getSteamData(); //;(await fetch("/data.json")).json()
  document.querySelector(".lodaingText .messege").textContent =
    "Loading SkinPort items. ";
  const skinPortObj = await getSkinportData();

  let rowCount = document.querySelector("#rowCount").value;
  let maxPrice = document.querySelectorAll("#rowCount")[1].value;

  if (Number(maxPrice) === 0) {
    maxPrice = 999999;
  }

  let internalDB = [];
  let skipped = 0;

  console.log(skinPortObj);
  skinPortObj
    .filter((x) => {
      return (
        x.min_price !== null &&
        x.min_price > 0 &&
        x.min_price < maxPrice &&
        x.quantity > 0
      );
    })
    .forEach((skinPortItem) => {
      const curretnSteamItem = steamObj.find(
        (x) => x.marketHashName === skinPortItem.market_hash_name
      );
      internalDB.push(createNewObj(skinPortItem, curretnSteamItem));
    });
  internalDB = internalDB.filter((x) => {
    if (x !== undefined && x.salesWeek > 100) {
      return x;
    }
    return;
  });
  internalDB.sort((a, b) => b.earnings - a.earnings);
  console.log("Items skipped for some reason: " + skipped);
  document.querySelector("table").style.display = "table";

  document.querySelector(".lodaingText").style.display = "none";
  removeBlur();

  if (rowCount >= internalDB.length) {
    rowCount = internalDB.length;
  }
  for (let i = 0; i < rowCount; i++) {
    console.log(internalDB[i]);
    createHtmlRow(internalDB[i]);
  }
  document.querySelector("table").scrollIntoView({ behavior: "smooth" });

  function createNewObj(skinPortItem, curretnSteamItem) {
    if (curretnSteamItem) {
      return {
        img: curretnSteamItem.image,
        name: skinPortItem.market_hash_name,
        skinPortPrice: skinPortItem.min_price,
        skinPortLink: skinPortItem.item_page,
        steamLink:
          "https://steamcommunity.com/market/listings/730/" +
          encodeURI(skinPortItem.market_hash_name),
        steamPrice: curretnSteamItem.safePrice,
        salesWeek: curretnSteamItem.salesWeek,
        earnings:
          Number(curretnSteamItem.averagePriceWeek) -
          Number(skinPortItem.min_price),
      };
    } else {
      skipped++;
    }
  }
}
function createHtmlRow(item) {
  const tableRow = document.createElement("tr");

  let TD = createTD("img");
  const img = document.createElement("img");
  img.setAttribute("src", item.img);
  TD.appendChild(img);
  tableRow.appendChild(TD);

  TD = createTD("name");
  TD.appendChild(createP(item.name));
  tableRow.appendChild(TD);

  TD = createTD("profit");
  TD.appendChild(createP(item.earnings.toFixed(2)));
  tableRow.appendChild(TD);

  TD = createTD("price");
  TD.appendChild(createP(item.steamPrice.toFixed(2)));
  tableRow.appendChild(TD);

  TD = createTD("price");
  TD.appendChild(createP(item.skinPortPrice.toFixed(2)));
  tableRow.appendChild(TD);

  TD = createTD("link");
  let anchor = document.createElement("a");
  anchor.setAttribute("href", item.steamLink);
  anchor.setAttribute("target", "_blank");
  anchor.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg"height="5em"viewBox="0 0 496 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M496 256c0 137-111.2 248-248.4 248-113.8 0-209.6-76.3-239-180.4l95.2 39.3c6.4 32.1 34.9 56.4 68.9 56.4 39.2 0 71.9-32.4 70.2-73.5l84.5-60.2c52.1 1.3 95.8-40.9 95.8-93.5 0-51.6-42-93.5-93.7-93.5s-93.7 42-93.7 93.5v1.2L176.6 279c-15.5-.9-30.7 3.4-43.5 12.1L0 236.1C10.2 108.4 117.1 8 247.6 8 384.8 8 496 119 496 256zM155.7 384.3l-30.5-12.6a52.79 52.79 0 0 0 27.2 25.8c26.9 11.2 57.8-1.6 69-28.4 5.4-13 5.5-27.3.1-40.3-5.4-13-15.5-23.2-28.5-28.6-12.9-5.4-26.7-5.2-38.9-.6l31.5 13c19.8 8.2 29.2 30.9 20.9 50.7-8.3 19.9-31 29.2-50.8 21zm173.8-129.9c-34.4 0-62.4-28-62.4-62.3s28-62.3 62.4-62.3 62.4 28 62.4 62.3-27.9 62.3-62.4 62.3zm.1-15.6c25.9 0 46.9-21 46.9-46.8 0-25.9-21-46.8-46.9-46.8s-46.9 21-46.9 46.8c.1 25.8 21.1 46.8 46.9 46.8z"/></svg>';
  TD.appendChild(anchor);
  tableRow.appendChild(TD);

  TD = createTD("link");
  anchor = document.createElement("a");
  anchor.setAttribute("href", item.skinPortLink);
  anchor.setAttribute("target", "_blank");
  anchor.innerHTML =
    '<div><svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M99.1 105.4C79 114 68.2 127.2 65.2 144.8c-2.4 14.1-.7 23.2 2 29.4c2.8 6.3 7.9 12.4 16.7 18.6c19.2 13.4 48.3 22.1 84.9 32.5c1 .3 1.9 .6 2.9 .8c32.7 9.3 72 20.6 100.9 40.7c15.7 10.9 29.9 25.5 38.6 45.1c8.8 19.8 10.8 42 6.6 66.3c-7.3 42.5-35.3 71.7-71.8 87.3c-35.4 15.2-79.1 17.9-123.7 10.9l-.2 0 0 0c-24-3.9-62.7-17.1-87.6-25.6c-4.8-1.7-9.2-3.1-12.8-4.3C5.1 440.8-3.9 422.7 1.6 405.9s23.7-25.8 40.5-20.3c4.9 1.6 10.2 3.4 15.9 5.4c25.4 8.6 56.4 19.2 74.4 22.1c36.8 5.7 67.5 2.5 88.5-6.5c20.1-8.6 30.8-21.8 33.9-39.4c2.4-14.1 .7-23.2-2-29.4c-2.8-6.3-7.9-12.4-16.7-18.6c-19.2-13.4-48.3-22.1-84.9-32.5c-1-.3-1.9-.6-2.9-.8c-32.7-9.3-72-20.6-100.9-40.7c-15.7-10.9-29.9-25.5-38.6-45.1c-8.8-19.8-10.8-42-6.6-66.3l31.5 5.5L2.1 133.9C9.4 91.4 37.4 62.2 73.9 46.6c35.4-15.2 79.1-17.9 123.7-10.9c13 2 52.4 9.6 66.6 13.4c17.1 4.5 27.2 22.1 22.7 39.2s-22.1 27.2-39.2 22.7c-11.2-3-48.1-10.2-60.1-12l4.9-31.5-4.9 31.5c-36.9-5.8-67.5-2.5-88.6 6.5z"/></svg><svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M0 96C0 60.7 28.7 32 64 32h96c88.4 0 160 71.6 160 160s-71.6 160-160 160H64v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V320 96zM64 288h96c53 0 96-43 96-96s-43-96-96-96H64V288z"/></svg></div>';
  TD.appendChild(anchor);
  tableRow.appendChild(TD);

  document.querySelector(".container>tbody").appendChild(tableRow);
}
function createTD(attribute) {
  const td = document.createElement("td");
  td.setAttribute("class", attribute);
  return td;
}
function createP(textContent) {
  const p = document.createElement("p");
  p.textContent = textContent;
  return p;
}
async function getSteamData() {
  return await (await fetch("http://localhost:3000/SteamItems")).json();
}

async function getSkinportData() {
  return await (await fetch("http://localhost:3000/SkinportItems")).json();
}
async function setBlur() {
  for (let i = 0; i < 30; i++) {
    document.querySelector("main").style.filter = `blur(${i}px)`;
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
}

async function removeBlur() {
  for (let i = 30; i >= 0; i--) {
    document.querySelector("main").style.filter = `blur(${i}px)`;
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
}
function CheckInput() {
  const button = document.querySelector("button[type=button]");
  const textbox = document.querySelectorAll("input[type=text]");
  for (let i = 0; i < textbox.length; i++) {
    if (
      isNaN(textbox[i].value) ||
      textbox[i].value === "" ||
      textbox[i].value < 0
    ) {
      button.style.display = "none";
      break;
    } else {
      button.style.display = "block";
    }
  }
}
