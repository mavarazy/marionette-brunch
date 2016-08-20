import Backbone     from 'backbone';
import Radio        from 'backbone.radio';

import moment       from 'moment';

class Clock extends Backbone.Model {
    get validation() {
        return {
            name: {
                required: true,
                minLength: 2
            },
            city: {
                required: true,
                minLength: 2
            },
            offset: {
                required: true,
                min: -720,
                max: 840
            }
        }
    }
    initialize () {
        this.updateClock();
        this.timerTask = setInterval(() => this.updateClock(), 1000);
        this.once("destroy", () => clearInterval(this.timerTask));
    }
    pad(num, size) {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }
    updateClock() {
        let now = this.get('offset') === undefined ? moment() : moment().utcOffset(this.get('offset'));

        let update = {
            second: this.pad(now.seconds(), 2),
            minute: this.pad(now.minutes(), 2),
            hour: this.pad(now.hours(), 2)
        }

        this.set(update);
    }
}

class Clocks extends Backbone.Collection {
    get model() {
        return Clock;
    }
    url() {
        return "/api/user/me/clock"
    }
    get emptyClock() {
        let newEntity = new Clock();
        newEntity.urlRoot = this.url;
        newEntity.on("sync", (model) => {
            this.add(new Clock(model.attributes), { at: 0 });
            model.clear();
        })
        return newEntity;
    }
}

class API {
    empty() {
        return new Clock();
    }
    clocks(userId) {
        userId = userId === undefined ? "me" : userId;
        let clocks = new Clocks();
        clocks.url = `/api/user/${userId}/clock`
        clocks.fetch();
        return clocks;
    }
}

let service = new API();

Radio.channel("clock").reply("entities:current", () => service.empty())
Radio.channel("clock").reply("entities:all", (userId) => service.clocks(userId));