module.exports = {
  npm: {
    styles: {
      "bootstrap": ['dist/css/bootstrap.css'],
      "font-awesome": ['css/font-awesome.css']
    }
  },
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app)/,
        'app.js': /^app/
      }
    },
    stylesheets: {
      joinTo: 'stylesheets/app.css'
    },
    templates: {
      joinTo: 'app.js'
    }
  },
  server: {
    run: true
  },
  plugins: {
    babel: {
      presets: ['es2015'],
      ignore: [
        /^(bower_components|vendor|node_modules)/
      ]
    }
  }
};
