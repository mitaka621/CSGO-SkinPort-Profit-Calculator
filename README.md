<h1>What does this do?</h1>
<p>This app aims to get all of the items which are cheaper on SkinPort but more expensive on the Steam Marketplace. This way, if you buy one of these items and then sell them on Steam you will make a profit. This profit is calculated with the current prices of the items in USD. However there may be some inacuracies for some of the items.</p>
<h2>How does this work?</h2>
<p>This tool uses the SteamFolio API to gather the Steam Marketplace items and then the SkinPort API to get all of the sale offers for CSGO items in SkinPort. The prices fot the Steam items are updated every hour becouse of the request taking a long time to complete. These HTTP requests are done through a local proxy server which then sends the JSON files to the front end where they are displayed if matched to a criteria.</p>
<h2>Quick Demonstration</h2>
 
