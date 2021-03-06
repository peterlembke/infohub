Vagrant.configure("2") do |config|

  # Ubuntu 20.10 (ubuntu/rolling)
  config.vm.box = "ubuntu/groovy64"

  # Set the static IP Address
  config.vm.network "private_network", ip: "192.168.33.12"

  # Create a copy that runs all the time in the background from the host machine to the guest
  config.vm.synced_folder "folder", "/var/www/folder", type: "rsync", type: "rsync", rsync__args: ["--archive", "--delete", "--compress", "--links"], rsync__exclude: ["plugins-deprecated", "plugins-wip"]
  config.vm.synced_folder "vagrant", "/var/www/vagrant", type: "rsync", type: "rsync", rsync__args: ["--archive", "--delete", "--compress", "--links"], rsync__exclude: []
  config.vm.synced_folder "public_html", "/var/www/public_html", type: "rsync", type: "rsync", rsync__args: ["--archive", "--delete", "--compress", "--links"], rsync__exclude: []

  # Create the Virtual machine in VirtualBox
  config.vm.provider "virtualbox" do |vb|
      # Showing a GUI is useful for debugging purposes while boot fails
      vb.gui = true
      vb.memory = "4096"
      vb.cpus = 4
      vb.name = "infohub"
      # Virtualbox clock can drift away from the host clock. This makes the guest to copy the clock from the host
      vb.customize [ "guestproperty", "set", :id, "/VirtualBox/GuestAdd/VBoxService/--timesync-set-threshold", 4000 ]
  end

  # Run the script: vagrant.sh on the Virtual Machine
  config.vm.provision "shell", path: "vagrant/vagrant.sh"

end