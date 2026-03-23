# CMSC447Project
## Description

## Installation 
Download XAMPP. https://www.apachefriends.org/ <br>
Install XAMPP. During "Select Components" disselect the following:  
-    FileZilla FTP Server  
-    Mercury Maill Server  
-    Tomcat  
-    Webalizer  
-    Fake Sendmail

Replace the contents of the htdocs folder of the XAMPP install with the files in htdocs from the repo.  
Start XAMPP control panel and start the Apache Server and MySQL (MariaDB) servers.  
Click "Admin" for MySQL, this should open a webpage at https://localhost/phpmyadmin.  
Select "Databases" at the the top of the page.  
Create databases with names "asc_website_db" and "umbc_db".  
Select "asc_website_db" the "Import" at the top of the page.  
Chose the "asc_website_db.sql" file from the database folder from the repo and click "Import" and the bottom of the page.  
Select "umbc_db" the "Import" at the top of the page.  
Chose the "umbc_db.sql" file from the database folder from the repo and click "Import" and the bottom of the page.  
Click "User accounts" at the top of the page then "Add user account" fro the center of the page.  
Fill out the account fields as follows:  
-    User name: wordpress  
-    Host name: 127.0.0.1  
-    Password & Re-type: wordpress

Click "Go" at the botom of the page.  
Select "Database" near the top of the page (note: NOT "Databases").  
Select "asc_website_db" then click "Go".  
Select "Check all" then click "Go"   
Install and run Redis:
> Linux  
> `sudo apt update`  
> `sudo apt install -y redis-server`  
> `sudo systemctl enable redis`

> Mac  
> `brew install redis`  
> `brew services start redis`

> Windows  
> Download, Install, and run Docker. https://www.docker.com/  
> `docker pull redis`  
> `docker run --name my-redis -d -p 6379:6379 redis` (after restart must be run again or started through the docker gui)  

Open a webpage at https://localhost/drop-in-tutoring.
