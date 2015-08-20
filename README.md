## Gulp Task Automation

### Global dependencies

These need to be installed one time to be available globally on your system.

- node - [download installer](http://nodejs.org/)
- gulp - `npm install -g gulp`
- sass - `sudo gem install sass`

### Initial setup
(Only one team member needs to do this setup)

**1. Create file structure**

For this example, the file structure looks like this:
```
/
|
|-- gulpfile.js
|-- package.json
|
|-- /app
|   |-- /css
|   |-- /images
|   `-- /js
|
`-- /src
    |-- /images
    |-- /js
    `-- /scss
        `-- main.scss
```

**2. Create a `package.json` file in the root directory for this project.**

`$ npm init`

**3. Install dependencies. If dependencies are added for new tasks remember to use `--save-dev` flag!**

`$ npm install --save-dev gulp browser-sync gulp-autoprefixer gulp-cached gulp-concat gulp-filter gulp-imagemin gulp-jshint gulp-notify gulp-plumber gulp-rename gulp-sass gulp-sourcemaps gulp-uglify serve-static`

**Do NOT use sudo!**

If you have an npm permissions issue at this step, run the following commands (`whoami` is your username):
```
sudo chown -R `whoami` /usr/local
sudo chown -R `whoami` ~/.npm
sudo chown -R `whoami` /usr/local/lib/node_modules
```

More information about npm permissions can be found in the [npm documentation](https://docs.npmjs.com/getting-started/fixing-npm-permissions)

Here is an example of what the DevDependencies section will look like in your package.json file:

```
{
  "devDependencies": {
    "browser-sync": "^2.8.2",
    "gulp": "^3.8.10",
    "gulp-autoprefixer": "^2.0.0",
    "gulp-cached": "^1.0.4",
    "gulp-concat": "^2.4.2",
    "gulp-filter": "^2.0.0",
    "gulp-imagemin": "^2.0.0",
    "gulp-jshint": "^1.9.0",
    "gulp-notify": "^2.1.0",
    "gulp-plumber": "^0.6.6",
    "gulp-rename": "^1.2.0",
    "gulp-sass": "^2.0.1",
    "gulp-sourcemaps": "^1.2.8",
    "gulp-uglify": "^1.0.2",
    "serve-static": "^1.10.0"
  }
}
```

**4. Set file paths and browser support in `gulpfile.js`**

All paths are relative to `gulpfile.js`. Autoprefixer browser support must be precise or the task will fail. Refer to the [documentation](https://github.com/ai/browserslist) when adding browsers.

**5. Update `.gitignore`**

The repository does not need to include the `node_modules` directory. The dependencies are listed in `package.json`.

### Bring a team member into the project
**1. `$ git clone`**

The repository should include:
- `gulpfile.js`
- `package.json`

**2. `$ npm install`**

Now everyone on the team has the same version.

### Gulp Basics
To run the 'default' task one time

`$ gulp`

To start gulp and continue watching

`$ gulp watch`

To start gulp and continue watching with BrowserSync

`$ gulp bsync`
