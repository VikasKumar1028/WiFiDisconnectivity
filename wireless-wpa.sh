#!/bin/sh 
iface=wlan0

#shut down interface
ifconfig $iface down

#set ad-hoc/management of wireless device
iwconfig $iface mode Managed

#enable interface
ifconfig $iface up

#stop any persistent wireless wpa2 sessions
killall wpa_supplicant

#apply WPA/WPA2 personal settings to device
wpa_supplicant -B -Dwext -i $iface -c ./wireless-wpa.conf -dd

#obtain an IP address
dhclient $iface
