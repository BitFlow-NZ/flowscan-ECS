using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Exceptions
{
    public class EventItemNotExistException(int EventItemId): Exception($"EventItem with ID {EventItemId} not exists.")
    {
        
    }
}