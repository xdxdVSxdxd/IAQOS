# Interfaccia dialogica per IAQOS, con costruttore di script di interazione, multilingua

Questa interfaccia richiede degli elementi hardware:

* un telefono da tavolo che si possa smontare
* un Arduino UNO
* cavi audio ed elettrici
* adattatori jack piccoli e grandi


Inoltre, è necessario installare il software [node.js](https://nodejs.org/en/) e di eseguire lo script nella cartella _RunNodeJs_, che si occupa di passare al browser i dati che provengono dalla porta USB.

----

# Funzionanmento generale

il file __script.json__ descrive la struttura dell'interazione, e può essere completamente personalizzato.

Nel file, i messaggi tra  parentesi quadra fanno riferimento al file __phrases-it-IT.json__, che ne contiene le decodifiche.
Per esempio, se il file _script.json_ contenesse il messaggio _[ilSalutoDiIAQOS]_, il file _phrases-it-IT.json_ potrebbe contenere:

{
			"name": "[ilSalutoDiIAQOS]",
			"phrase": ["Ciao! Sono IAQOS!","Buongiorno! Come va?","Meno male che sei arrivato, mi stavo annoiando"]
}

il che vorrebbe dire che il messaggio sarebbe sostituito con una delle opzioni tra parentesi quadra e separati da virgole.

Se la lingua fosse differente, ad esempio  _en-US_ per l'inglese al posto di _it-IT_ per l'italiano, si potrebbe creare un altro file __phrases-us-US.json__, metterci dentro gli stessi  codici, ma con la loro  decodifica in inglese invece che in italiano, e avremmo uno IAQOS internazionalizzato (il software usa automaticamente tutte le lingue che trova).

Nello script si possono configurare diversi passi di interazione:

{
	"action": "speak",
	"what": "[Greeting]",
	"delay": 1
}


_IAQOS pronuncia il messaggio contenuto in "what", e poi aspetta il numero di secondi indicato in "delay"_


{
	"action": "capture",
	"waitfor": 5000,
	"delay": 1
}

_IAQOS cattura un audiomessaggio, aspettando massimo il numero di millesimi di secondo indicati da "waitfor" perché qualcuno inizi a parlare, e poi aspetta il numero di secondi indicato in "delay"_


{
	"action": "manageinput",
	"waitfor": 5000,
	"delay": 1
}

_IAQOS elabora tutto l'input ricevuto fino ad adesso, e poi aspetta il numero di secondi indicato in "delay"_

{
	"action": "storeknowledge",
	"waitfor": 5000,
	"delay": 1
}

_IAQOS memorizza tutto quello che ha imparato fino ad adesso col metodo "manageinput", e aggiorna la propria base di conoscenza, e poi aspetta il numero di secondi indicato in "delay"_


Alternando nello _script.json_ elementi di questo genere e separandoli da virgole, si possono costruire interazioni complesse.