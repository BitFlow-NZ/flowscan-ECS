

using API.Models.DTOs.Requests.BarCode;
using API.Models.DTOs.Responses.ImgRecognition;
using API.Models.Entities;
using API.Repositories;

namespace API.Services
{
    public class BarCodeService(BarCodeRepository barCodeRepository)
    {
        private readonly BarCodeRepository _barCodeRepository = barCodeRepository;

        public async Task<ItemOCRResponseDto?> SearchItemByBarCode(BarCodeRequestDto barCode)
        {
            BarCodeRequestDto FilteredBarCode = FilterBarCodeString(barCode);
            return await _barCodeRepository.SearchItemByBarCode(FilteredBarCode);
        }

        private static BarCodeRequestDto FilterBarCodeString(BarCodeRequestDto barCodeRequestDto)
        {

            // length validation
            BarcodeLengthValidation(barCodeRequestDto);

            string code;
            if (barCodeRequestDto.Type == BarCodeType.data_matrix)
            {
                //retireve 14 digit GTIN
                try
                {
                    code = barCodeRequestDto.Content.Substring(2, 14);
                }
                catch (Exception)
                {
                    throw new ArgumentException("Invalid bar code length");
                }
            }
            else
            {
                code = barCodeRequestDto.Content;
            }

            return new BarCodeRequestDto
            {
                Type = barCodeRequestDto.Type,
                Content = code
            };

        }

        private static void BarcodeLengthValidation(BarCodeRequestDto barCodeRequestDto)
        {
            if ((barCodeRequestDto.Type == BarCodeType.ean_13 && barCodeRequestDto.Content.Length != 13) ||
                 (barCodeRequestDto.Type == BarCodeType.itf && barCodeRequestDto.Content.Length != 14) ||
                 (barCodeRequestDto.Type == BarCodeType.upc_a && barCodeRequestDto.Content.Length != 12))
            {
                throw new ArgumentException("Invalid bar code length");
            }
        }
    }
}