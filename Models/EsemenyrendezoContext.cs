using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace esemenyrendezo.Models;

public partial class EsemenyrendezoContext : DbContext
{
    public EsemenyrendezoContext()
    {
    }

    public EsemenyrendezoContext(DbContextOptions<EsemenyrendezoContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Bejelentkeze> Bejelentkezes { get; set; }

    public virtual DbSet<ChatMessage> ChatMessages { get; set; }

    public virtual DbSet<Esemeny> Esemenies { get; set; }

    public virtual DbSet<Felhasznalo> Felhasznalos { get; set; }

    public virtual DbSet<Reszvetel> Reszvetels { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
               // => optionsBuilder.UseMySQL("SERVER=localhost;PORT=3306;DATABASE=esemenyrendezo;USER=root;PASSWORD=;SSL MODE=none;");
               => optionsBuilder.UseMySQL("SERVER=esemenyrendezo.mysql.database.azure.com;PORT=3306;DATABASE=esemenyrendezo;USER=feherd;PASSWORD=Dani1234!;");
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Bejelentkeze>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("bejelentkezes");

            entity.Property(e => e.BejelentkezesDatuma)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("datetime");
            entity.Property(e => e.BejelentkezesId)
                .HasColumnType("int(11)")
                .HasColumnName("BejelentkezesID");
            entity.Property(e => e.FelhasznaloId)
                .HasColumnType("int(11)")
                .HasColumnName("FelhasznaloID");
            entity.Property(e => e.Ipaddress)
                .HasMaxLength(45)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("IPAddress");
        });

        modelBuilder.Entity<ChatMessage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("chat_messages");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Text)
                .HasColumnType("text")
                .HasColumnName("text");
            entity.Property(e => e.Time)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("time");
            entity.Property(e => e.User)
                .HasMaxLength(30)
                .HasColumnName("user");
        });

        modelBuilder.Entity<Esemeny>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("esemeny");

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.Cime).HasMaxLength(255);
            entity.Property(e => e.Datum).HasColumnType("datetime");
            entity.Property(e => e.Helyszin).HasMaxLength(255);
            entity.Property(e => e.Kepurl).HasMaxLength(64);
            entity.Property(e => e.Leiras)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text");
        });

        modelBuilder.Entity<Felhasznalo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("felhasznalo");

            entity.HasIndex(e => e.Email, "Email").IsUnique();

            entity.HasIndex(e => e.FelhasznaloNev, "FelhasznaloNev").IsUnique();

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.Aktiv).HasColumnType("int(1)");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FelhasznaloNev).HasMaxLength(100);
            entity.Property(e => e.FenykepUtvonal).HasMaxLength(64);
            entity.Property(e => e.Hash)
                .HasMaxLength(64)
                .HasColumnName("HASH");
            entity.Property(e => e.Jogosultsag).HasColumnType("int(1)");
            entity.Property(e => e.RegisztracioDatuma)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("datetime");
            entity.Property(e => e.Salt)
                .HasMaxLength(64)
                .HasColumnName("SALT");
            entity.Property(e => e.TeljesNev).HasMaxLength(60);
        });

        modelBuilder.Entity<Reszvetel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("reszvetel");

            entity.HasIndex(e => e.EsemenyId, "EsemenyID");

            entity.HasIndex(e => new { e.FelhasznaloId, e.EsemenyId }, "FelhasznaloID").IsUnique();

            entity.Property(e => e.Id).HasColumnType("int(11)");
            entity.Property(e => e.EsemenyId).HasColumnType("int(11)");
            entity.Property(e => e.FelhasznaloId).HasColumnType("int(11)");
            entity.Property(e => e.Visszajelzes)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("tinyint(4)");

            entity.HasOne(d => d.Esemeny).WithMany(p => p.Reszvetels)
                .HasForeignKey(d => d.EsemenyId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("reszvetel_ibfk_2");

            entity.HasOne(d => d.Felhasznalo).WithMany(p => p.Reszvetels)
                .HasForeignKey(d => d.FelhasznaloId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("reszvetel_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
