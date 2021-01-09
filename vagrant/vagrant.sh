# Used by Vagrant to install an Ubuntu Linux Virtual machine with Apache2, MySQL and PHP (LAMP)

sudo su

# Upgrade and Update Ubuntu
apt-get upgrade
apt-get update

# Install Apache2
apt-get install -y apache2

# Update the repositories
sudo apt-get update

# Install PHP and its dependencies
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

# Create the basic folders
mkdir -p /var/www/folder/
chmod 777 -R /var/www/folder/

mkdir -p /var/www/public_html/
chmod 777 -R /var/www/public_html/

mkdir -p /var/www/log/
chmod 777 -R /var/www/log/

mkdir -p /var/www/log/profiler/
chmod 777 -R /var/www/log/profiler/

# Add the correct Xdebug values in php.ini file
export PATH_PHP_INI="/etc/php/7.4/apache2/php.ini"

sudo echo '[xdebug]' >> $PATH_PHP_INI
sudo echo 'zend_extension="xdebug.so"' >> $PATH_PHP_INI
sudo echo 'xdebug.default_enable = On' >> $PATH_PHP_INI
sudo echo 'xdebug.remote_enable = On' >> $PATH_PHP_INI
sudo echo 'xdebug.remote_autostart = On' >> $PATH_PHP_INI
sudo echo 'xdebug.remote_connect_back = On' >> $PATH_PHP_INI
sudo echo 'xdebug.max_nesting_level = -1' >> $PATH_PHP_INI
sudo echo 'xdebug.idekey = "PHPSTORM"' >> $PATH_PHP_INI
sudo echo 'xdebug.remote_host = 10.0.2.2' >> $PATH_PHP_INI
sudo echo 'xdebug.profiler_output_dir = "/var/www/log/profiler"' >> $PATH_PHP_INI
sudo echo 'xdebug.profiler_enable_trigger = 1' >> $PATH_PHP_INI

# Configure Apache2 to allow .htaccess file
sudo sed -i 's|AllowOverride None|AllowOverride All|g' /etc/apache2/apache2.conf

# Change Apache2 web root to /var/www/public_html
sudo sed -i 's|/html|/public_html|g' /etc/apache2/sites-available/000-default.conf

# Time. Guest can drift away from the host clock. This seem to prevent that.
sudo apt-get install ntpdate
sudo ntpdate ntp.ubuntu.com
sudo timedatectl set-ntp false
sudo timedatectl set-ntp true

# Set the VirtualHost
sudo cp /var/www/vagrant/default.conf /etc/apache2/sites-enabled/000-default.conf

echo "Install GnuPG"
# GnuPG https://www.gnupg.org/
mkdir -p /tmp/pear/cache
mkdir -p /tmp/pear/temp
apt-get install -y libgpgme11-dev
pecl channel-update pecl.php.net
pecl install gnupg
sudo cp /var/www/vagrant/gnupg.ini /etc/php/7.4/mods-available/gnupg.ini
phpenmod "gnupg"

# Install MySQL
# https://gist.github.com/csotomon/fe2bde0f9b76e53896294d64ac3b54d5

echo "Setting MySQL root user password root/root"
debconf-set-selections <<< 'mysql-server mysql-server/root_password password topsecret'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password topsecret'

echo "Installing packages"
apt-get install -y mysql-server mysql-client

echo "Allow External Connections on your MySQL Service"
sudo sed -i -e 's/bind-addres/#bind-address/g' /etc/mysql/mysql.conf.d/mysqld.cnf
sudo sed -i -e 's/skip-external-locking/#skip-external-locking/g' /etc/mysql/mysql.conf.d/mysqld.cnf
mysql -u root -ptopsecret -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root'; FLUSH privileges;"
sudo service mysql restart

echo "Create client database local_infohub_se"
mysql -u root -ptopsecret -e "CREATE DATABASE IF NOT EXISTS local_infohub_se;"

echo "Install Infohub"

echo "Install Infohub - Set up hosts file"
sudo echo '127.0.0.1 local.infohub.se' >> /etc/hosts
sudo echo '127.0.0.1 dbserver' >> /etc/hosts

echo "Install Infohub - Copy files to config"
mkdir -p /var/www/folder/config/
chmod 777 -R /var/www/folder/config/
sudo cp /var/www/folder/config_example/*.json /var/www/folder/config/

echo "Install Infohub - Set up folders"
mkdir -p /var/www/folder/file/
chmod 777 -R /var/www/folder/file/
mkdir -p /var/www/folder/file/infohub_login/
chmod 777 -R /var/www/folder/file/infohub_login/
sudo cp /var/www/folder/config_example/infohub_login/*.json /var/www/folder/file/

echo "Restart Apache2"
service apache2 restart

echo "DONE!!"
