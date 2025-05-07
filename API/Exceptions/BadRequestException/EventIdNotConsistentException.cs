using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Exceptions.BadRequestException
{
    public class EventIdNotConsistentException(): Exception($"EventId from EventItem is not consistent with the EventId")
    {
        
    }
}