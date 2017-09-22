install oracledb

 - ดาวน์โหลด และติดตั้ง python 2.7  and set path
 - ดาวน์โหลด และติดตั้ง nodejs and set path 
 - ดาวน์โหลด และติดตั้ง Microsoft Visual C++ 2005 https://www.microsoft.com/en-us/download/details.aspx?id=18471 
 - ดาวน์โหลด Oracle Instant Client  จาก https://drive.google.com/file/d/0B9npvwiCkBysNjRGRjBSTktVSVk/view?usp=sharing
 	-แตกไฟล์เอาไปเก็บไว้ที่ C:  จะได้ C://oracle/instantclient/
 - set path ไปที่ Control Panel -> System -> Advanced System Settings -> Advanced -> Environment Variables  -> System variables -> PATH	( C:\oracle\instantclient  )
 -  
   เปิด CMD โหมด Admin cd:tdc-new
   set OCI_LIB_DIR=C:\oracle\instantclient\sdk\lib\msvc
   set OCI_INC_DIR=C:\oracle\instantclient\sdk\include
   
   npm install --save oracledb  
   npm rebuild node-sass
