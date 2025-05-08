using Microsoft.EntityFrameworkCore;
using API.Data;

public class RepairMigrationHistory
{
    public static void Repair(StoreContext context, ILogger logger)
    {
        logger.LogInformation("Starting migration history repair...");

        try
        {
            // Check if __EFMigrationsHistory table exists
            bool tableExists = false;
            using (var command = context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = '__EFMigrationsHistory' LIMIT 1;";
                context.Database.OpenConnection();
                tableExists = command.ExecuteScalar() != null;
                context.Database.CloseConnection();
            }

            if (!tableExists)
            {
                // Create the table
                using (var command = context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = @"
                        CREATE TABLE `__EFMigrationsHistory` (
                            `MigrationId` varchar(150) NOT NULL,
                            `ProductVersion` varchar(32) NOT NULL,
                            PRIMARY KEY (`MigrationId`)
                        );";
                    context.Database.OpenConnection();
                    command.ExecuteNonQuery();
                    context.Database.CloseConnection();
                }

                logger.LogInformation("Created missing __EFMigrationsHistory table");
            }

            // Insert the migration record if it doesn't exist
            using (var command = context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "INSERT IGNORE INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`) VALUES ('20250508095936_InitialCreate', '8.0.5');";
                context.Database.OpenConnection();
                command.ExecuteNonQuery();
                context.Database.CloseConnection();
            }

            logger.LogInformation("Migration history repaired successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to repair migration history");
            throw;
        }
    }
}