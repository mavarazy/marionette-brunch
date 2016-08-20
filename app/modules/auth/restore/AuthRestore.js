import Backbone from 'backbone';
import StickIt from 'backbone.stickit';

import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import restoreTemplate from './template/restore.hbs';

class RestoreView extends Marionette.ItemView {
    template() {
        return restoreTemplate;
    }
    behaviors() {
        return {
            "Navigation": {},
            "Validation": {},
            "StickIt": {}
        }
    }
}

Radio.channel('auth').reply("restore:show", (region) => {
    region.show(new RestoreView({
        model: new Backbone.Model()
    }));
});


