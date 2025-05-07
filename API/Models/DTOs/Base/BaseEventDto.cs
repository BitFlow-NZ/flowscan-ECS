using API.Models.Entities;

namespace API.DTOs.Responses
{
    public class BaseEventDto
    {

        public string Name { get; set; }
        public DateTime Time { get; set; }
        public string DoctorName { get; set; }
        public string PatientName { get; set; }
        public string? TheaterNumber { get; set; }
        public string LastEditPerson { get; set; }
    }
}