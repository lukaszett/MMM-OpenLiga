var NodeHelper = require("node_helper");
var fetch = require("node-fetch");

var config;

module.exports = NodeHelper.create({

	cleanUpResults: function(data){
		let returnData = {
			matches:[]
		}
		let league = "";
		let stage = "";
		data.forEach(match => {
			league = match.LeagueName;
			stage = match.Group.GroupName;

			matchData = {
				name1: config.useShortTeamName ? match.Team1.ShortName : match.Team1.TeamName,
				name2: config.useShortTeamName ? match.Team2.ShortName : match.Team2.TeamName,
				datetime: new Date(Date.parse(match.MatchDateTime))
			}

			if(match.MatchResults.length){
				matchData.points1 = match.MatchResults[0].PointsTeam1;
				matchData.points2 = match.MatchResults[0].PointsTeam2;
			}

			returnData.matches.push(matchData);
		})

		returnData.league = league;
		returnData.stage = stage;
		return returnData;
	},

	getMatches: function(url){
		return res = fetch(url)
			.then(res => res.text())
			.then(data => {
			return JSON.parse(data);
			});
	},

	getAndSendData: async function(){
		var self = this;
		let data = await this.getMatches(config.apiEndpoint)
				.catch(x => {
					console.log("Couldn't get league data.");
					return
				})

		data = this.cleanUpResults(data)

		console.log("Sending data");
		self.sendSocketNotification('DATA_UPDATE', data);
		console.log("Done");
	},

	socketNotificationReceived: function(notification, payload) {
		if(notification=="SET_CONFIG"){
			config=payload;
		}

		if(notification=="GET_DATA"){
			this.getAndSendData();
		}
	},

});
