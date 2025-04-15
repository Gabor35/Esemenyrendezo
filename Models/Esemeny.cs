using System;
using System.Collections.Generic;

namespace esemenyrendezo.Models;

public partial class Esemeny
{
    public int Id { get; set; }

    public string Cime { get; set; } = null!;

    public string Helyszin { get; set; } = null!;

    public DateTime Datum { get; set; }

    public string? Leiras { get; set; }

    public string Kepurl { get; set; } = null!;

    public virtual ICollection<Reszvetel> Reszvetels { get; set; } = new List<Reszvetel>();
}
