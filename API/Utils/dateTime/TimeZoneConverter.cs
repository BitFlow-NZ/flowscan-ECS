using System;

namespace API.Utils
{
    public static class TimeZoneConverter
    {
        private static readonly TimeZoneInfo NzdtTimeZone = TimeZoneInfo.FindSystemTimeZoneById("New Zealand Standard Time");

        public static DateTime ConvertUtcToNzdt(DateTime utcDateTime)
        {
            if (utcDateTime.Kind != DateTimeKind.Utc)
            {
                throw new ArgumentException("The DateTime object must have the Kind property set to DateTimeKind.Utc.", nameof(utcDateTime));
            }
            return TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, NzdtTimeZone);
        }
    }
}