import list         from './list/UserList';
import entites      from './entities/UserEntities';

import Radio        from 'backbone.radio';
import Marionette   from 'backbone.marionette';

import layoutTemplate from './user_layout'
class UserLayout extends Marionette.LayoutView {
    template() {
        return layoutTemplate;
    }
    regions() {
        return {
            "user"          : "#user",
            "clocks"        : "#clocks"
        }
    }
}

class UserRoutes extends Marionette.AppRouter {
    routes() {
        return {
            "user"                  : 'list',
            "user/:userId"          : 'show'
        };
    }
    list() {
        let region = Radio.channel('app').request("region");
        let users = Radio.channel("user").request("entities");
        Radio.channel("user").request("list", users, region)
    }
    show(userId) {
        let region = Radio.channel('app').request("region");
        let layout = new UserLayout()
        layout.on("show", () => {
            let user = Radio.channel("user").request("entities:get", userId);
            Radio.channel("user").request("list:single", user, layout.user);
            Radio.channel("clock").request("show", userId, layout.clocks);
        })
        region.show(layout);
    }
}

new UserRoutes()
