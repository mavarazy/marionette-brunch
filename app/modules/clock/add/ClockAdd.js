import Marionette   from 'backbone.marionette';
import Radio        from 'backbone.radio';

import moment       from 'moment';
import timeZone     from 'moment-timezone';

import addTemplate from './template/add';
class ClockAddView extends Marionette.ItemView {
    get template() {
        return addTemplate;
    }
    get behaviors() {
        return {
            "Navigation": {},
            "StickIt": {},
            "Validation": {}
        }
    }
    bindings() {
        return {
            "#name"     : "name",
            "#city"     : "city",
            "#offset"   : "offset"
        }
    }
    events() {
        return {
            "click #add": "add"
        }
    }
    add() {
        this.model.save();
    }
}

Radio.channel("clock").reply("add", (clocks, region) => {
    let addView = new ClockAddView({
        model: clocks.emptyClock
    });
    region.show(addView);
});