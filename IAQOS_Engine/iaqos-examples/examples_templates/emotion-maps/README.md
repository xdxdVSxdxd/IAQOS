Come creare una mappa emozionale in base alla conoscenza di IAQOS.

* il file __locations.json__ contiene una serie di elementi che corrispondono alle location di cui vogliamo raccogliere le espressioni emozionali; per ogni elemento c'è una label, delle coordinate geografiche, e i concetti che si devono consultare su IAQOS (esempio: Parco Sangalli, su IAQOS, corrisponde al concetto di Sangalli; non si mette "parco" perché potrebbe corrispondere ad altre cose, al massimo "Parco Sangalli")
* il file __index.js__ contiene il software per
	* prendere i dati da IAQOS e da HER
	* mostrarli sulla mappa