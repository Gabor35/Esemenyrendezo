using System;
using System.Collections.Generic;

namespace esemenyrendezo.Models;

public partial class ChatMessage
{
    public int Id { get; set; }

    public string User { get; set; } = null!;

    public string Text { get; set; } = null!;

    public DateTime Time { get; set; }
}
