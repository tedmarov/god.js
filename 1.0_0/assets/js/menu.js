/**
 * Created with JetBrains WebStorm.
 * User: Will
 * Date: 3/1/13
 * Time: 10:43 AM
 * To change this template use File | Settings | File Templates.
 */

var religions = new Array();

if(typeof(localStorage['religions']) == "string") {
	religions = undefined;
	religions = new Array();
	religionsJSON = $.parseJSON(localStorage['religions']);
	$.each(religionsJSON, function (index, religion) {
		religions.push(objToReligion(religion));
	});

	religionsReady(religions);
}
else {
	fetchReligions(religionsReady);
}

function religionsReady (religion_list) {
	if(religion_list != undefined) {
		religions = religion_list;
	}

	$.each(religions, function(i, religion) { religion.listItem = ""; })
	localStorage['religion'] = JSON.stringify(religions);

	chrome.tabs.executeScript(null, { file: "/assets/js/jquery-1.9.1.js" });
	chrome.tabs.executeScript(null, { file: "/assets/js/jquery-ui.js" });

	chrome.tabs.executeScript(null, { file: "/assets/js/lib/rainbow-custom.min.js" });
	chrome.tabs.insertCSS(null, { file: "/assets/css/github.css" });

	chrome.tabs.insertCSS(null, { code: '$("body").append("<link href=\'http://fonts.googleapis.com/css?family=Goudy+Bookletter+1911\' rel=\'stylesheet\' type=\'text/css\'>")' });

	chrome.tabs.insertCSS(null,{ file: "/assets/css/common.css" });
	chrome.tabs.executeScript(null, { file: "/assets/js/common.js" });

	// chrome.tabs.executeScript(null, { code: '$("#divine-message-wrapper").fadeIn(500)' });

	$.each(religions, function(i, religion) { if(religion.active) { religion.load(); }})

	$.each(religions, function(index, religion) {
		religion.listItem = religion.renderListItem();

		religion.fetchScripture(function() {
			$(religion.listItem).find(".believe").on("click", function() {
				if(religion.active == false) {
					religion.load();
				}
				else {
					religion.unload();
				}
			});

			$(religion.listItem).find(".view-scripture").on("click", function() {
				chrome.tabs.executeScript(null, { code: '$("#divine-message-wrapper").fadeIn(500)' });

				chrome.tabs.executeScript(null, {
					code: '$("#divine-message").html(unescape("' +
						escape("<pre><code data-language='javascript'>" +
						religion.scripture.text + "</code></pre>") + '"))' });
			});

			$('#religions_list').append(religion.listItem);

		});
	});
}



