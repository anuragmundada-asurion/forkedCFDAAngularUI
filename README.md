# REISystems-GSA-CFDA-Angular-UI
CFDA modernization UI service. Primarily using AngularJS framework. 

# Local Setup (Vagrant)

## Prerequisites:
1. To run this project you will have to setup VirtualBox on your machine.
2. Make sure that you have the following folders before you start to setup your environment:

| Directory/File   |  Comment |
|----------|:-------------|
| /apps/ |  microservice repos will be cloned here | 
| /vagrant/ |  vagrant configuration files will go here, the shared folder is setup to be at the top level of this structure | 
| /scripts/ | various scripts for setting up the environment and starting the services go here | 
| package.box | Vagrant box that contains the VM for our environment | 
3. The vagrant box "package.box" and the contents in /vagrant/ and /scripts/ can be provided by a fellow developer.

## Steps for first time Local Setup
The following section will run through getting a developer's local environment setup and started. This instruction set will assume you're working on a mac/linux machine.
### 1. Start Vagrant
1. Open the terminal (I would recommend iTerm2) and follow the commands below.
2. mkdir gsa-iae
3. cd gsa-iae
 ( Make sure you have the prerequisite folders here )
4. mv package.box vagrant/
5. cd vagrant/
6. rm -rf .vagrant/
7. vagrant box add rei-gsa-iae package.box
8. vim puphet/config.yaml (make necessary edits)
    - machine id, machine hostname, private network ip address should be something unique for every vagrant instance (**remember** the IP address)
    - the box/box_url should point to the vagrant box.
9. vagrant up
   (if errors pop do the following)
   -->mkdir -p /Users/{username or hostname}/.vagrant.d/boxes/rei-gsa-iae/0/virtualbox/scripts/vagrant
   -->cp ../scripts/vagrant/dev-dependencies.sh /Users/{username or hostname}/.vagrant.d/boxes/rei-gsa-iae/0/virtualbox/scripts/vagrant/
10. vagrant ssh

At this point you should be logged into Vagrant box. Move into the /var/www/gsa-iae directory to find the shared folders with the host machine.

Go into scripts/vagrant/, run the following to download additional dependencies 
```
sudo ./dev-dependencies.sh
```
Also run the next line to clear ports 
```
sudo ./setup-session.sh
```
### 2. Database Re-Sync
The database structure and data is likely out of date, to re-sync:
```
sudo su postgres
psql
DROP DATABASE gsa_cfda;
CREATE DATABASE gsa_cfda;
```
Using a tool like **pgAdmin**, get a 'cfda' database backup from our DEV environment (ogpsql.reisys.com)
setup a postgres connection to your vagrant box (use the ip address mentioned earlier) and restore the gsa_cfda database from the recently created backup 

### 3. ElasticSearch Tweaks
Run "sudo vim /etc/elasticsearch/elasticsearch.yml" and ensure the network.bind_host is pointing to the correct ip address if necessary.

### 4. Clone the Microservice Git Repositories
Go to /var/www/gsa-iae and switch into your apps/ directory, begin cloning all the repos:
- https://github.com/REI-Systems/REISystems-GSA-CFDA-Angular-UI.git
- https://github.com/REI-Systems/REISystems-GSA-CFDA-Program.git
- https://github.com/REI-Systems/REISystems-GSA-CFDA-Modern-Search.git
- https://github.com/REI-Systems/REISystems-GSA-CFDA-Modern-Sync.git
- https://github.com/REI-Systems/REISystems-GSA-IAE-Federal-Hierarchy.git
- https://github.com/REI-Systems/REISystems-GSA-IAE-Notifications.git

### 5. ElasticSearch JDBC
Move into your REISystems-GSA-CFDA-Modern-Search repo and create a "lib/" directory. Go online, download, and add elasticsearch-jdbc-1.7.3.0 to this location.

### 6. Startup script updates
Finally, from /var/www/gsa-iae, change into scripts/app/. Edit all the files in this directory and make sure your ip address is correct.

## Steps for Daily Local Setup
At this point, the developer environment should be setup. The next step is starting all the microservices.

0. (Prerequisite: make sure you are in the folder that contains the "vagrantfile")
1. vagrant up (only once, in one terminal)
2. vagrant ssh (in all terminals)
3. cd /var/www/gsa-iae/scripts/app/ (in all terminals)
4. sudo ../vagrant/setup-session.sh (only once, in one terminal)
5. ./start-cfda-frontend-java.sh (in one terminal)
6. ./start-cfda-program-java.sh (in another terminal)
7. ./start-cfda-federal.sh (in another terminal)
8. ./start-cfda-search-java.sh (in another terminal)
9. ./start-cfda-sync-java.sh (in another terminal)
10. cd /var/www/gsa-iae/apps/{name of angular-ui repo} (in different terminal) 
11. gulp package (if only html, js changes were made, changes to java need the script in step 5 to be rerun)

NOTE: if terminal seems to hang, you may need to quit out of it and restart your computer and try again. To logout of the virtual machine, hold down SHIFT key and press "~" followed by ".". This will log you out of the virtual machine. Then you can run "vagrant halt" to stop the virtual machine. 

NOTE: if you run into an error such as "can not find module q", do this: Remove the app repositories and install them from inside the virtual machine. Then "vagrant halt" and try again. 

## Using Dev Microservice URLs (if needed)
1. vim ./start-cfda-frontend-java.sh (change SEARCH + FH to Dev host)
    {dev url for Federal Hierarchy: http://gsaiae-cfda-fh-dev02.reisys.com/v1/fh
     dev url for Search microservice: http://gsaiae-cfda-modern-search-dev02.reisys.com/
     dev url for Program microservice: http://gsaiae-dev02.reisys.com:82/api/v1}
2. vim ./start-cfda-program-java.sh 
    (Change FH to dev host AND DDATABASE_FQDN=192.168.56.109 -DDATABASE_NAME=gsa_cfda -DDATABASE_PASSWORD=123 -DDATABASE_USER=postgres TO Dev Credentials DB)
    {dev url for notifications ms: http://gsaiae-dev02.reisys.com:96/v1/notifications
     dev database environment variables:
          -Denv.BUILD_NUMBER=1 -DDATABASE_FQDN=ogpsql.reisys.com -DDATABASE_NAME=cfda -DDATABASE_PASSWORD=postgres -DDATABASE_USER=postgres -Dserver.port=8081}

