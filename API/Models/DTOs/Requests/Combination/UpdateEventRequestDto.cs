using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Models.DTOs.Requests.Event;
using API.Models.DTOs.Requests.EventItem;

namespace API.Models.DTOs.Requests.Combination
{
    public class UpdateEventRequestDto
    {
        public EventUpdateRequestDto Event { get; set; }
        public List<EventItemAddIntoNewEventRequestDto> EventItems { get; set; }
    }
}