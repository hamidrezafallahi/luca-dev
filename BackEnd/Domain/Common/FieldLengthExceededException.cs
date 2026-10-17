namespace OnlineShop.Domain.Common;

/// <summary>
/// One string value that is longer than its column allows.
/// Field is the camelCase property name, which matches the admin form field name.
/// </summary>
public sealed record FieldLengthViolation(string Field, int MaxLength, int ActualLength);

/// <summary>
/// Raised before SaveChanges when string values exceed their configured max length,
/// so the API can answer 400 with the offending fields instead of a database 500.
/// </summary>
public class FieldLengthExceededException : DomainException
{
    public IReadOnlyList<FieldLengthViolation> Violations { get; }

    public FieldLengthExceededException(IReadOnlyList<FieldLengthViolation> violations)
        : base(
            "Some fields are too long: " + string.Join(", ",
                violations.Select(v => $"{v.Field} ({v.ActualLength}/{v.MaxLength})")),
            "FIELD_TOO_LONG")
    {
        Violations = violations;
    }
}
