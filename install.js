var shell = require('shelljs');
var pkg = require('./package.json');

for(var key in pkg.apps){
    //clone repo inside apps
    shell.exec("git clone "+pkg.apps[key]+" apps/"+key);
    //read the package.json for installing all the dependencies
    if(process.argv.indexOf("-i") === -1){
        var pkgApp = require('./apps/'+key+'/package.json')
        for(var k in pkgApp.jspm.dependencies){
            shell.exec('jspm install --save '+pkgApp.jspm.dependencies[k]);
        }
    }
    //symlink css, js
    shell.ln('-s', shell.pwd()+'/apps/'+key+'/app', shell.pwd()+'/app/'+key);
    //shell.ln('-s', shell.pwd()+'/apps/'+key+'/app/css', shell.pwd()+'/app/'+key+'/css');
    //shell.ln('-s', shell.pwd()+'/apps/'+key+'/app/templates', shell.pwd()+'/app/'+key+'/templates');
}