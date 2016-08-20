import Marionette 	from 'backbone.marionette';
import Radio 		from 'backbone.radio';
import Backbone 	from 'backbone';

import termsTemplate from './template/terms'
class TermsView extends Marionette.ItemView {
    get template() {
        return termsTemplate;
    }
    get behaviors() {
        return {
            Navigation: {}
        }
    }
}
Radio.channel('general').reply("term", (region) => {
    region.show(new TermsView());
});

class TermsRoutes extends Marionette.AppRouter {
    routes() {
        return {
            "terms"                  : 'show'
        };
    }
    show() {
        let region = Radio.channel('app').request("region");
        region.show(new TermsView());
    }
}
new TermsRoutes();

