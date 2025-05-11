using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace API.Controllers
{

    public class UploadController : BaseApiController
    {
        private readonly IAmazonS3 _s3Client;

        public UploadController(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }
        /// <summary>
        /// Generate a presigned URL for uploading files to S3
        /// </summary>
        /// <param name="request">The request containing file type and folder</param>
        /// 
        [HttpPost("get-presigned-url")]
        public async Task<IActionResult> GetPresignedUrl([FromBody] PresignedUrlRequest request)
        {
            // Validate request
            if (string.IsNullOrEmpty(request.FileType))
            {
                return BadRequest("File type is required");
            }

            try
            {
                string fileName = $"{request.Folder}/{Guid.NewGuid()}.{request.FileExtension}";

                // Generate presigned URL with 5 minute expiration
                var urlRequest = new GetPreSignedUrlRequest
                {
                    BucketName = "flowscan-web",
                    Key = fileName,
                    Expires = DateTime.UtcNow.AddMinutes(5),
                    ContentType = request.FileType,
                    Verb = HttpVerb.PUT
                };

                string uploadUrl = _s3Client.GetPreSignedURL(urlRequest);

                // Generate a public URL for the uploaded file
                string publicUrl = $"https://flowscan-web.s3.ap-southeast-2.amazonaws.com/{fileName}";

                return Ok(new
                {
                    uploadUrl = uploadUrl,
                    publicUrl = publicUrl,
                    fileKey = fileName
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to generate presigned URL: {ex.Message}");
            }
        }
    }
    /// <summary>
    /// Request model for generating a presigned URL
    /// </summary>
    /// <param name="FileType">The MIME type of the file to be uploaded</param>
    /// <param name="FileExtension">The file extension (default is "png")</param>
    /// <param name="Folder">The folder in S3 where the file will be uploaded (default is "captured-image")</param>
    public class PresignedUrlRequest
    {
        public string FileType { get; set; }
        public string FileExtension { get; set; } = "png";
        public string Folder { get; set; } = "captured-image";
    }
}