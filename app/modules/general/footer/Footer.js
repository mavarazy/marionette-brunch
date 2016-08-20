import Marionette   from 'backbone.marionette';
import Radio        from 'backbone.radio';

import footerTemplate from './template/footer';
class Footer extends Marionette.ItemView {
    get template() {
        return footerTemplate;
    }
}

Radio.channel("general").reply("footer", (region) => { region.show(new Footer()); });