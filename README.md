<h1>What does this do?</h1>
<p>This app aims to get all of the items which are cheaper on SkinPort but more expensive on the Steam Marketplace. This way, if you buy one of these items and then sell them on Steam you will make a profit. This profit is calculated with the current prices of the items in USD. However there may be some inacuracies for some of the items.</p>
<h2>How does this work?</h2>
<p>This tool uses the SteamFolio API to gather the Steam Marketplace items and then the SkinPort API to get all of the sale offers for CSGO items in SkinPort. The prices fot the Steam items are updated every hour becouse of the request taking a long time to complete. These HTTP requests are done through a local proxy server which then sends the JSON files to the front end where they are displayed if matched to a criteria.</p>
<h2>Quick Demonstration</h2>
 
![](https://github.com/mitaka621/CSGO-SkinPort-Profit-Calculator/blob/main/screenshots/demo.gif)
<h2>Explanation</h2>
<p>In this demo first i set the number of rows and left the maximum price by defafult. After about 20 seconds the rows were generated and by defualt the items are sorted by the biggest profit.</p>
![](https://github.com/mitaka621/CSGO-SkinPort-Profit-Calculator/blob/main/screenshots/scrshot1.png?raw=true)
<p>The Steam price for the first item is 192.63 USD and the SkinPort equvalent is 150.68 USD. So theoretically if i bought the M4 from SkinPort and solid it on the Steam marketplace i would profit 40.57 USD. You can double check the prices by clicking the icons on the end of each row. (the steam price is taken from the cheapest sell order on the marketplace for that particular item so it can't be 100% accurate)</p>
