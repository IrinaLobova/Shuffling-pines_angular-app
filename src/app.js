var app = angular.module('shuffling', ["xeditable"]);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

app.service('GuestsService', function(){
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
			console.log(newGuestList);
			localStorage.clear();
			for (var i in newGuestList) {
				localStorage.setItem(i, JSON.stringify(newGuestList[i]));
			}
			index = localStorage.length;
		}

		pub.loadGuestList = function(){
			for (var key in localStorage){
				var guest = localStorage.getItem(key);
				guest = JSON.parse(guest);
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
 		console.log(index);

		return pub;
	})();

});

app.controller('FormController', ['GuestsService', function(guestsService){
	var formCtrl = this;
	formCtrl.title = "FormController";

	formCtrl.checked = "pickup";
	formCtrl.guest = {
		submit: function() {
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
			formCtrl.guests = guestsService.guests.getGuestList();

			guestsService.guests.printLS();
		}
	}
	formCtrl.guests = guestsService.guests.getGuestList();
	formCtrl.updateGuest = function() {
		console.log(formCtrl.guests);
		guestsService.guests.updateLocalStorage(formCtrl.guests);
		guestsService.guests.printLS();
	}
}]);






app.controller('TabController', ['GuestsService', function(guestsService){
	var tabsCtrl = this;
	
	/*
	tabsCtrl.printList = function(){
		guestsService.guests.fillGuestList();
		formCtrl.guests = guestsService.guests.getGuests();
	}
	*/
	//tabsCtrl.deleteList = function(){
	//	guestsService.guests.clear();
	//}
	
	tabsCtrl.updateName = function(){
		tabsCtrl.guests = guestsService.guests.getGuests();
		console.log(tabsCtrl.guests);
		guestsService.guests.printLS();
	}
}]);
