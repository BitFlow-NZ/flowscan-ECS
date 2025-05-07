using System.ComponentModel.DataAnnotations;



namespace API.Models.Entities

{
    /// <summary>
    /// Represents an event that is scheduled to take place.
    /// </summary>
    public class Event
    {
        /// <summary>
        /// The unique identifier for the event.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// The name of the event.
        /// </summary>
        [Required]
        [StringLength(50, ErrorMessage = "Event Name must not exceed 50 characters.")]
        [RegularExpression(@"^[A-Za-z0-9\s_-]+$", ErrorMessage = "Event Name can only contain letters, numbers, spaces, hyphens, and underscores.")]
        public required string Name { get; set; }

        /// <summary>
        /// The scheduled time of the event.
        /// </summary>
        [Required]
        [DataType(DataType.DateTime, ErrorMessage = "Event Time must be a valid date and time.")]
        public required DateTime Time { get; set; }

        /// <summary>
        /// The name of the doctor who is responsible for the event.
        /// </summary>
        [Required]
        [StringLength(100, ErrorMessage = "Doctor Name must not exceed 100 characters.")]
        [RegularExpression(@"^[A-Za-z\s.]+$", ErrorMessage = "Doctor Name can only contain letters, spaces, and periods.")]
        public required string DoctorName { get; set; }

        /// <summary>
        /// The name of the patient who is associated with the event.
        /// </summary>
        [Required]
        [StringLength(100, ErrorMessage = "Patient Name must not exceed 100 characters.")]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "Patient Name can only contain letters and spaces.")]
        public required string PatientName { get; set; }

        /// <summary>
        /// The number of the theater where the event will take place.
        /// </summary>
        [StringLength(100, ErrorMessage = "Theater Number must not exceed 10 characters.")]
        [RegularExpression(@"^[A-Za-z0-9-]+$", ErrorMessage = "Theater Number can only contain letters, numbers, and hyphens.")]
        public required string? TheaterNumber { get; set; }

        /// <summary>
        /// The time when the event was edited.
        /// </summary>
        [Required]
        [DataType(DataType.DateTime, ErrorMessage = "Latest Update Time must be a valid date and time.")]
        public required DateTime LastEditTime { get; set; }

        /// <summary>
        /// The name of the person who last edited the event.
        /// </summary>
        [Required]
        [StringLength(100, ErrorMessage = "Last Edit Person must not exceed 100 characters.")]
        public required string LastEditPerson { get; set; }

        /// <summary>
        /// The collection of event items that are associated with the event.(navigation property)
        /// </summary>
        public ICollection<EventItem>? EventItems { get; set; }

    }
}