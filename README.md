# spacegame

~~A game with voxels~~

Some voxels

## Setting up local development environment on Windows

1. Install Git and TortoiseGit

2. Download Apache from [apachelounge.com](https://www.apachelounge.com/download/)

3. Copy Apache24 to `/`

4. Edit `/Apache24/conf/httpd.conf` to have `ServerName localhost:80`

5. From `/Apache24/bin` run `httpd -k install`

6. Run `httpd -k start`

7. Visit `http://localhost` to verify

8. Checkout spacegame to `/Apache24/htdocs`