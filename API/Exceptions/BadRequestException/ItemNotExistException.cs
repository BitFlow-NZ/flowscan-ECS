using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Exceptions
{
    public class ItemNotExistException(int itemId) : Exception($"Item with ID {itemId} not exists.")
    {
    }
}