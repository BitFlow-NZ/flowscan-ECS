using System;

namespace API.Utils
{
    public static class DateTimeExtensions
    {
        public static string ToCustomFormat(this DateTime dateTime)
        {
            return dateTime.ToString("yyyy-MM-dd HH:mm:ss");
        }
    }
}