

namespace API.Exceptions
{
    public class UnitNotExistException(int unitId) : Exception($"Unit with ID {unitId} not exists.")
    {
    }
}