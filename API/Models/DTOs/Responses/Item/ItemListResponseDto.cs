using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.DTOs.Responses.Item
{
    public class ItemListResponseDto
    {
        public int Total { get; set; }

        public List<ItemBasicInfoResponseDto> Items { get; set; }
    }
}