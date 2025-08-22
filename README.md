This server.js file extracts the latest stories from the www.time.com website and display in json format to user.

Instructions to run the application:
1. Clone a copy of the directory to your local machine:

2 . Type node server.js [port number] (you can leave the port number blank, default starts at port 8080), and click enter.

3 . Visit http://localhost:[port number]/getTimeStories on REST API client such as Postman or in the browser e.g. http://localhost:8080/getTimeStories

The application does not rely on external libraries; instead, it utilizes regular expressions for parsing and processing the HTML string.
