# MMM-OpenLiga

Simple module for [Magic Mirror](https://github.com/MichMich/MagicMirror) that displays sports results fetched from [OpenLigaDB](https://www.openligadb.de/).

This module is not affiliated with OpenLiga in any shape or form. It is still very much WIP.

![MMM-OpenLiga](/mmm-openliga.png)

## Installation

```
cd /home/pi/MagicMirror/modules
git clone https://github.com/lukaszett/MMM-OpenLiga
cd MMM-OpenLiga
npm install
```

Then add the module to your `config.js`.

## Config

| setting           | info                                                | default                     | 
| ----------------- | --------------------------------------------------- | ----------------------------| 
| apiEndpoint       | what URL should the module look at for the results  | current Bundeliga matchday  | 
| useShortTeamName  |                                                     | True                        | 
| showTeamIcons     |                                                     | not yet implemented         | 
| updateInterval    |                                                     | 1 hour                      | 
