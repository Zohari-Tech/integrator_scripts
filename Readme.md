# Service integrations

Database Payments 

Insert into Services Table

+-------------+------------------------------+------+-----+---------+----------------+
| Field       | Type                         | Null | Key | Default | Extra          |
+-------------+------------------------------+------+-----+---------+----------------+
| ID          | int(11)                      | NO   | PRI | <null>  | auto_increment |
| Name        | varchar(12)                  | NO   |     | <null>  |                |
| Description | text                         | NO   |     | <null>  |                |
| ServiceURL  | varchar(64)                  | NO   |     | <null>  |                |
| CountryID   | int(11)                      | NO   | MUL | <null>  |                |
| StatusID    | int(11)                      | NO   | MUL | <null>  |                |
| Statics     | longtext                     | NO   |     | <null>  |                |
| Headers     | longtext                     | NO   |     | <null>  |                |
| HttpMethod  | varchar(6)                   | NO   |     | <null>  |                |
| Code        | varchar(64)                  | NO   | UNI | <null>  |                |
| format      | enum('JSON','XML')           | NO   |     | <null>  |                |
| type        | enum('SYNC','ASYNC')         | NO   |     | <null>  |                |
| Environment | enum('PRODUCTION','TESTBED') | NO   |     | <null>  |                |
+-------------+------------------------------+------+-----+---------+----------------+

```sql 
INSERT INTO Services (Name, Description, ServiceURL, CountryID,StatusID,Statics,Headers,HttpMethod,Code,format,type,Environment)
VALUES (
'EMQ_C2C_CHN',
'EMQ C2C Transfers for China in banks',
'https://sandbox-partner.emq.com/v1/transfers/',1,1,
'{"password":"ulJg90sF2ISjZW2ig9o1","username":"afrisend", "BASE_URL" : "https://sandbox-partner.emq.com/v1/transfers/"}',
'{"Content-Type":["application/json"]}',
'PUT',
'6316d5aebd87429ea9137d29',
'JSON',
'ASYNC',
'TESTBED'
);
```

Attach services to application.
+-------------+-------------+------+-----+---------+----------------+
| Field       | Type        | Null | Key | Default | Extra          |
+-------------+-------------+------+-----+---------+----------------+
| ID          | int(11)     | NO   | PRI | <null>  | auto_increment |
| AppCode     | varchar(64) | NO   | MUL | <null>  |                |
| ServiceCode | varchar(64) | NO   | MUL | <null>  |                |
| StatusID    | int(11)     | NO   | MUL | <null>  |                |
| Settings    | longtext    | NO   |     | <null>  |                |
+-------------+-------------+------+-----+---------+----------------+


```sql
INSERT INTO `AppServices` (`AppCode`,`ServiceCode`,`StatusID`,`Settings`) VALUES ('62ea315fb47687d9cbbf6827','6316d482c901276d1a868fb5',3,'{}');
```

Incase App is not there and needs to be setup
+---------------+-------------+------+-----+---------+----------------+
| Field         | Type        | Null | Key | Default | Extra          |
+---------------+-------------+------+-----+---------+----------------+
| ID            | int(11)     | NO   | PRI | <null>  | auto_increment |
| Name          | varchar(16) | NO   |     | <null>  |                |
| Code          | varchar(64) | NO   | UNI | <null>  |                |
| StatusID      | int(11)     | NO   | MUL | <null>  |                |
| CountryID     | int(11)     | NO   | MUL | <null>  |                |
| Multinational | tinyint(1)  | NO   |     | <null>  |                |
| Secret        | varchar(64) | NO   |     | <null>  |                |
+---------------+-------------+------+-----+---------+----------------+

All Statuses are defined in the statues table
+-------------+-------------+------+-----+---------+----------------+
| Field       | Type        | Null | Key | Default | Extra          |
+-------------+-------------+------+-----+---------+----------------+
| ID          | int(11)     | NO   | PRI | <null>  | auto_increment |
| Name        | varchar(32) | NO   |     | <null>  |                |
| Code        | varchar(8)  | NO   | UNI | <null>  |                |
| Description | text        | NO   |     | <null>  |                |
+-------------+-------------+------+-----+---------+----------------+
