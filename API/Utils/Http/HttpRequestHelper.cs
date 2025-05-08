

using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authentication;

namespace API.Utils.Http
{
    public class HttpRequestHelper
    {
        private readonly HttpClient _httpClient;
        private readonly string BaseURLDev = "https://inflowcan.net/api";
        private readonly string BaseURLProd = "http://flowscan-image-recognition-service:5001/api";

        public HttpRequestHelper(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> SendPostRequestAsync<T>(string apiUrl, T requestBody = default)
        {
            var jsonContent = requestBody != null
                ? new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json")
                : new StringContent(string.Empty, Encoding.UTF8, "application/json");

            var BaseURL = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development" ? BaseURLDev : BaseURLProd;

            var request = new HttpRequestMessage(HttpMethod.Post, $"{BaseURL}{apiUrl}")
            {
                Content = jsonContent
            };

            request.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
            if (requestBody != null)
            { request.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json"); }

            var response = await _httpClient.SendAsync(request);

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> SendPostRequestWithRetryAsync<T>(string apiUrl, T requestBody = default, int maxRetries = 5)
        {
            int attempts = 0;
            while (attempts < maxRetries)
            {
                try
                {
                    return await SendPostRequestAsync(apiUrl, requestBody);
                }
                catch (Exception ex)
                {
                    attempts++;
                    if (attempts >= maxRetries)
                        throw;

                    Console.WriteLine($"Request to image-recognition failed, retrying {attempts}/{maxRetries}. Error: {ex.Message}");
                    await Task.Delay(TimeSpan.FromSeconds(Math.Pow(2, attempts))); // Exponential backoff
                }
            }
            throw new Exception("Maximum retry attempts reached");
        }
        public static JsonObject ProcessStringToJsonObject(string jsonString)
        {
            try
            {
                JsonObject? jsonObject = JsonNode.Parse(jsonString) as JsonObject;
                if (jsonObject == null)
                {
                    throw new InvalidOperationException("Invalid JSON format.");
                }
                return jsonObject;
            }
            catch (JsonException ex)
            {
                throw new InvalidOperationException("Failed to parse JSON string.", ex);
            }
        }
    }
}