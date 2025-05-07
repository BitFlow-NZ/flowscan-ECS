namespace API.Models.Entities
{
    public class Credential
    {
        public int Id { get; set; }

        public required string InvitationCodeHash { get; set; }
    }
}