import Marionette 	from 'backbone.marionette';
import Radio 		from 'backbone.radio';
import Backbone 	from 'backbone';

import marketingTemplate from './template/marketing'
class MarketingView extends Marionette.ItemView {
    get template() {
        return marketingTemplate;
    }
    get behaviors() {
        return {
            Navigation: {}
        }
    }
}
Radio.channel('general').reply("marketing", (region) => {
    region.show(new MarketingView());
});

class MarketingRoutes extends Marionette.AppRouter {
    routes() {
        return {
            "marketing"                  : 'show'
        };
    }
    show() {
        let region = Radio.channel('app').request("region");
        region.show(new MarketingView());
    }
}
new MarketingRoutes();

