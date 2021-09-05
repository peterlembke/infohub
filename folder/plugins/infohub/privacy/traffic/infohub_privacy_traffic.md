# Infohub Privacy Traffic

How to protect your information on its way to/from your server.

# Introduction

When your secure browser communicate with your secure server then the traffic pass through your network, through your
internet service providers (ISP) network, through several networks until it reaches your servers internet provider and
finally your server.

## Meta information

Everyones traffic are automatically reviewed and at least meta data are stored. Who, when, from, to, about.

You can not avoid this logging but you can give false information by using a VPN tunnel.

The "who" and "when" can't be changed, it is you. From is the IP number and other information about your device. I don't
know if a VPN tunnel can protect that information. The "to" are protected by the VPN tunnel. The "to" will point to one
of the VPN tunnel entry points. Your data will pop up at some exit point in some country. The "about" can only be "
unknown encrypted traffic to a VPN tunnel provider".

## View information

If you surf to a site that use HTTPS then your traffic are encrypted from the browser to the server. If you also use a
VPN tunnel then your traffic are encrypted from your computer to the VPN tunnel exit point. Using HTTPS and VPN tunnel
gives a basic protection from viewing your information.

The HTTPS protocol have had some security issues. There are shady certificate providers. HTTPS is your best protection
against viewing eyes but it is not to be trusted to 100%.

A VPN tunnel provided from a good company gives encrypted protection only to the VPN tunnel exit point. The rest of the
way to the server your data does not have that extra protection. Having a VPN tunnel is the best protection against
logging your data.

Single point encryption is another way of stopping viewing your information. You encrypt the data in your browser. The
data are never decrypted. If you want the data it is still encrypted and you are the only one that can decrypt the data
in your browser. This is built into Infohub when you save data through the Tree plugin.

## Manipulate information

Manipulation of information by a third party. The man in the middle. If for some reason your domain and HTTPS are
hijacked and a person can monitor your traffic then they can also manipulate the traffic before it reaches the you or
the server. Your encrypted traffic can not be manipulated but not all messages are encrypted.

Infohub has a signing mechanism that uses checksums of the data and sign the checksum. It does still allow some
manipulation but it is much harder and much more limited what can be manipulated.

# The tests

The tests in this plugin are

* Do we use HTTPS
* Does the server have a valid certificate
* Do we use a VPN tunnel

## HTTPS

# License

This documentation is copyright (C) 2020 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2020-05-01 by Peter Lembke  
Updated 2020-05-01 by Peter Lembke  
