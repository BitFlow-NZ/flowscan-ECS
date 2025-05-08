using API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace API.Data
{
    public class DBInitializer
    {
        public static void Initialize(StoreContext context)
        {
            // Check if required tables exist first
            if (!TablesExist(context))
            {
                // Tables are missing, create them
                CreateRequiredTables(context);
            }

            // Only try to seed data if we have tables
            if (TablesExist(context))
            {
                // Check if tables already have data
                if (!context.Items.Any() && !context.Units.Any())
                {
                    try
                    {
                        // Execute SQL script for seeding
                        ExecuteSqlScript(context);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error seeding data: {ex.Message}");
                    }
                }
            }
        }

        private static bool TablesExist(StoreContext context)
        {
            try
            {
                // Create a new connection for this check
                using var connection = context.Database.GetDbConnection();
                connection.Open();
                using var command = connection.CreateCommand();
                command.CommandText = @"
                    SELECT COUNT(*) 
                    FROM information_schema.tables 
                    WHERE table_schema = DATABASE() 
                    AND table_name IN ('Items', 'Units', 'BarCodes', 'Events', 'EventItems', 'OCRItems', 'Credentials');";
                var result = command.ExecuteScalar();
                var count = Convert.ToInt32(result);
                connection.Close();

                // If we found all 7 tables
                return count == 7;
            }
            catch
            {
                return false;
            }
        }

        private static void CreateRequiredTables(StoreContext context)
        {
            try
            {
                // Use migrations to create tables
                context.Database.Migrate();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating tables: {ex.Message}");

                // If migrations fail, create essential tables with raw SQL
                // Don't reuse connections - let EF create fresh ones
                CreateTablesWithRawSQL(context);
            }
        }

        private static void CreateTablesWithRawSQL(StoreContext context)
        {
            // SQL for creating required tables if not exists
            string[] createTableCommands = {
                @"CREATE TABLE IF NOT EXISTS `Items` (
                    `Id` int NOT NULL AUTO_INCREMENT,
                    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Description` longtext CHARACTER SET utf8mb4 NULL,
                    `Img` longtext CHARACTER SET utf8mb4 NULL,
                    `LastEditTime` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`)
                );",

                @"CREATE TABLE IF NOT EXISTS `Units` (
                    `Id` int NOT NULL AUTO_INCREMENT,
                    `ItemId` int NOT NULL,
                    PRIMARY KEY (`Id`),
                    KEY `IX_Units_ItemId` (`ItemId`),
                    CONSTRAINT `FK_Units_Items_ItemId` FOREIGN KEY (`ItemId`) REFERENCES `Items` (`Id`) ON DELETE CASCADE
                );",

                @"CREATE TABLE IF NOT EXISTS `BarCodes` (
                    `Id` int NOT NULL AUTO_INCREMENT,
                    `Type` int NOT NULL,
                    `Content` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `UnitId` int NOT NULL,
                    PRIMARY KEY (`Id`),
                    KEY `IX_BarCodes_UnitId` (`UnitId`),
                    CONSTRAINT `FK_BarCodes_Units_UnitId` FOREIGN KEY (`UnitId`) REFERENCES `Units` (`Id`) ON DELETE CASCADE
                );"
            };

            // Execute each command separately without transaction to avoid connection issues
            foreach (var command in createTableCommands)
            {
                try
                {
                    // Let EF manage the connection for each command
                    context.Database.ExecuteSqlRaw(command);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error executing SQL: {ex.Message}");
                    // Continue with other commands
                }
            }
        }

        private static void ExecuteSqlScript(StoreContext context)
        {
            string sqlFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "init.sql");

            // For development, you might need to adjust the path
            if (!File.Exists(sqlFilePath))
            {
                sqlFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "init.sql");
            }

            if (!File.Exists(sqlFilePath))
            {
                throw new FileNotFoundException("Could not find init.sql file");
            }

            string script = File.ReadAllText(sqlFilePath);

            // Extract only INSERT statements from the SQL script
            var insertStatements = ExtractInsertStatements(script);

            using var transaction = context.Database.BeginTransaction();
            try
            {
                foreach (var statement in insertStatements)
                {
                    if (!string.IsNullOrWhiteSpace(statement))
                    {
                        context.Database.ExecuteSqlRaw(statement);
                    }
                }

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        private static List<string> ExtractInsertStatements(string script)
        {
            var insertStatements = new List<string>();
            var lines = script.Split(new[] { '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries);
            var currentStatement = new StringBuilder();
            var insideInsert = false;

            foreach (var line in lines)
            {
                var trimmedLine = line.Trim();

                // Skip comment lines and drop/create table statements
                if (trimmedLine.StartsWith("--") ||
                    trimmedLine.StartsWith("/*") ||
                    trimmedLine.StartsWith("DROP TABLE") ||
                    trimmedLine.StartsWith("CREATE TABLE") ||
                    trimmedLine.StartsWith("SET ") ||
                    trimmedLine.StartsWith("ALTER "))
                {
                    // If we were building an insert statement, terminate it
                    if (insideInsert)
                    {
                        insideInsert = false;
                        if (currentStatement.Length > 0)
                        {
                            insertStatements.Add(currentStatement.ToString());
                            currentStatement.Clear();
                        }
                    }
                    continue;
                }

                // Process INSERT statements
                if (trimmedLine.StartsWith("INSERT INTO", StringComparison.OrdinalIgnoreCase))
                {
                    insideInsert = true;
                    currentStatement.Clear();
                    currentStatement.AppendLine(trimmedLine);
                }
                else if (insideInsert)
                {
                    currentStatement.AppendLine(trimmedLine);

                    // Check if this line ends the insert statement
                    if (trimmedLine.EndsWith(";"))
                    {
                        insertStatements.Add(currentStatement.ToString());
                        currentStatement.Clear();
                        insideInsert = false;
                    }
                }
            }

            // Add any remaining statement
            if (insideInsert && currentStatement.Length > 0)
            {
                insertStatements.Add(currentStatement.ToString());
            }

            return insertStatements;
        }
    }
}