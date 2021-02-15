Module.register("MMM-OpenLiga",{
	// Default module config.
	defaults: {
		// default: currenct Bundesliga matchday
		apiEndpoint: "https://www.openligadb.de/api/getmatchdata/bl1",
		useShortTeamName: true,
		showTeamIcons: false,
		// default: 1 hour
		updateInterval: 30 * 60 * 1000,
	},

	matchData: null, 
	league: null,

	createMatchRow: function(match){
		row = document.createElement("tr");

		team1Name = document.createElement("td");
		team1Name.innerHTML = match.name1;
		row.appendChild(team1Name);
		team1Score = document.createElement("td");
		team1Score.innerHTML = (match.hasOwnProperty("points1") ) ? match.points1 : "";
		team1Name.className = "teamName team1";
		
		row.appendChild(team1Score);

		divider = document.createElement("td");
		divider.innerHTML = ":";
		row.appendChild(divider);

		team2Score = document.createElement("td");
		team2Score.innerHTML = (match.hasOwnProperty("points2")) ? match.points2 : ""
		row.appendChild(team2Score);

		team2Name = document.createElement("td");
		team2Name.innerHTML = match.name2;
		team2Name.className = "teamName team2";
		row.appendChild(team2Name);

		if(this.config.showTeamIcons){
			// TODO: show Icons
		}
		return row;
	},

	createMatchView: function(matchData){
		let tableWrapper = document.createElement("table");
		
		let stageWrapper = document.createElement("tr")
		let stage = document.createElement("th");
		stage.innerHTML = matchData.stage;
		stage.className = "stage";
		stageWrapper.appendChild(stage)
		tableWrapper.appendChild(stageWrapper);

		let dates = matchData.matches.map(match => match.datetime);
		// drop duplicates
		dates = [...new Set(dates)];
		dates.sort();

		let groupedMatches = []
		dates.forEach(d => {
			let matchesOnDate = matchData.matches.filter(x => (x.datetime == d));
			groupedMatches.push({
				datetime: d,
				matches: matchesOnDate
			})
		});
		
		groupedMatches.forEach(d => {
			// print date
			
			let weekdays = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
			let months = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September',    
                'Oktober','November','Dezember'];


			let dateRow = document.createElement("tr");
			let date = document.createElement("td");
			date.setAttribute("colspan", "100%");
			date.className = "date";
			let dateObj = new Date(Date.parse(d.datetime));
			let dateStr = `${weekdays[dateObj.getDay()]}, ${dateObj.getDate()}. ${months[dateObj.getMonth()]} ${dateObj.getFullYear()} (${dateObj.getHours()}:${String(dateObj.getMinutes()).padStart(2, "0")})`;
			date.innerHTML = dateStr;
			dateRow.appendChild(date);
			tableWrapper.appendChild(dateRow);
			d.matches.forEach( match => tableWrapper.appendChild(this.createMatchRow(match)) );
		})

		//matchData.matches.forEach( match => tableWrapper.appendChild(this.createMatchRow(match)) );

		return tableWrapper;
	},

	// Override dom generator.
	getDom: function() {
		Log.log(this.league);
		Log.log(this.stage);
		var wrapper = document.createElement("div");
		wrapper.className = "MMM-OpenLiga";

		var header = document.createElement("header");
		header.innerHTML = (this.league != null) ? this.league : "Loading League...";
		wrapper.appendChild(header);
		if(this.matchData != null){
			matchDataDom = this.createMatchView(this.matchData);
			wrapper.appendChild(matchDataDom);
		}
		
		return wrapper;
	},

	getStyles: function() {
		return [
			"MMM-OpenLiga.css"
		]
	},

	socketNotificationReceived: function(notification, payload){
		self = this;
		if(notification  === 'DATA_UPDATE'){
			if(payload != this.matchData){
				self.league = payload.league;
				self.stage = payload.stage;
				self.matchData = payload;
				self.updateDom();
			}
		}
	},
	
	getData: function(){
		this.sendSocketNotification('GET_DATA', {});
	},

	start: function(){
		this.sendSocketNotification('SET_CONFIG', this.config);
		this.getData();
		setInterval(()=>{this.getData()}, this.config.updateInterval);
	},

});
