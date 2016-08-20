import $                from 'jquery';
import Marionette       from 'backbone.marionette';
import Radio            from 'backbone.radio';

import Backbone         from 'backbone';

class WorldClockApp extends Marionette.Application {
    regions() {
        return {
            header: '#header',
            app: '#app',
            footer: '#footer'
        }
    }
    initialize() {
        this.on('start', () => {
            if (Backbone.history) {
                Backbone.history.start({ pushState: true });
            }
            Radio.channel("general").request("footer", this.getRegion('footer'));
            Radio.channel("general").request("header", this.getRegion('header'));
        });
        Radio.channel("app").reply("region", () => {
            return this.getRegion("app");
        });

    }
};

export default WorldClockApp;