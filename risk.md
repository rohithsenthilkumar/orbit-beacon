# RISKS 

# 1. SQL INJECTION IN index.js

in the get /api/orders endpoint there is a risk of sql injection through which one can view the entire orders in the db 

to fix it we can use parameterized queries 
so after using parameterised queries if he uses sql injection the db considers it as a single value the OR will be inside the string and not in the query so it will be returning zero rows
#

# 2. XSS IN app.js
anyone can create orers in the website

in this while fetching the order the js creates a new child element and then appends it to the frontend but if orders contain unwanted malicious script its loaded to the frontend and executed in the users browser which may lead to leak of data of users , etc

to rectify this we can use textContent to display the data fetched instead of innerHTML

now if the xss is done in a field ex customer the script is shown as a plain text instead of executing it

### adding backend validation in this for making orders is necessary which should be fixed
#

# 3. PATH IN services/frontend/serve.js

here based on the users request we are serving the file we are assuming he will ask for only html, css or js files but a hacker can ask for any files like passwd in the root by moving ../ one step backwards and trying to access and coz we are attaching the location sent with root he can access any kind of data inside the /dist or the folder 

to fix this we add pathresolveand checks if the req path is inside the root if not it returns with 403 forbidden status code

and also added nosniff to make sure that browser doesnt guess any filetype and gets it from the header sent to prevent mime sniffing

#

# 4.

