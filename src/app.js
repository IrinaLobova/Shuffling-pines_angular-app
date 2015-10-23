var app = angular.module('shuffling', ["xeditable", "ui.bootstrap"]);

app.run(function(editableOptions) {
  	editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

app.service('GuestsService', function(){
	//localStorage.clear();
	this.guests = (function(){
		var guestList = []; 
		var index = localStorage.length;

		if (localStorage.length === 0) {
			guestList = [
				{
					gname: "John Harvard",
					date: "01.01.1636",
					transit: "pickup",
					location: "Harvard Campus"
				},
				{
					gname: "Bilbo Baggins",
					date: "09.22.2890",
					transit: "pickup",
					location: "Shire, Middle-Earth"
				}
			]
		} 

		var pub = {};

		pub.save = function(guest){
			localStorage.setItem(index, JSON.stringify(guest));
			index = index + 1;
		}

		pub.updateLocalStorage = function(newGuestList) {
			//console.log(newGuestList);
			localStorage.clear();
			for (var i in newGuestList) {
				localStorage.setItem(i, JSON.stringify(newGuestList[i]));
			}
			index = localStorage.length;
		}

		pub.loadGuestList = function(){
			for (var key in localStorage){
				var guest = localStorage.getItem(key);
				//console.log(typeof guest);
				guest = jQuery.parseJSON(guest);
				//guest = angular.fromJson(guest);
				//console.log(typeof guest);
				guestList.push(guest);
			}
		}

		pub.clearGuestList = function(){
			guestList = [];
		}

		pub.getGuestList = function(){
			return guestList;
		}

		pub.printLS = function(){
			for(var key in localStorage){
				console.log(key + " " + localStorage.getItem(key));
			}
		}

		pub.loadGuestList();
 		//console.log(index);

		return pub;
	})();

});

app.controller('FormController', ['GuestsService', '$scope', function(guestsService, $scope){
	var formCtrl = this;

	formCtrl.checked = "pickup";

	formCtrl.locationShowed = function(){
		return formCtrl.checked === "pickup";
	}

	formCtrl.guest = {
		add: function() {
			var guest = {};
			guest.gname = formCtrl.gname;
			guest.date = formCtrl.date;
			guest.transit = formCtrl.checked;
			if (formCtrl.checked == "pickup") {
				guest.location = formCtrl.location;
			} else {
				guest.location = "-";
			}
			guestsService.guests.save(guest);

			guestsService.guests.clearGuestList();
			guestsService.guests.loadGuestList();
			//formCtrl.guests = guestsService.guests.getGuestList();
		}
	}
	guestsService.guests.printLS();

}]);

app.controller('TabController', ['GuestsService', '$scope', function(guestsService, $scope){
	var tabCtrl = this;

	//tabCtrl.guests = guestsService.guests.getGuestList();
	
	tabCtrl.refreshGuestList = function() {
		tabCtrl.guests = guestsService.guests.getGuestList();
	};

	tabCtrl.updateGuest = function() {
		//console.log(formCtrl.guests);
		guestsService.guests.updateLocalStorage(tabCtrl.guests);
		//guestsService.guests.printLS();
	};

	tabCtrl.statuses = [
		{value: "arrived", text: "arrived"},
		{value: "pickup", text: "pickup"},
		{value: "dropoff", text: "dropoff"}
	];

	tabCtrl.removeGuest = function(index) {
		console.log('h');
    	tabCtrl.guests.splice(index, 1);
    	guestsService.guests.updateLocalStorage(tabCtrl.guests);
    	//guestsService.guests.printLS();
  	};

}]);
