using System;
using System.Collections.Generic;

namespace esemenyrendezo.Models;

public partial class Kijelentkeze
{
    public int Id { get; set; }

    public int FelhasznaloId { get; set; }

    public DateTime? KijelentkezesDatuma { get; set; }

    public string? Ipaddress { get; set; }

    public virtual Felhasznalo Felhasznalo { get; set; } = null!;
}
