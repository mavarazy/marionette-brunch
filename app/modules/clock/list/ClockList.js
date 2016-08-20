import moment       from 'moment';
import timeZone     from 'moment-timezone';

import Backbone     from 'backbone';
import Marionette   from 'backbone.marionette';
import Radio        from 'backbone.radio';

import layoutTemplate from './template/layout';
class ClockLayout extends Marionette.LayoutView {
    template() {
        return layoutTemplate;
    }
    regions() {
        return {
            "panel"      : "#panel",
            "list"       : "#list"
        }
    }
}

import panelTemplate from './template/panel';
class ClockPanel extends Marionette.ItemView {
    get template() {
        return panelTemplate
    }
    behaviors() {
        return {
            StickIt             : {},
            CollectionFilter    : {}
        }
    }
    bindings() {
        return {
            "#name"     : "name",
            "#city"     : "city"
        }
    }
}

import timerTemplate from './template/clock';
class Clock extends Marionette.ItemView {
    get template() {
        return timerTemplate;
    }
    get modelEvents() {
        return {
            "change": "render"
        }
    }
    events() {
        return {
            "click #delete" : () => { this.model.destroy() }
        }
    }
}

class Clocks extends Marionette.CollectionView {
    getChildView () {
        return Clock;
    }
    get collectionEvents() {
        return {
            "sync": "render"
        }
    }
}

class API {
    list(clocks, region) {
        let layout = new ClockLayout();
        layout.on("show", () => {
            let clocksView = new Clocks({
                collection: clocks
            });
            layout.list.show(clocksView);

            let panelModel = new Backbone.Model();
            let panelView = new ClockPanel({
                collection: clocks,
                model: panelModel
            });
            panelView.target = clocksView;
            layout.panel.show(panelView);
        });
        region.show(layout);
    }
}

let service = new API()

Radio.channel('clock').reply("list", (clocks, region) => service.list(clocks, region));



