// http://benmccormick.org/2015/07/06/backbone-and-es6-classes-revisited/
import App        from 'App';
import Config     from 'conf/config';

import Modules    from 'modules/modules';
import Radio      from  'backbone.radio';

document.addEventListener('DOMContentLoaded', () => {
  let app = new App();
  app.start();
  global.App = app;
});

