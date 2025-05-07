

namespace API.Exceptions.BadRequestException
{
    public class OCRItemNotExistException(int id) : Exception($"OCR Item with ID {id} not exists.")
    {

    }
}