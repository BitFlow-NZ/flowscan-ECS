using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using API.DTOs.Responses;
using API.Models.DTOs.Base;
using API.Utils;

namespace API.Models.DTOs.Responses.Event
{
    public class EventResponseDto : BaseEventDto
    {
        public EventResponseDto(Entities.Event e)
        {
            Id = e.Id;
            Name = e.Name;
            Time = e.Time.ToCustomFormat();
            DoctorName = e.DoctorName;
            PatientName = e.PatientName;
            TheaterNumber = e?.TheaterNumber;
            LastEditTime = e.LastEditTime;
            LastEditPerson = e.LastEditPerson;

        }

        public string Time { get; set; }
        [JsonConverter(typeof(CustomDateTimeConverter))]
        public DateTime LastEditTime { get; set; }



        public int Id { get; set; }
    }
}