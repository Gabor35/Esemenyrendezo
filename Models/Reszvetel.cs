using System;
using System.Collections.Generic;

namespace esemenyrendezo.Models;

public partial class Reszvetel
{
    public int Id { get; set; }

    public int FelhasznaloId { get; set; }

    public int EsemenyId { get; set; }

    public sbyte? Visszajelzes { get; set; }

    public virtual Esemeny Esemeny { get; set; } = null!;

    public virtual Felhasznalo Felhasznalo { get; set; } = null!;
}
