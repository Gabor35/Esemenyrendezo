
using esemenyrendezo.Models;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;

namespace esemenyrendezo
{
    public class Program
    {
        public static int SaltLength = 64;

        public static Dictionary<string, Felhasznalo> LoggedInUsers = new Dictionary<string, Felhasznalo>();
        public static string GenerateSalt()
        {
            Random random = new Random();
            string karakterek = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            string salt = "";
            for (int i = 0; i < SaltLength; i++)
            {
                salt += karakterek[random.Next(karakterek.Length)];
            }
            return salt;
        }
        public static async Task SendEmail(string mailAddressTo, string subject, string body)
        {
            MailMessage mail = new MailMessage();
            SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");
            mail.From = new MailAddress("esemenyrendezo@gmail.com");
            mail.To.Add(mailAddressTo);
            mail.Subject = subject;
            mail.Body = body;

            /*System.Net.Mail.Attachment attachment;
            attachment = new System.Net.Mail.Attachment("");
            mail.Attachments.Add(attachment);*/

            SmtpServer.Port = 587;
            SmtpServer.Credentials = new System.Net.NetworkCredential("esemenyrendezo@gmail.com", "hcqt anxr hwor hwyd");

            SmtpServer.EnableSsl = true;

            await SmtpServer.SendMailAsync(mail);

        }


        public static string CreateSHA256(string input)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] data = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
                var sBuilder = new StringBuilder();
                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString("x2"));
                }
                return sBuilder.ToString();
            }
        }

        public static void Main(string[] args)
        {
            //Ezt ki kell venni éless üzemnél!! Ez csak a tszt üzemhez van!!!
            Program.LoggedInUsers["43062203-14a0-415f-9f60-57abb45e1754"] = new Felhasznalo { Id=1, Jogosultsag = 9 };

            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin() // itt hibás volt az 5000-es frontend? port engedélyezése
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });


            /*builder.WebHost.ConfigureKestrel(options =>
            {
                options.ListenAnyIP(5000);
                options.ListenAnyIP(5001, ListenOptions =>
                {
                    ListenOptions.UseHttps("certificate.pfx", "YourPassword");
                });
            });*/


            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();
            app.UseCors();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}

//Scaffold-DbContext "SERVER=localhost;PORT=3306;DATABASE=esemenyrendezo;USER=root;PASSWORD=;SSL MODE=none;" mysql.entityframeworkcore -outputdir Models -f
//
/*Felhasznalo body
 {
  "id": 0,
  "felhasznaloNev": "string",
  "teljesNev": "string",
  "salt": "string",
  "hash": "string",
  "email": "string",
  "jogosultsag": 0,
  "aktiv": 0,
  "regisztracioDatuma": "2024-12-18T08:32:36.098Z"
 }
*/