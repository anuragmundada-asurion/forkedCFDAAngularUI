# REISystems-GSA-CFDA-Angular-UI
CFDA modernization UI service. Primarily using AngularJS framework. 



# Local Setup (Vagrant)

## Prerequisites:
1. To run this project you will have to setup VirtualBox on your machine.
2. Make sure that you have the following folders before you start to setup your environment -
    a) scripts (which has the shell scripts in it)
    b) vagrant (which has vagrantfile and config.yaml file in it)
    c) package.box
  
## Steps for first time Local Setup
1. Open the terminal (I would recommend iTerm2) and follow the commands below.
2. mkdir gsa-iae
3. cd gsa-iae
 ( Make sure you have the prerequisite folders here )
4. mv package.box vagrant/
5. cd vagrant/
6. rm -rf .vagrant/
7. vagrant box add rei-gsa-iae package.box
8. vim puphet/config.yaml (make necessary edits)
9. vagrant up
   (if errors pop do the following)
   -->mkdir -p Users/{username/hostname}/.vagrant.d/boxes/rei-gsa-iae/0/virtualbox/scripts/vagrant/dev-dependencies.sh
   -->cp ..scripts/vagrant/dev-dependencies.sh /Users/{username/hostname}/.vagrant.d/boxes/rei-gsa-iae/0/virtualbox/scripts/vagrant/
 
## Steps for Daily Local Setup
1. vagrant up (only once, in one terminal)
2. vagrant ssh (in all terminals)
3. cd /var/www/gsa-iae/scripts/app/ (in all terminals)
4. sudo ../vagrant/setup-session.sh (only once, in one terminal)
5. ./start-cfda-frontend-java.sh (in one terminal)
6. ./start-cfda-program-java.sh (in another terminal)
7. cd /var/www/gsa-iae/apps/{name of angular-ui repo} (in different terminal) 
8. gulp package (if only html, js changes were made, changes to java need the script in step 5 to be rerun)

NOTE: if terminal seems to hang, you may need to quit out of it and restart your computer and try again. 


## Using Dev Microservice URLs (if needed)
1. vim ./start-cfda-frontend-java.sh (change SEARCH + FH to Dev host)
    {dev url for Federal Hierarchy: http://gsaiae-cfda-fh-dev02.reisys.com/v1/fh
     dev url for Search microservice: http://gsaiae-cfda-modern-search-dev02.reisys.com/}
2. vim ./start-cfda-program-java.sh 
    (Change FH to dev host AND DDATABASE_FQDN=192.168.56.109 -DDATABASE_NAME=gsa_cfda -DDATABASE_PASSWORD=123 -DDATABASE_USER=postgres TO Dev Credentials DB)
    {dev url for notifications ms: http://gsaiae-dev02.reisys.com:96/v1/notifications
     dev database environment variables:
          -Denv.BUILD_NUMBER=1 -DDATABASE_FQDN=ogpsql.reisys.com -DDATABASE_NAME=cfda -DDATABASE_PASSWORD=postgres -DDATABASE_USER=postgres -Dserver.port=8081}

