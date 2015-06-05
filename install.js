var shell = require('shelljs');
var pkg = require('./package.json');
var fs = require('fs');
var handlebars = require('handlebars');

var source = "import Backbone from 'backbone';\n" +
             "{{#each this}}" +
             "import \{ {{this.router}} \} from './{{this.path}}/router';\n" +
             "{{/each}}" +
             "$(() => {\n" +
             "{{#each this}}" +
             "    new {{this.router}}();\n" +
             "{{/each}}" +
             "    Backbone.history.start();\n" +
             "})\n;";

var options = {};
options["title"] = pkg.name;
options["data"] = [];

for(var key in pkg.apps){
    //clone repo inside apps
    shell.echo(key)
    shell.exec("git clone "+pkg.apps[key]["repo"]+" apps/"+key);
    //read the package.json for installing all the dependencies
    if(process.argv.indexOf("-i") === -1){
        var pkgApp = require('./apps/'+key+'/package.json')
        for(var k in pkgApp.jspm.dependencies){
            shell.exec('jspm install --save '+pkgApp.jspm.dependencies[k]);
        }
    }
    //symlink css, js
    shell.ln('-s', shell.pwd()+'/apps/'+key+'/app', shell.pwd()+'/app/'+key);
    var obj = {};
    obj["router"] = pkg.apps[key]["router"];
    obj["path"] = key;
    options.data.push(obj);

    var fs = require('fs');
    var array = fs.readFileSync('.gitignore').toString().split("\n");
    if(array.indexOf(key) === -1){
        var msg = fs.createWriteStream('.gitignore', {'flags': 'a'});
        msg.end(key+"\n")
    }
}

//create main.js
var template = handlebars.compile(source);
var res = template(options.data);
fs.writeFile('app/main.js', res, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The main.js file was saved!");
});

//create index.html
fs.readFile('./templates/index.hbs', function(err, data){
    if(!err){
        var source = data.toString();
        var tmpl = handlebars.compile(source);
        fs.writeFile('app/index.html', tmpl(options), function(err){
            if(err) {
                return console.log(err);
            }

            console.log("The index.html file was saved!");
        });
    }
    else{
        console.log(err);
    }
});