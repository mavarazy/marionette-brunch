import Backbone     from 'backbone';
import Marionette   from 'backbone.marionette';
import Radio        from 'backbone.radio';

import layoutTemplate from './template/layout';
class UserLayout extends Marionette.LayoutView {
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

import panelTemplate from './template/panel'
class UserPanel extends Marionette.ItemView {
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
            "#username"     : "username"
        }
    }
}

import userTemplate from './template/user';
class User extends Marionette.ItemView {
    get template() {
        return userTemplate
    }
    get behaviors() {
        return {
            Validation      : {},
            Navigation      : {}
        }
    }
    get modelEvents() {
        return {
            "sync"   : "render",
            "change" : "render"
        }
    }
    events() {
        return {
            "click #delete"  : () => this.model.destroy({ wait: true }),
            "click #manager" : () => this.model.setRole("MANAGER"),
            "click #admin"   : () => this.model.setRole("ADMIN"),
            "click #user"    : () => this.model.setRole("USER")
        }
    }
}

class Users extends Marionette.CollectionView {
    getChildView () {
        return User;
    }
    get collectionEvents() {
        return {
            "sync": "render"
        }
    }
}

class API {
    list(users, region) {
        let layout = new UserLayout();
        layout.on("show", () => {
            let usersView = new Users({
                collection: users
            });
            layout.list.show(usersView);

            let panelModel = new Backbone.Model();
            let panelView = new UserPanel({
                collection: users,
                model: panelModel
            });
            panelView.target = usersView;
            layout.panel.show(panelView);
        });
        region.show(layout);
    }
    show(user, region) {
        let userView = new User({
            model: user
        });
        region.show(userView);
    }
}

let service = new API();

Radio.channel("user").reply("list", (users, region) => service.list(users, region));
Radio.channel("user").reply("list:single", (user, region) => service.show(user, region));