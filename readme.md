# Making a personal storage server

I buit a personal server, kinda like google drive.
Innitially, I built this for a friend that wanted to be able to plug a pen on the server and then access it's files whenever he was with whatever device.

Then I realized that this is actually usefull so I made one for my self as well.

My day job is clinical psychologist and this drive actually became very convenient to be able to access my files without having to login with google to use the Gdrive. It is also a very quick way to share files between devices.

You can have a glimpse of how this project will work using an already made personal drive:

[Personal Drive](https://personal-drive-amber.vercel.app/)


You can login with:

user: loginGuest

pass: passwordGuest

You can download and delete the files, but upload is restricted.

I made this documentation, to explain step by step how I deployed the server. I also provide the base front-end and back-end code so you can build it for yourself.

The only requirement is somekind of pc to always be connected to the internet, you can use an old pc or a raspeberrypi, for example.

I used an orangepi, a cheaper brand of microcomputers like raspeberrypi.

## Steps
- **pc for a server** - old pc, raspeberrypi, orangepi...
    - **linux based server** - I choosed debian bookworm
    - **install nginex** - to server as reverse proxy
    - **install certbot** - for secure https conections
    - **install firewall** - because protection
    - **install pm2** - to manage the backend
- **backend app** - I used nodeJS to create the backend
    - **minimal changes** - you need to make some changes, like adding the users...
    - **deploy the backend** - (the mentioned above)
- **frontend app** - I used the Vite framework, with react and tailwind
    - **edit a line of code** - set your the server address
    - **deploy the frontend** - I used vercel, but any host service will do

## Creating the server
I used an orangepi for the server.

### Install OS
Install a linux based OS server, you can use a gui OS as well, but for this project and similares we can do everything with the console. Also keep in mind that if you choose another OS not ubuntu or debian, the installations commands may be diferent.

### Install Nginx
```console
sudo apt update
sudo apt install nginx
```
### Obtain a new SSL certificate with Certbot
To have better security we are going to enable the HTTPS protocol (S of "secure" is the difference). For that we first need to get a dns address.

There are paid and free dns providers out there, I used the free www.duckdns.org.
Its very simple to setup, just login with google (or something), pick a name for your server app and insert your external ip address.

After that, lets do the secure parte. Paste the following code and take notice (e.g., printscreen) of where "certificate" and "key" are saved, we are going to need it in the next step.

```console
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d _yourdomainname_.duckdns.org
sudo certbot renew --dry-run
```

### Configure Nginx
Lets create a configuration file for the app. Create a file in:
 `sudo nano /etc/nginx/sites-available/_yourappname_`

Paste the following content, edit the domain name, the port the app will be running and the paths to the certificate and its key:

```console
server {
    listen 80;
    server_name _yourdomainname_.duckdns.org;
    client_max_body_size 50M; # sets the max size upload, change to what you want

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SSL configuration
    listen 443 ssl;
    ssl_certificate _/etc/letsencrypt/live/_yourdomainname_.duckdns.org/fullchain.pem;_
    ssl_certificate_key /etc/letsencrypt/live/_yourdomainname_.duckdns.org/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

```

We need to create a link between that file and a copy of it in another location:
`sudo ln -s /etc/nginx/sites-available/_yourappname_ /etc/nginx/sites-enabled/`

Remove the default configuration:
`sudo rm /etc/nginx/sites-enabled/default`

Test if there are no error in the configuration:
`sudo nginx -t`

If there are errors go check the code you added line by line to make sure everything is corrected, if after there are still errors, you have to use google.

Restart nginx:
`sudo service nginx restart`

### Instal a Firewall
UFW is a fast and uncomplicated firewall to set up.
`sudo apt install ufw`

Set permissions for HTTP, HTTPS, and SSH (optional):

```console
sudo ufw allow 80
sudo ufw allow 443 
sudo ufw allow ssh
```

Activate the firewall:
`sudo ufw enable`

### Install Node
We are going to use nvm to install node, nvm is kind of a future proof installation of node. Run:

Run:
`curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash`

If you get a error saying you don't have curl:
`sudo apt install curl -y `

Apply the new installation with `source ~/.bashrc`

Now lets install node, for this particular app I think you can use whaever version of node, so just run:
`nvm install node`

Check if installed both node and npm:
```console
node -v //should return something like 21.5.0 (my version)
npm -v //should return something like 10.2.4 (my version)
```

### Install GIT and get the backend app in your server
`sudo apt-get install git-all`

clone the repo, you will get both the front and back ends.
``

go to the backend directory and install the node packages
`npm i`

#### Edit the backend
On this backend there is no database, you can't register throught the front-end, you must hardcode the users directly in the backend, modyfing the USERS.js file. (of course you can implement the registration if you need it).

The app consists basically for js files:
 - app.js - the main file with ass the routes.
 - login.js - has the middleware that handles login and sessions related events with JWT
 - csrf.js - handles the CSRF security
 - USERS.js - has an object with the users

You have minimall things to edit, just go thought the files and read the comments in all caps.

Next, if your going to use the default paths I set up, you have a folder called "files" and inside of it your must create separate folders with the exact name of your Users. Right now comes with "username" and "username2" modify those to match the usernames you picked in USER.js Inside the folder there is also another folder called "uploads", that is a shared folder between all users.


### Configure PortForwarding in your Router
This setp can very between routers. On my router I just to select the internal IP of the server configure tcp/udp to port 443 (https), with the options: unique, and exit same as entry

### Instal PM2
PM2 is what is going to lauch our app and keep it runing even when the server reboots.
Copy paste each command individually.


`npm install -g pm2`

```console
pm2 start app.js --name="_your-app-name_"
pm2 startup 
pm2 save
```

PS: After `pm2 startup` you have to copy and paste the command that shows on the console.

### Server ready!
Thats mostly it for the backend, you still need to get the frontend url to tell the backend (insert on app.js) from where the requests are comming.

So the next step is to deploy the frontend

### Frontend
In the frontend directory install the node packages with `npm i`
On the Frontend you really just have to edit the "ADDRESS_SERVER" variable in the App.tsx file and put the server address there.

To deploy it, basically any host service will do. It uses the Vite framework so you can use their guides to better inform you how to do it.

And it's done, if manage to get here, congratulations - you have your own drive to store and acess your files.

If you had any problems, feel free to contact me :D

## License
MIT