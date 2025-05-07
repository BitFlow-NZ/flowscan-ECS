using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Exceptions
{
    public class EventNotExistException(int eventId) : Exception($"Event with ID {eventId} not exists.")
    {
    }
}