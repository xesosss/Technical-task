-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: users
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin1','$2b$10$RZnyvCQrIOP5CsW9cDvQzOZyolJeYp1JtcsmfQGUn0Ck9SBBd7tq6'),(2,'admin2','$2b$10$F.viOFSlKdFWjUwuvKDpXOQLtDdoITzS5oM6vJlzeN0oiMSxk9EKq');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `birthdate` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Lorraine','Bruce','Female','SXn$0Va%MW','salazarmaria','1974-10-28'),(2,'Julie','Barrera','Female','C$75XEcEw!','jrodriguez','2003-08-15'),(3,'Ronald','Miller','Male','*zxyn)@w0Z','cortezraymond','2023-08-14'),(4,'Lisa','Gonzalez','Female','+9ZFRUV!+p','ostewart','2024-10-15'),(5,'Carla','Holden','Female','+7sNYFbZ%&','kyleblair','1925-05-22'),(6,'Jeffrey','Anderson','Male','PX3(4Uuy@A','nfox','1973-02-18'),(7,'Brittany','Henderson','Female','zyoXIy6gOd','simmonsjessica','1973-03-02'),(9,'Tina','Smith','Female','J!7j3+3txM','smithlauren','1962-12-10'),(10,'Michael','Miller','Male','b#AhWf13+T','twhite','1942-08-11'),(12,'Paula','Walker','Female','YF(41%MI64','sthompson','2003-08-27'),(13,'Jennifer','Berry','Female','mfpRm*oa*E','williamsnicholas','1956-06-06'),(14,'Justin','Smith','Male','YcZpU3EWN4','jmartinez','1986-03-20'),(15,'Zachary','Armstrong','Male','5*u4RHIEBd','scollins','1924-06-14'),(16,'Shawn','Reeves','Male','0Z5FaMA2I)','ojackson','2001-12-02'),(17,'Timothy','White','Male','XX)v(uv6r5','tallen','1991-05-12'),(18,'Mary','Phillips','Female','K73)lv!aq@','phillipspamela','1946-01-02'),(19,'Danielle','Hamilton','Female','JXv3(tkR3K','kburton','2005-05-16'),(20,'John','Kelly','Male','l(Y0eINm%N','rkelly','1952-06-27'),(21,'Courtney','Cole','Female','7jU+qZbqMP','karensmith','1966-06-10'),(22,'Joshua','Brown','Male','w!@Fq8LE@8','matthewdavis','1967-03-30'),(23,'Joseph','Collins','Male','llJNFz1dIP','zthomas','1957-04-04'),(24,'James','Evans','Male','sl1*aD5BtN','mgarcia','1928-10-02'),(25,'Anna','Gonzalez','Female','keZ3NqkuTq','sallygonzalez','1993-03-27'),(26,'Sarah','Adams','Female','TT)qAPs*5b','sallen','1931-12-21'),(27,'Brittany','Jenkins','Female','1HJ1g)Meud','jwatson','1962-08-26'),(28,'Jeremy','Morgan','Male','Ob4n!W(NTA','lroberts','1960-04-23'),(30,'Patrick','Gonzalez','Male','t2FgEgfT3w','mscott','1981-01-20');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-11  3:37:58
