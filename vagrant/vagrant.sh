# Used by Vagrant to install an Ubuntu Linux Virtual machine with Apache2, MySQL and PHP (LAMP)

sudo su

export DEBIAN_FRONTEND=noninteractive

echo "*** Upgrade and Update Ubuntu"
apt-get upgrade
apt-get update

echo "*** Install Apache2"
apt-get install -y apache2

echo "*** Install PHP and its dependencies"
apt-get install -y \
  php \
  php-bcmath \
  php-cli \
  php-common \
  php-curl \
  php-gd \
  php-intl \
  php-json \
  php-mbstring \
  php-mysql \
  php-opcache \
  php-redis \
  php-sqlite3 \
  php-xml \
  php-xsl \
  php-zip \
  php-xdebug \
  php-pear \
  php-dev

# Enable mod_rewrite
a2enmod rewrite

echo "*** Create the basic folders"
mkdir -p /var/www/folder/
chmod 777 -R /var/www/folder/

mkdir -p /var/www/public_html/
chmod 777 -R /var/www/public_html/

mkdir -p /var/www/log/
chmod 777 -R /var/www/log/

mkdir -p /var/www/log/profiler/
chmod 777 -R /var/www/log/profiler/

echo "*** Prepare PEAR folders"
mkdir -p /tmp/pear/cache
mkdir -p /tmp/pear/temp

# The xdebug distributed with Ubuntu 20.04 LTS is v2.9.2, we want v3.0.x
echo "*** Install xdebug 3.0.x with PECL"
pecl install xdebug

echo "*** Enable xdebug 3.0.x"
sudo cp /var/www/vagrant/xdebug.ini /etc/php/7.4/mods-available/xdebug.ini
phpenmod "xdebug"

# Configure Apache2 to allow .htaccess file
sudo sed -i 's|AllowOverride None|AllowOverride All|g' /etc/apache2/apache2.conf

# Change Apache2 web root to /var/www/public_html
sudo sed -i 's|/html|/public_html|g' /etc/apache2/sites-available/000-default.conf

echo "*** Time. Avoid drifting away"
# Time. Guest can drift away from the host clock. This seem to prevent that.
sudo apt-get install ntpdate
sudo ntpdate ntp.ubuntu.com
sudo timedatectl set-ntp false
sudo timedatectl set-ntp true

echo "*** Set the VirtualHost"
sudo cp /var/www/vagrant/default.conf /etc/apache2/sites-enabled/000-default.conf

echo "*** Install GnuPG"
# GnuPG https://www.gnupg.org/
apt-get install -y libgpgme11-dev
pecl channel-update pecl.php.net
pecl install gnupg
sudo cp /var/www/vagrant/gnupg.ini /etc/php/7.4/mods-available/gnupg.ini
phpenmod "gnupg"

# Install MariaDb
# https://gist.github.com/csotomon/fe2bde0f9b76e53896294d64ac3b54d5

echo "*** Setting MariaDb root user password root/root"
debconf-set-selections <<< 'mariadb-server mariadb-server/root_password password topsecret'
debconf-set-selections <<< 'mariadb-server mariadb-server/root_password_again password topsecret'

echo "*** Installing packages"
apt-get install -y mariadb-server mariadb-client

echo "*** Allow External Connections on your MySQL Service"
sudo sed -i -e 's/bind-addres/#bind-address/g' /etc/mysql/mariadb.conf.d/50-server.cnf
sudo sed -i -e 's/skip-external-locking/#skip-external-locking/g' /etc/mysql/mariadb.conf.d/50-server.cnf
mariadb -u root -ptopsecret -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root'; FLUSH privileges;"
sudo service mariadb restart

echo "*** Create client database local_infohub_se"
mariadb -u root -ptopsecret -e "CREATE DATABASE IF NOT EXISTS local_infohub_se;"

echo "*** Install Infohub"

echo "*** Install Infohub - Set up hosts file"
sudo echo '127.0.0.1 local.infohub.se' >> /etc/hosts
sudo echo '127.0.0.1 dbserver' >> /etc/hosts

echo "Install Infohub - Copy files to config"
sudo mkdir -p /var/www/folder/config/
sudo chmod 777 -R /var/www/folder/config/
sudo cp /var/www/folder/config_example/*.json /var/www/folder/config/

echo "Install Infohub - Set up folders"
sudo mkdir -p /var/www/folder/file/
sudo chmod 777 -R /var/www/folder/file/
sudo mkdir -p /var/www/folder/file/infohub_login/
sudo chmod 777 -R /var/www/folder/file/infohub_login/
sudo cp /var/www/folder/config_example/infohub_login/*.json /var/www/folder/file/

echo "*** Restart Apache2"
service apache2 restart

echo "DONE!!"
