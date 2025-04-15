using System;
using System.Collections.Generic;

namespace esemenyrendezo.Models;

public partial class Bejelentkeze
{
    public int BejelentkezesId { get; set; }

    public int FelhasznaloId { get; set; }

    public DateTime? BejelentkezesDatuma { get; set; }

    public string? Ipaddress { get; set; }

    public bool Sikeres { get; set; }
}
