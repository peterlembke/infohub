# Require HTTPS
All sites should use HTTPS. HTTPS gives your traffic a well needed encryption and validates that the certificate is valid.

Then we could require HTTPS to always be there or else Infohub will not work.

&& traffic,https

## Comment 1
Https can not be the only protection. It is just something extra that might protect against some groups.
It is a false security to require https. One might think that https is the only thing you need.

Auto-detecting HTTPS and set it as a requirement is not a good way to go. 
We will mention HTTPS in the installation document and urge site owners to use it.
And we will urge site users to only enter sites that have HTTPS. That is common knowledge by now.

If you want to run your local Infohub with HTTP then Infohub should not stop you.
Infohub also has built in signing of all packages and optional encryption of the traffic data.

Require HTTPS for Infohub to work is a bad idea.

# License
This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later

Created 2021-11-21 by Peter Lembke  
Changed 2021-11-21 by Peter Lembke  
