var app = angular.module('shuffling', ["xeditable", "ui.bootstrap"]);

app.run(function(editableOptions){
  	editableOptions.theme = 'bs3'; 
});

app.service('guestsService', function(){
	//localStorage.clear();
	this.guests = (function(){
		var guestList = []; 
		var index = localStorage.length;

		var pub = {};

		pub.prepopulateLocalStorage = function(){
			if (localStorage.length === 0) {
				var examples = [
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
				];
				localStorage.setItem(0, JSON.stringify(examples[0]));
				localStorage.setItem(1, JSON.stringify(examples[1]));
			} 
		};

		pub.save = function(guest){
			localStorage.setItem(index, JSON.stringify(guest));
			index = index + 1;
		};

		pub.updateLocalStorage = function(newGuestList) {
			localStorage.clear();
			for (var i in newGuestList) {
				localStorage.setItem(i, JSON.stringify(newGuestList[i]));
			}
			index = localStorage.length;
		};

		pub.loadGuestList = function(){
			for (var key in localStorage){
				var guest = localStorage.getItem(key);
				guest = angular.fromJson(guest);
				guestList.push(guest);
			}
		};

		pub.clearGuestList = function(){
			guestList = [];
		};

		pub.getGuestList = function(){
			return guestList;
		};

		pub.printLS = function(){
			for (var key in localStorage){
				console.log(key + " " + localStorage.getItem(key));
			}
		};

		return pub;
	})();
});

app.controller('FormController', ['guestsService', function(guestsService){
	var formCtrl = this;

	formCtrl.checked = "pickup";

	formCtrl.locationShowed = function(){
		return formCtrl.checked === "pickup";
	};

		formCtrl.guest = { 
		add: function(){
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
		}
	};
}]);

app.controller('TabController', ['guestsService', '$window', function(guestsService, $window){
	var tabCtrl = this;

	tabCtrl.guests = guestsService.guests.getGuestList();

	tabCtrl.fillExamples = function(){
		guestsService.guests.prepopulateLocalStorage();
	};
	
	tabCtrl.refreshGuestList = function() {
		tabCtrl.guests = guestsService.guests.getGuestList();
		tabCtrl.fillExamples();
	};

	tabCtrl.updateGuest = function() {
		guestsService.guests.updateLocalStorage(tabCtrl.guests);
	};

	tabCtrl.statuses = [
		{value: "arrived", text: "arrived"},
		{value: "pickup", text: "pickup"},
		{value: "dropoff", text: "dropoff"}
	];

	tabCtrl.removeGuest = function(index) {
		deleteGuest = $window.confirm('Are you sure you want to remove guest?');
    	if(deleteGuest){
     		tabCtrl.guests.splice(index, 1);
    		guestsService.guests.updateLocalStorage(tabCtrl.guests);
    	}
  	};

  	guestsService.guests.loadGuestList();
  	guestsService.guests.printLS();

}]);
