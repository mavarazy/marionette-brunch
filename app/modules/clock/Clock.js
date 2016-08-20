import entities     from './entities/ClockEntities';
import add          from './add/ClockAdd';
import show         from './list/ClockList';

import Backbone     from 'backbone';
import Marionette   from 'backbone.marionette';
import Radio        from 'backbone.radio';

import layoutTemplate from './layout';
class ClockLayout extends Marionette.LayoutView {
    template() {
        return layoutTemplate;
    }
    regions() {
        return {
            "add"      : "#add",
            "user"     : "#user"
        }
    }
}

class Controller {
    display() {
        let region = Radio.channel('app').request("region");
        this.show("me", region)
    }
    show(userId, region) {
        let layout = new ClockLayout();
        layout.on("show", () => {
            let clocks = Radio.channel('clock').request("entities:all", userId);
            Radio.channel("clock").request("add", clocks, layout.getRegion("add"));
            Radio.channel("clock").request("list", clocks, layout.getRegion("user"));
        });
        region.show(layout);
    }
}
let service = new Controller();

class ClockRoutes extends Marionette.AppRouter {
    routes() {
        return {
            "clock"                  : 'display'
        };
    }
    display() {
        service.display();
    }
}

new ClockRoutes()

Radio.channel("clock").reply("show", (userId, region) => service.show(userId, region));