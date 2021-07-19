# Railway-database-management-system

A web-based application which can be used for managing the data of Railways.


## Steps
After downloading the project on the system, perform the following steps:
1. Open the terminal and go to the location where the project is stored.
2. Type the command: npm install.
    - It will install all the modules which are required by the project into a node_modules folder.
3. Since the project also needs MySQL installed on the system, enter your MySQL credentials into the project.
   This can be done in two ways:  
   (a) Directly replace the contents at the appropriate location in the dbService.js file by your MySQL credentials.  
   (b) Or, create another file named ".env" and write credentials there. In this case, don't change the dbService.js file.
4. After performing all the above steps, you can run the project on your system by simply going to terminal and typing the following command:
    + node index
5. Since the application requires admin login, first insert one (or more) record into admin table of MySQL and then again run the project using the admin details from admin table.
