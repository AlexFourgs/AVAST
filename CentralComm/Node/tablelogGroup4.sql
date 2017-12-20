CREATE TABLE `group4`.`log` ( `logTimeStamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `logDevice` VARCHAR(100) NOT NULL , `logContent` VARCHAR(255) NOT NULL , `logState` TEXT NOT NULL , PRIMARY KEY (`logTimeStamp`, `logDevice`)) ENGINE = InnoDB;
