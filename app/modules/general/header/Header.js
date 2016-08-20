import Marionette 	from 'backbone.marionette';
import Radio 		from 'backbone.radio';
import Backbone 	from 'backbone';

import headerTemplate from './template/header';
class HeaderView extends Marionette.ItemView {
	get template() {
		return headerTemplate;
	}
	events() {
		return {
			"click #logout": "logout",
			"click #delete": "remove"
		}
	}
	modelEvents() {
		return {
			"change" : "render"
		}
	}
	get behaviors() {
		return {
			Navigation: {}
		}
	}
	logout() {
		Radio.channel("auth").request("service:cancel");
	}
	remove() {
		Radio.channel("auth").request("service:remove");
	}
}

Radio.channel('general').reply("header", (region) => {
	let clock = Radio.channel("clock").request("entities:current");
	region.show(new HeaderView({
		model: clock
	}));
})