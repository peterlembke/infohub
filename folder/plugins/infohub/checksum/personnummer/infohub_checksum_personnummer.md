# Infohub Checksum Personnummer
Calculate the last digit in the Swedish personal number  

# Introduction
In Sweden, every citizen have a personal number. You can read more about this on <a href="https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)" target="_blank">Wikipedia</a>.  
The last digit is the checksum. It is used to check if the personnummer you entered is valid.  

# The algorithm
One colud think that the Luhn algorithm is used here, but it is not. It is a variation of the Luhn. If you calculate a personnummer checksum with Luhn you get a different result.  
The difference between the algorithms are that Luhn double the digit in the even positions, the personnummer double the digits in the uneven positions.  

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Since 2017-02-25 by Peter Lembke  
